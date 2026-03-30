import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TopbarComponent } from './topbar.component';
import { AuthService } from '../../core/services/auth.service';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
