import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface BookingData {
    bookedFrom: string;
    bookedTo: string;
    firstName: string;
    guestNumber: number;
    lastName: string;
    placeId: string;
    placeImage: string;
    placeTitle: string;
    userId: string;
}


@Injectable({ providedIn: 'root' })
export class BookingService {
    private bookings = new BehaviorSubject<Booking[]>([]);

    constructor(private authService: AuthService, private http: HttpClient) {
    }

    get allBookings() {
        return this.bookings.asObservable();
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date) {
        let generatedId;
        const newBooking = new Booking(
            Math.random().toString(), placeId, this.authService.user_id, placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo);
        return this.http.post<{ name: string }>('https://ionic-angular-project-80500.firebaseio.com/bookings.json',
            {
                ...newBooking,
                id: null
            })
            .pipe(switchMap(resData => {
                generatedId = resData.name;
                return this.bookings;
            }),
                take(1),
                tap(bookings => {
                    newBooking.id = generatedId;
                    this.bookings.next(bookings.concat(newBooking));
                }));
    }

    cancelBooking(bookingId: string) {
        return this.http.delete(`https://ionic-angular-project-80500.firebaseio.com/bookings/${bookingId}.json`)
            .pipe(switchMap(() => {
                return this.bookings;
            }),
                take(1),
                tap(bookings => {
                    this.bookings.next(bookings.filter(b => b.id !== bookingId));
                }));
        return this.allBookings.pipe(
            take(1), delay(1000), tap(bookings => {
                this.bookings.next(bookings.filter(b => b.id !== bookingId));
            }));
    }

    fetchBookings() {
        return this.http
            .get<{ [key: string]: BookingData }>
            (`https://ionic-angular-project-80500.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.user_id}"`)
            .pipe(map(bookingData => {
                const bookings = [];
                for (
                    const key in bookingData) {
                    if (bookingData.hasOwnProperty(key)) {
                        bookings.push(
                            new Booking(
                                key,
                                bookingData[key].placeId
                                ,
                                bookingData[key].userId
                                , bookingData[key].placeTitle, bookingData[key].placeImage, bookingData[key].firstName
                                , bookingData[key].lastName, bookingData[key].guestNumber,
                                new Date(bookingData[key].bookedFrom),
                                new Date(bookingData[key].bookedTo)
                            ));
                    }
                }
                return bookings;
            }),
                tap(bookings => {
                    this.bookings.next(bookings);
                }));
    }
}