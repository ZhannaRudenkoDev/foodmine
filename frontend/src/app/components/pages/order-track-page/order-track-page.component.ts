import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { OrderService } from "../../../services/order.service";
import { Order } from "../../shared/models/Order";
import { Observable } from "rxjs";

@Component({
  selector: 'app-order-track-page',
  templateUrl: './order-track-page.component.html',
  styleUrls: ['./order-track-page.component.css']
})
export class OrderTrackPageComponent {

  order!: Observable<Order>;

  constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService) {
    const params = activatedRoute.snapshot.params;
    if(!params.orderId) return;

    this.order = orderService.trackOrderById(params.orderId);
  }
}
