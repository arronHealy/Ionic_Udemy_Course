import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {

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

  goBack() {
    this.nav.navigateBack('/places/tabs/offers/' + this.place.id);
  }

}
