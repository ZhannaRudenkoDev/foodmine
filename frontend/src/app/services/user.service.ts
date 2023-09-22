import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from "rxjs";
import { User } from "../components/shared/models/User";
import { IUserLogin } from "../components/shared/interfaces/IUserLogin";
import { HttpClient } from "@angular/common/http";
import { USER_LOGIN_URL } from "../components/shared/constants/urls";
import { ToastrService } from "ngx-toastr";

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
