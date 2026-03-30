import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { Product } from './models/product.model';
import { Category } from './models/category.model';

interface KpiCard {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon: string;
}

interface ModuleCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  action: string;
}

interface QuickAction {
  label: string;
  route: string;
}

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './ecommerce.component.html',
  styleUrl: './ecommerce.component.scss'
})
export class EcommerceComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal('');

  totalProducts = computed(() => this.products().length);

  totalCategories = computed(() => this.categories().length);

  activeProducts = computed(() =>
    this.products().filter(product => product.active).length
  );

  preorderProducts = computed(() =>
    this.products().filter(product => product.saleType === 'PREORDER').length
  );

  outOfStockProducts = computed(() =>
    this.products().filter(product => (product.stockQuantity ?? 0) <= 0).length
  );

  standardProducts = computed(() =>
    this.products().filter(product => product.saleType === 'STANDARD').length
  );

  kpis = computed<KpiCard[]>(() => [
    {
      title: 'Total Products',
      value: this.totalProducts(),
      subtitle: 'Products available in catalog',
      trend: `${this.activeProducts()} active`,
      trendType: 'positive',
      icon: 'inventory_2'
    },
    {
      title: 'Categories',
      value: this.totalCategories(),
      subtitle: 'Structured product categories',
      trend: 'Catalog organization',
      trendType: 'neutral',
      icon: 'category'
    },
    {
      title: 'Preorder Products',
      value: this.preorderProducts(),
      subtitle: 'Products available for preorder',
      trend: `${this.standardProducts()} standard`,
      trendType: 'neutral',
      icon: 'shopping_cart'
    },
    {
      title: 'Out of Stock',
      value: this.outOfStockProducts(),
      subtitle: 'Products currently unavailable',
      trend: this.outOfStockProducts() > 0 ? 'Needs attention' : 'Stock healthy',
      trendType: this.outOfStockProducts() > 0 ? 'negative' : 'positive',
      icon: 'warning'
    }
  ]);

  modules: ModuleCard[] = [
    {
      title: 'Products',
      description: 'Manage catalog, stock, product visibility, pricing, and seller-linked items.',
      icon: 'inventory',
      route: '/admin/ecommerce/products',
      action: 'Manage Products'
    },
    {
      title: 'Categories',
      description: 'Create and organize categories and parent-child hierarchy.',
      icon: 'category',
      route: '/admin/ecommerce/categories',
      action: 'Manage Categories'
    },
    {
      title: 'Orders',
      description: 'Track customer orders, statuses, and processing flow.',
      icon: 'receipt_long',
      route: '/admin/ecommerce/orders',
      action: 'Manage Orders'
    },
    {
      title: 'Payments',
      description: 'Monitor transaction history and payment states.',
      icon: 'payments',
      route: '/admin/ecommerce/payments',
      action: 'Manage Payments'
    },
    {
      title: 'Deliveries',
      description: 'Follow delivery pipeline and shipment management.',
      icon: 'local_shipping',
      route: '/admin/ecommerce/deliveries',
      action: 'Manage Deliveries'
    },
   {
    title: 'Promo Codes',
    description: 'Create, activate, and monitor discount campaigns.',
    action: 'Manage Promotions',
    icon: 'sell',
    route: '/admin/ecommerce/promo-codes'
  }
  ];

  quickActions: QuickAction[] = [
    {
      label: 'Add Product',
      route: '/admin/ecommerce/products/new'
    },
    {
      label: 'Open Products',
      route: '/admin/ecommerce/products'
    },
    {
      label: 'Add Category',
      route: '/admin/ecommerce/categories'
    },
    {
      label: 'Open Categories',
      route: '/admin/ecommerce/categories'
    },
    {
    label: 'Promo Codes',
    route: '/admin/ecommerce/promo-codes'
  },
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.error.set('');

    this.productService.getAll().subscribe({
      next: (productData) => {
        this.products.set(productData);

        this.categoryService.getAll().subscribe({
          next: (categoryData) => {
            this.categories.set(categoryData);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error loading categories:', err);
            this.error.set('Unable to load categories.');
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error.set('Unable to load dashboard data.');
        this.loading.set(false);
      }
    });
  }
}