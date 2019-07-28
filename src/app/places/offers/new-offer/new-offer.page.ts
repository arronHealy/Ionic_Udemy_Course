import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  form: FormGroup;

  constructor(private placeService: PlacesService, private router: Router, private loadingCtrl: LoadingController) {

  }

  ngOnInit() {
    /*
    this.form = this.fb.group({
      title: ['', {
        validators: [Validators.required],
        updateOn: 'blur'
      }],
      description: ['', {
        validators: [Validators.required, Validators.maxLength(200)],
        updateOn: 'blur'
      }],
      price: [null, {
        validators: [Validators.required, Validators.min(1)],
        updateOn: 'blur'
      }],
      dateFrom: [null, {
        validators: [Validators.required],
        updateOn: 'blur'
      }],
      dateTo: [null, {
        validators: [Validators.required],
        updateOn: 'blur'
      }]
    });

    this.form.valueChanges.subscribe(console.log);
    */
    this.form = new FormGroup({
      title: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(200)]
      }),
      price: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });

  }

  onCreateOffer() {
    console.log(this.form.value.title);
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl.create({
      message: 'Creating place'
    })
      .then(loadingEl => {
        loadingEl.present();

        this.placeService.addPlace(
          this.form.value.title, this.form.value.description, +this.form.value.price,
          new Date(this.form.value.dateFrom), new Date(this.form.value.dateTo)).subscribe(() => {
            loadingEl.dismiss();
            console.log(this.placeService.places);
            this.form.reset();
            this.router.navigateByUrl('/places/tabs/offers');
          });
      });


  }
}
