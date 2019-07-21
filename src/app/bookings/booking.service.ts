import { Injectable } from '@angular/core';
import { Booking } from './booking.module';


@Injectable({ providedIn: 'root' })
export class BookingService {
    private bookings: Booking[] = [
        {
            id: 'xyz',
            placeId: 'p1',
            placeTitle: 'Manahattan mansion',
            guestNumber: 2,
            userId: 'abc'
        }
    ];

    get allBookings() {
        return [...this.bookings];
    }
}