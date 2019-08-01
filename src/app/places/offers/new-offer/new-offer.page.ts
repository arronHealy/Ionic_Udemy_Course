import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.model';
import { of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

function base64ToBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }

  return new Blob(byteArrays, { type: contentType });
}

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
      }),
      location: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null)
    });

  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location: location });
  }

  onCreateOffer() {
    // console.log(this.form.value.title);
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    console.log(this.form.value);
    this.loadingCtrl.create({
      message: 'Creating place'
    })
      .then(loadingEl => {
        loadingEl.present();
        console.log(this.form);
        this.placeService.uploadImage(this.form.get('image').value)
          .pipe(switchMap(uploadRes => {
            return this.placeService.addPlace(
              this.form.value.title, this.form.value.description, +this.form.value.price,
              new Date(this.form.value.dateFrom),
              new Date(this.form.value.dateTo),
              this.form.value.location,
              uploadRes.imageUrl);
          }))
          .subscribe(() => {
            loadingEl.dismiss();
            console.log(this.placeService.places);
            this.form.reset();
            this.router.navigateByUrl('/places/tabs/offers');
          });
      });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64ToBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      } catch (error) {
        console.log(error);
        return;
      }

    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image: imageFile });
  }
}
