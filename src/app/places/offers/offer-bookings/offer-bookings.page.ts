import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {

  place: Place;

  constructor(private nav: NavController, private route: ActivatedRoute, private placeService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.nav.navigateBack('/places/tabs/offers');
        return;
      }

      this.place = this.placeService.getPlace(paramMap.get('placeId'));
    });
  }

}
