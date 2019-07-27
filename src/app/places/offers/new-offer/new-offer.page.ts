import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  form: FormGroup;

  constructor(private placeService: PlacesService, private router: Router, private fb: FormBuilder) {

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

    this.placeService.addPlace(
      this.form.value.title, this.form.value.description, +this.form.value.price,
      new Date(this.form.value.dateFrom), new Date(this.form.value.dateTo));


    console.log(this.placeService.places);
    this.form.reset();
    this.router.navigate([['/places/tabs/offers']]);
  }
}
