import { Injectable } from '@angular/core';
import { Cart } from "../components/shared/models/Cart";
import { BehaviorSubject, Observable } from "rxjs";
import { Food } from "../components/shared/models/Food";
import { CartItem } from "../components/shared/models/CartItem";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = this.getCartToLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject<Cart>(this.cart);
  constructor() { }

  addToCart(food: Food) {
    let cartItem = this.cart.items.find(item => item.food.id === food.id);
    if(cartItem) {
      return;
    }
    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStorage();
  }

  removeFromCart(foodId: string) {
    this.cart.items = this.cart.items.filter(item => item.food.id !== foodId);
    this.setCartToLocalStorage();
  }

  changeQuantity(foodId: string, quantity: number) {
    let cartItem = this.cart.items.find(item => item.food.id === foodId);
    if(!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.setCartToLocalStorage();
  }

  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  private setCartToLocalStorage() {
    this.cart.totalPrice = this.cart.items.reduce((prevSum, currentItem) => prevSum + currentItem.price, 0);
    this.cart.totalCount = this.cart.items.reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0);
    const cart = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cart);
    this.cartSubject.next(this.cart);
  }

  private getCartToLocalStorage() {
    const cart = localStorage.getItem('Cart');
    return cart ? JSON.parse(cart) : new Cart();
  }
}
