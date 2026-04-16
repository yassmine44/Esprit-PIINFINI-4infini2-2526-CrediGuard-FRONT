import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  email = '';
  twoFactorEnabled = false;
  loading = false;
  message = '';
  errorMessage = '';

  ngOnInit(): void {
  this.email = localStorage.getItem('userEmail') || '';

  if (!this.email) return;

  this.authService.get2faStatus(this.email).subscribe({
    next: (res) => {
      this.twoFactorEnabled = res.twoFactorEnabled;
    },
    error: (err) => {
      console.error('2FA STATUS ERROR =>', err);
    }
  });
}

  constructor(private authService: AuthService) {}

  enable2fa(): void {
    if (!this.email) {
      this.errorMessage = 'No user email found';
      return;
    }

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    this.authService.enable2fa(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.twoFactorEnabled = true;
        this.message = res.message || '2FA enabled successfully';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Failed to enable 2FA';
      }
    });
  }

  disable2fa(): void {
    if (!this.email) {
      this.errorMessage = 'No user email found';
      return;
    }

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    this.authService.disable2fa(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.twoFactorEnabled = false;
        this.message = res.message || '2FA disabled successfully';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Failed to disable 2FA';
      }
    });
  }
}