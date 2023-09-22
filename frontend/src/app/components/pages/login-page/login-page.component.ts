import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../../services/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';
  private destroy$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get fc() {
    return this.loginForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if(this.loginForm.invalid) return;

    this.userService.login(({email: this.fc.email.value, password: this.fc.password.value}))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      });
  }

}

