import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceFrontComponent } from './finance-front.component';

describe('FinanceFrontComponent', () => {
  let component: FinanceFrontComponent;
  let fixture: ComponentFixture<FinanceFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
