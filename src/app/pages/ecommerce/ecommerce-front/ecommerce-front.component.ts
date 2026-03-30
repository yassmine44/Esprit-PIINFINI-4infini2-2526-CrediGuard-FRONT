import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../features/ecommerce/models/product.model';
import { ProductService } from '../../../features/ecommerce/services/product.service';

@Component({
  selector: 'app-ecommerce-front',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './ecommerce-front.component.html',
  styleUrl: './ecommerce-front.component.scss'
})
export class EcommerceFrontComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.error.set('Failed to load products.');
        this.loading.set(false);
      }
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/default-product.png';
  }
  getImageUrl(imageUrl?: string | null): string {
  return this.productService.getImageUrl(imageUrl);
}
}