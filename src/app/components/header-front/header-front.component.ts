import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../pages/ecommerce/services/cart.service';

@Component({
  selector: 'app-header-front',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.scss']
})
export class HeaderFrontComponent implements OnInit {
  private cartService = inject(CartService);

  cartCount = signal(0);

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.itemsCount$.subscribe(count => {
      this.cartCount.set(count);
    });

    this.cartService.getMyCart().subscribe({
      error: () => {
        this.cartCount.set(0);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/sign-in');
  }

  goProfile(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/profile']);
    } else {
      this.router.navigate(['/front/profile']);
    }
  }
}