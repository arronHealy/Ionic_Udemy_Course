import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { BrowserPlatformLocation } from '@angular/platform-browser/src/browser/location/browser_platform_location';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';

import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from './location.model';

/*
new Place('p1', 'Manhattan Mansion', 'In New York City centre.',
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200', 149.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place('p2', 'L\'Amour Toujours', 'In Paris, France',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg', 189.99, new Date('2019-01-01'),
      new Date('2019-12-31'),
      'aaa'
    ),
    new Place('p3', 'Dublin City Hotel', 'In D City centre.',
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200', 149.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'sss'
    )
*/

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) { }

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.http.get<PlaceData>(`https://ionic-angular-project-80500.firebaseio.com/offered-places/${id}.json`)
      .pipe(map(placeData => {
        return new Place(
          id,
          placeData.title, placeData.description, placeData.imageUrl, placeData.price,
          new Date(placeData.availableFrom),
          new Date(placeData.availableTo), placeData.userId, placeData.location);
      }));

  }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>('https://ionic-angular-project-80500.firebaseio.com/offered-places.json')
      .pipe(map(resData => {
        // console.log(resData);
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(new Place(
              key,
              resData[key].title,
              resData[key].description, resData[key].imageUrl, resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].userId,
              resData[key].location));
          }
        }
        return places;

      }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{ imageUrl: string, imagePath: string }>(
      'https://us-central1-ionic-angular-project-80500.cloudfunctions.net/storeImage', uploadData);
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date, dateTo: Date,
    location: PlaceLocation,
    imageUrl: string) {
    let generatedId: string;
    let newPlace: Place;
    return this.authService.user_id.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user id found...');
        }

        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          price,
          dateFrom,
          dateTo,
          userId,
          location);

        return this.http
          .post<{ name: string }>('https://ionic-angular-project-80500.firebaseio.com/offered-places.json', {
            ...newPlace, id: null
          });
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
  }

  onEditOffer(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price, oldPlace.availableFrom, oldPlace.availableTo, oldPlace.userId,
          oldPlace.location);

        return this.http
          .put(`https://ionic-angular-project-80500.firebaseio.com/offered-places/${placeId}.json`,
            {
              ...updatedPlaces[updatedPlaceIndex],
              id: null
            });
      }),
      tap(resData => {
        this._places.next(updatedPlaces);
      })

    );
  }
}
