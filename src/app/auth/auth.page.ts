import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading = false;
  isLogin = true;

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObservable: Observable<AuthResponseData>;

        if (this.isLogin) {
          authObservable = this.authService.login(email, password);
        } else {
          authObservable = this.authService.signUp(email, password);
        }

        authObservable.subscribe(
          resData => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
          }, errorRes => {
            loadingEl.dismiss();
            const code = errorRes.error.error.message;
            let message = 'Could not sign you up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email already exists!!!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'Email address could not be found. Please try again...'
            } else if (code === 'INVALID_PASSWORD') {
              message = 'Login failed. Invalid password entered...'
            }
            this.onShowAlert(message);
          });
      });
  }

  onShowAlert(errorMessage: string) {
    return this.alertCtrl.create({
      header: 'Authentication Failed!',
      message: errorMessage,
      buttons: ['Okay']
    })
      .then(alertEl => {
        alertEl.present();
      });
  }

  onSubmit(form: NgForm) {
    //console.log(form);
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    // console.log(email, password);

    this.authenticate(email, password);
    form.reset();
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

}
