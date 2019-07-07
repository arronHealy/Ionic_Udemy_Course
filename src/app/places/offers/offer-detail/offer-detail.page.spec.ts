import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDetailPage } from './offer-detail.page';

describe('OfferDetailPage', () => {
  let component: OfferDetailPage;
  let fixture: ComponentFixture<OfferDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
