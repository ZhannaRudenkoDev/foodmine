import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order } from "../../shared/models/Order";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CartService } from "../../../services/cart.service";
import { UserService } from "../../../services/user.service";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../../services/order.service";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit, OnDestroy {

  order: Order = new Order();
  checkoutForm!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private toaststrService: ToastrService,
              private orderService: OrderService,
              private router: Router) {
    const cart = this.cartService.getCart();
    this.order.items = cart.items;
    this.order.totalPrice = cart.totalPrice;
  }

  ngOnInit() {
    let {name, address} = this.userService.currentUser;
    this.checkoutForm = this.formBuilder.group(({
      name: [name, Validators.required],
      address: [address, Validators.required]
    }))
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get fc() {
    return this.checkoutForm.controls;
  }

  createOrder() {
    if(this.checkoutForm.invalid) {
      this.toaststrService.warning('Please fill the inputs', 'Invalid inputs');
      return;
    }

    if(!this.order.addressLatLng) {
      this.toaststrService.warning('Please select your location on the map', 'Location');
      return;
    }

    this.order.name = this.fc.name.value;
    this.order.address = this.fc.address.value;

    this.orderService.create(this.order)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
      this.router.navigateByUrl('/payment');
    }, (errorResponse) => {
      this.toaststrService.error(errorResponse.error, 'Cart');
    })

  }

}
