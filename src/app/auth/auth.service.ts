import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userAuthenticated = true;
  private userId = 'abc';

  constructor() { }

  get userIsAuthenticated() {
    return this.userAuthenticated;
  }

  get user_id() {
    return this.userId;
  }

  login() {
    this.userAuthenticated = true;
  }

  logout() {
    this.userAuthenticated = false;
  }
}
