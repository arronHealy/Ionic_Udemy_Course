import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userAuthenticated = false;

  constructor() { }

  get userIsAuthenticated() {
    return this.userAuthenticated;
  }

  login() {
    this.userAuthenticated = true;
  }

  logout() {
    this.userAuthenticated = false;
  }
}
