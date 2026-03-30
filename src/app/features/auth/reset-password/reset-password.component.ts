import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  loading = false;
  successMessage = '';
  errorMessage = '';
  token = '';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { newPassword, confirmPassword } = this.form.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resetPassword({
      token: this.token,
      newPassword: newPassword!
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message;
        setTimeout(() => {
          this.router.navigate(['/auth/sign-in']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Reset failed';
      }
    });
  }
}