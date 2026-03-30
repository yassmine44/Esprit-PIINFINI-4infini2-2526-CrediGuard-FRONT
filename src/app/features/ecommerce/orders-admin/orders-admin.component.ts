import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderAdmin, OrderDetail, OrderStatus } from '../models/order.model';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, NgClass],
  templateUrl: './orders-admin.component.html',
  styleUrl: './orders-admin.component.scss'
})
export class OrdersAdminComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<OrderAdmin[]>([]);
  selectedOrder = signal<OrderDetail | null>(null);
  loading = signal(false);
  detailsLoading = signal(false);
  error = signal<string | null>(null);

  page = signal(0);
  size = signal(10);
  totalElements = signal(0);
  totalPages = signal(0);

  statusFilter = signal<OrderStatus | ''>('');
  dateFrom = signal('');
  dateTo = signal('');

  statuses: OrderStatus[] = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELED'];

  hasOrders = computed(() => this.orders().length > 0);
  canGoPrevious = computed(() => this.page() > 0);
  canGoNext = computed(() => this.page() < this.totalPages() - 1);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.error.set(null);

    this.orderService.getAdminOrders(
      this.page(),
      this.size(),
      this.statusFilter(),
      this.dateFrom(),
      this.dateTo()
    ).subscribe({
      next: (res) => {
        this.orders.set(res.content);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load orders.');
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.page.set(0);
    this.loadOrders();
  }

  resetFilters(): void {
    this.statusFilter.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.page.set(0);
    this.loadOrders();
  }

  goToPreviousPage(): void {
    if (!this.canGoPrevious()) return;
    this.page.update(p => p - 1);
    this.loadOrders();
  }

  goToNextPage(): void {
    if (!this.canGoNext()) return;
    this.page.update(p => p + 1);
    this.loadOrders();
  }

  onPageSizeChange(sizeValue: string): void {
    this.size.set(Number(sizeValue));
    this.page.set(0);
    this.loadOrders();
  }

  viewDetails(orderId: number): void {
    this.detailsLoading.set(true);
    this.selectedOrder.set(null);

    this.orderService.getAdminOrderById(orderId).subscribe({
      next: (order) => {
        this.selectedOrder.set(order);
        this.detailsLoading.set(false);
      },
      error: () => {
        this.detailsLoading.set(false);
      }
    });
  }

changeStatus(orderId: number, status: OrderStatus): void {
  this.error.set(null);

  this.orderService.updateAdminOrderStatus(orderId, { status }).subscribe({
    next: (updated) => {
      this.error.set(null);

      this.orders.update(list =>
        list.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: updated.status,
                updatedAt: updated.updatedAt
              }
            : order
        )
      );

      const current = this.selectedOrder();
      if (current && current.id === orderId) {
        this.selectedOrder.set(updated);
      }
    },
    error: (err) => {
      console.error('Update status error:', err);
      this.error.set('Failed to update order status.');
    }
  });
}

  closeDetails(): void {
    this.selectedOrder.set(null);
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'PENDING':
        return 'badge pending';
      case 'PAID':
        return 'badge paid';
      case 'SHIPPED':
        return 'badge shipped';
      case 'DELIVERED':
        return 'badge delivered';
      case 'CANCELED':
        return 'badge canceled';
      default:
        return 'badge';
    }
  }
}