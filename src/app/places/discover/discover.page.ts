import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  loadedPlaces: Place[];

  listedLoadedPlaces: Place[];

  relevantPlaces: Place[];

  isLoading = false;

  private placesSub: Subscription;

  private chosenFilter = 'all';

  constructor(private placesService: PlacesService, private menuCtrl: MenuController, private authService: AuthService) {

  }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      if (this.chosenFilter === 'all') {
        this.relevantPlaces = this.loadedPlaces;
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      } else {
        this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.user_id);
      }
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
    if (event.detail.value === 'all') {
      this.chosenFilter = 'all';
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    } else {
      this.chosenFilter = 'bookable';
      this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.user_id);
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }

  /*
  onOpenMenu() {
    this.menuCtrl.toggle();
  }
  */

}
