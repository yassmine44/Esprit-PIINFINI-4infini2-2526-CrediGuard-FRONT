import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCodesAdminComponent } from './promo-codes-admin.component';

describe('PromoCodesAdminComponent', () => {
  let component: PromoCodesAdminComponent;
  let fixture: ComponentFixture<PromoCodesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoCodesAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoCodesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
