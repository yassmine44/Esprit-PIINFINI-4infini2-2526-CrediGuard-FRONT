import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  private checkAccess(): boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/auth/sign-in']);
    }

    if (!this.authService.isAdmin()) {
      return this.router.createUrlTree(['/']);
    }

    return true;
  }

  canActivate(): boolean | UrlTree {
    return this.checkAccess();
  }

  canActivateChild(): boolean | UrlTree {
    return this.checkAccess();
  }
}
