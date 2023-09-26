import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Order } from "../../shared/models/Order";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { CartService } from "../../../services/cart.service";
import { OrderService } from "../../../services/order.service";
import { Subject, takeUntil } from "rxjs";

declare var paypal: any;

@Component({
  selector: 'paypal-button',
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css']
})
export class PaypalButtonComponent implements OnInit, OnDestroy {

  @Input() order!: Order;

  @ViewChild('paypal', {static: true})
  paypalElement!:ElementRef;
  private destroy$ = new Subject<void>()

  constructor(private orderService: OrderService,
              private cartService: CartService,
              private router:Router,
              private toastrService: ToastrService) {
  }

  ngOnInit() {
    const self = this;
    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'CAD',
                  value: self.order.totalPrice,
                },
              },
            ],
          });
        },

        onApprove: async (data: any, actions: any) => {
          const payment = await actions.order.capture();
          this.order.paymentId = payment.id;
          self.orderService.pay(this.order)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
            {
              next: (orderId) => {
                this.cartService.clearCart();
                this.router.navigateByUrl('/track/' + orderId);
                this.toastrService.success(
                  'Payment Saved Successfully',
                  'Success'
                );
              },
              error: (error) => {
                this.toastrService.error('Payment Save Failed', 'Error');
              }
            }
          );
        },

        onError: (err: any) => {
          this.toastrService.error('Payment Failed', 'Error');
        },
      })
      .render(this.paypalElement.nativeElement);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
