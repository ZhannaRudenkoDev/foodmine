import { Component } from '@angular/core';
import { Order } from "../../shared/models/Order";
import { OrderService } from "../../../services/order.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent {

  order: Order = new Order();

  constructor(private orderService: OrderService, router: Router) {
    this.orderService.getNewOrderForCurrentUser().subscribe((order) => {
      this.order = order;
    }, () => {
      router.navigateByUrl('/checkout')
    })
  }
}
