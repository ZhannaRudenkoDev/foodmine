import { Component, OnInit } from '@angular/core';
import { Food } from "../../shared/models/Food";
import { FoodService } from "../../../services/food.service";
import { ActivatedRoute } from "@angular/router";
import { Observable, switchMap } from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  foods: Observable<Food[]>;

  constructor(private foodService: FoodService,
              private activatedRoute: ActivatedRoute) {
    this.foods = this.activatedRoute.params.pipe(
      switchMap(params => {
        if (params.searchTerm) {
          return this.foodService.getAllFoodsBySearchTerm(params.searchTerm);
        } else if(params.tag) {
          return this.foodService.getAllFoodsByTag(params.tag);
        } else {
          return this.foodService.getAll();
        }
      })
    );
  }

  ngOnInit() {
  }

}
