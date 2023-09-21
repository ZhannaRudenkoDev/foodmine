import { Component, OnDestroy, OnInit } from '@angular/core';
import { Food } from "../../shared/models/Food";
import { FoodService } from "../../../services/food.service";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  foods: Food[] = [];
  destroy$ =  new Subject<void>();

  constructor(private foodService: FoodService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) {
        this.foods = this.foodService.getAllFoodsBySearchTerm(params.searchTerm);
      } else if(params.tag) {
        this.foods = this.foodService.getAllFoodsByTag(params.tag);
      } else {
        this.foods = this.foodService.getAll();
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
