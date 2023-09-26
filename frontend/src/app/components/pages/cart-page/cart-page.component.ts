import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cart } from "../../shared/models/Cart";
import { CartService } from "../../../services/cart.service";
import { CartItem } from "../../shared/models/CartItem";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit, OnDestroy {

  cart!: Cart;
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
      this.cart = cart;
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeFromCart(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem.food.id);
  }

  changeQuantity(cartItem: CartItem, quantityString: string) {
    const quantity = parseInt(quantityString);
    this.cartService.changeQuantity(cartItem.food.id, quantity);
  }

}
