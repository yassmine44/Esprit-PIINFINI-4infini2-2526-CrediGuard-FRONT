import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailFrontComponent } from './product-detail-front.component';

describe('ProductDetailFrontComponent', () => {
  let component: ProductDetailFrontComponent;
  let fixture: ComponentFixture<ProductDetailFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
