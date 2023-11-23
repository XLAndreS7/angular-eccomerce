import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(private _api: ApiService, private _token: TokenStorageService) {
    this.userSubject = new BehaviorSubject<any>(this._token.getUser());
    this.user = this.userSubject.asObservable();
  }

  getUser() {
    console.log(this.userSubject);
    console.log(this.userSubject.value);
    return this.userSubject.value;
  }

  login(credentials: any): Observable<any> {
    return this._api
      .postTypeRequest('auth/login', {
        email: credentials.email,
        password: credentials.password,
        isAdmin: credentials.isAdmin,
      })
      .pipe(
        map((res: any) => {
          let user = {
            email: credentials.email,
            token: res.token,
            isAdmin: credentials.isAdmin,
          };
          this._token.setToken(res.token);
          console.log(res);
          this._token.setUser(res.data[0]);
          console.log(res.data[0]);
          this.userSubject.next(user);
          return user;
        })
      );
  }

  register(user: any): Observable<any> {
    console.log('username - client', user.username);
    return this._api.postTypeRequest('auth/register', {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      password: user.password,
    });
  }

  logout() {
    this._token.clearStorage();
    this.userSubject.next(null);
  }
}
