import { Component, OnDestroy, OnInit } from '@angular/core';
import { Food } from "../../shared/models/Food";
import { ActivatedRoute, Router } from "@angular/router";
import { FoodService } from "../../../services/food.service";
import { CartService } from "../../../services/cart.service";
import { Observable, of, Subject, switchMap, takeUntil } from "rxjs";

@Component({
  selector: 'app-food-page',
  templateUrl: './food-page.component.html',
  styleUrls: ['./food-page.component.css']
})
export class FoodPageComponent implements OnInit, OnDestroy {

  food!: Observable<Food>;
  private destroy$ = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute,
              private foodService: FoodService,
              private router: Router,
              private cartService: CartService) {
    this.food = this.activatedRoute.params.pipe(
      switchMap(params => {
        if (params.id) {
          return this.foodService.getFoodById(params.id);
        } else {
          return of(new Food())
        }
      }),
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addToCart() {
    this.food
      .pipe(takeUntil(this.destroy$))
      .subscribe(food => {
      this.cartService.addToCart(food);
      this.router.navigateByUrl('/cart-page')
    })
  }

}
