import { Component, OnDestroy } from '@angular/core';
import { LoadingService } from "../../../services/loading.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnDestroy {

  isLoading!: boolean;
  private destroy$ = new Subject<void>()


  constructor(private loadingService: LoadingService) {
    loadingService.isLoading
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
