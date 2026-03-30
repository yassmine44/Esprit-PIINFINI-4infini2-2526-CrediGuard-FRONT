import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent 
{

  constructor(private router: Router, private authService: AuthService) {}

  goProfile() {
    this.router.navigate(['/admin/profile']);
  }
  logout() {
  this.authService.logout();
  this.router.navigate(['/auth/sign-in']);
  }


}