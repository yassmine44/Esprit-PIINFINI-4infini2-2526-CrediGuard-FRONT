import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let signInUrlTree: UrlTree;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);
    signInUrlTree = {} as UrlTree;
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue(signInUrlTree);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when the user is logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);

    const canActivate = guard.canActivate();

    expect(canActivate).toBeTrue();
    expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to sign-in when the user is not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);

    const canActivate = guard.canActivate();

    expect(canActivate).toBe(signInUrlTree);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/auth/sign-in']);
  });
});
