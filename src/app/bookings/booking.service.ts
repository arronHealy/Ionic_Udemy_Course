import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, tap, delay } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class BookingService {
    private bookings = new BehaviorSubject<Booking[]>([]);

    constructor(private authService: AuthService) {
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
        const newBooking = new Booking(
            Math.random().toString(), placeId, this.authService.user_id, placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo);
        return this.allBookings.pipe(take(1), delay(1000), tap(bookings => {
            this.bookings.next(bookings.concat(newBooking));
        }));
    }

    cancelBooking(bookingId: string) {
        return this.allBookings.pipe(
            take(1), delay(1000), tap(bookings => {
                this.bookings.next(bookings.filter(b => b.id !== bookingId));
            }));
    }
}