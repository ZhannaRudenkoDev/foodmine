import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from "rxjs";
import { User } from "../components/shared/models/User";
import { IUserLogin } from "../components/shared/interfaces/IUserLogin";
import { HttpClient } from "@angular/common/http";
import { USER_LOGIN_URL, USER_REGISTER_URL } from "../components/shared/constants/urls";
import { ToastrService } from "ngx-toastr";
import { IUserRegister } from "../components/shared/interfaces/IUserRegister";

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<User>(this.getUserFromLocaleStorage());
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  get currentUser(): User {
    return this.userSubject.value;
  }

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin)
      .pipe(
        tap((user) => {
          this.setUserToLocaleStorage(user);
          this.userSubject.next(user);

          this.toastrService.success(
            `Welcome to Foodmine ${user.name}!`,
            'Login Successful'
          )
        },
          (error) => {
            this.toastrService.error(
              error.error,
              'Login Failed'
            )
          })
      );
  }

  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister)
      .pipe(
        tap((user) => {
            this.setUserToLocaleStorage(user);
            this.userSubject.next(user);
            this.toastrService.success(
              `Welcome to Foodmine ${user.name}!`,
              'Register Successful'
            )
          },
          (error) => {
            this.toastrService.error(
              error.error,
              'Register Failed'
            )
          })
      );
  }

  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  private setUserToLocaleStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocaleStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);

    if(userJson) return JSON.parse(userJson) as User;

    return new User();
  }
}
