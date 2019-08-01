import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Plugins } from "@capacitor/core";

import { environment } from '../../environments/environment';
import { BehaviorSubject, from } from 'rxjs';
import { User } from './user.model';
import { map, tap, switchMap } from 'rxjs/operators';




export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) { }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' }))
      .pipe(map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string; tokenExpirationDate: string; userId: string;
          email: string;
        };

        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.userId, parsedData.email, parsedData.token,
          expirationTime);

        return user;
      }),
        tap(user => {
          if (user) {
            this.user.next(user);
          }
        }),
        map(user => {
          return !!user;
        })
      );
  }

  get userIsAuthenticated() {
    return this.user.asObservable()
      .pipe(map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      }));
  }

  get user_id() {
    return this.user.asObservable()
      .pipe(map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      }));
  }

  signUp(userEmail: string, userPassword: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}
    `, {
        email: userEmail,
        password: userPassword,
        returnSecureToken: true
      })
      .pipe(tap(this.setUserData.bind(this)));
  }

  login(userEmail: string, userPassword: string) {
    return this.http.
      post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        {
          email: userEmail,
          password: userPassword,
          returnSecureToken: true
        })
      .pipe(tap(this.setUserData.bind(this)));
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    this.user.next(
      new User(
        userData.localId, userData.email, userData.idToken, expirationTime));
    this.storeAuthData(
      userData.localId,
      userData.idToken, expirationTime.toISOString(),
      userData.email);
  }

  private storeAuthData(_userId: string, _token: string, _tokenExpirationDate: string, _email: string) {
    const data = JSON.stringify({
      userId: _userId,
      token: _token,
      tokenExpirationDate: _tokenExpirationDate,
      email: _email
    });
    Plugins.Storage.set({
      key: 'authData',
      value: data
    });
  }

  logout() {
    this.user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }
}
