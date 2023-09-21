import { Component, OnInit } from '@angular/core';
import { Food } from "../../shared/models/Food";
import { ActivatedRoute, Router } from "@angular/router";
import { FoodService } from "../../../services/food.service";
import { CartService } from "../../../services/cart.service";

@Component({
  selector: 'app-food-page',
  templateUrl: './food-page.component.html',
  styleUrls: ['./food-page.component.css']
})
export class FoodPageComponent implements OnInit{

  food!: Food;

  constructor(private activatedRoute: ActivatedRoute,
              private foodService: FoodService,
              private router: Router,
              private cartService: CartService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params.id) {
        this.food = this.foodService.getFoodById(params.id);
      }
    })
  }

  addToCart() {
    this.cartService.addToCart(this.food);
    this.router.navigateByUrl('/cart-page')
  }

}
