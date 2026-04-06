import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersInsuranceComponent } from './partners-insurance.component';

describe('PartnersInsuranceComponent', () => {
  let component: PartnersInsuranceComponent;
  let fixture: ComponentFixture<PartnersInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnersInsuranceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnersInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
