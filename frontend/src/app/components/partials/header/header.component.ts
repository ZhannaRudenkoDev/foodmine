import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from "../../../services/cart.service";
import { UserService } from "../../../services/user.service";
import { User } from "../../shared/models/User";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  cartQuantity = 0;
  user!: User;
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService,
              private userService: UserService) {
    this.cartService.getCartObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(newCart => {
      this.cartQuantity = newCart.totalCount;
    });

    this.userService.userObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe((newUser) => {
      this.user = newUser;
    })
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.userService.logout();
  }

  get isAuth() {
    return this.user.token;
  }

}
