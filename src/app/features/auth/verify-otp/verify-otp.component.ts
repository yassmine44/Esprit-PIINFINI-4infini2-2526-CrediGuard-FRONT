import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {
  form!: FormGroup;
  email = '';
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    const pendingAuth = this.authService.getPendingOtpAuth();
    this.email = this.route.snapshot.queryParamMap.get('email') || pendingAuth?.email || '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.verifyOtp({
      email: this.email,
      otp: this.form.value.otp
    }).subscribe({
      next: (res) => {
        this.loading = false;
        const token = res.accessToken || res.token;
        const pendingAuth = this.authService.getPendingOtpAuth();
        const email = this.email || pendingAuth?.email || '';

        if (!token) {
          this.errorMessage = 'Unexpected OTP response: token missing';
          return;
        }

        this.authService.saveToken(token);
        this.authService.saveUserEmail(email);

        const responseUserType = this.authService.getUserTypeFromAuthResponse(res);

        if (responseUserType || res.user || res.currentUser) {
          this.authService.saveUserFromAuthResponse(res, email);
        } else if (pendingAuth?.user) {
          this.authService.saveUser(pendingAuth.user);
        } else {
          this.authService.clearSession();
          this.errorMessage = 'Unable to resolve user role after OTP verification';
          return;
        }

        this.authService.clearPendingOtpAuth();
        const userType = this.authService.getUserType();

        if (userType === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Invalid OTP';
      }
    });
  }
}
