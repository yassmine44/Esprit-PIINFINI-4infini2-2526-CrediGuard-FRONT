import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrderService } from '../services/order.service';
import { DeliveryService } from '../services/delivery.service';
import { PaymentService } from '../services/payment.service';

import { OrderResponse } from '../models/order.model';
import { DeliveryResponse } from '../models/delivery.model';
import { PaymentResponse } from '../models/payment.model';

@Component({
  selector: 'app-orders-front',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './orders-front.component.html',
  styleUrl: './orders-front.component.scss'
})
export class OrdersFrontComponent implements OnInit {
  private orderService = inject(OrderService);
  private deliveryService = inject(DeliveryService);
  private paymentService = inject(PaymentService);

  orders = signal<OrderResponse[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  deliveries = signal<Record<number, DeliveryResponse | null>>({});
  payments = signal<Record<number, PaymentResponse | null>>({});

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.error.set(null);

    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);

        data.forEach(order => {
          this.loadDelivery(order.id);
          this.loadPayment(order.id);
        });
      },
      error: (err: unknown) => {
        console.error('Failed to load orders:', err);
        this.error.set('Failed to load orders.');
        this.loading.set(false);
      }
    });
  }

  loadDelivery(orderId: number): void {
    this.deliveryService.getByOrderId(orderId).subscribe({
      next: (delivery) => {
        this.deliveries.update(current => ({
          ...current,
          [orderId]: delivery
        }));
      },
      error: () => {
        this.deliveries.update(current => ({
          ...current,
          [orderId]: null
        }));
      }
    });
  }

  loadPayment(orderId: number): void {
    this.paymentService.getByOrder(orderId).subscribe({
      next: (payment) => {
        this.payments.update(current => ({
          ...current,
          [orderId]: payment
        }));
      },
      error: () => {
        this.payments.update(current => ({
          ...current,
          [orderId]: null
        }));
      }
    });
  }

  getDelivery(orderId: number): DeliveryResponse | null {
    return this.deliveries()[orderId] ?? null;
  }

  getPayment(orderId: number): PaymentResponse | null {
    return this.payments()[orderId] ?? null;
  }

  hasOrders(): boolean {
    return this.orders().length > 0;
  }

  orderStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'badge pending';
      case 'CONFIRMED':
        return 'badge confirmed';
      case 'CANCELLED':
        return 'badge cancelled';
      default:
        return 'badge';
    }
  }

  deliveryStatusClass(status?: string | null): string {
    switch (status) {
      case 'PENDING':
        return 'badge pending';
      case 'WAITING_STOCK':
        return 'badge waiting';
      case 'IN_TRANSIT':
        return 'badge transit';
      case 'DELIVERED':
        return 'badge delivered';
      case 'CANCELLED':
        return 'badge cancelled';
      default:
        return 'badge';
    }
  }

  paymentStatusClass(status?: string | null): string {
    switch (status) {
      case 'PENDING':
        return 'badge pending';
      case 'PAID':
        return 'badge paid';
      case 'FAILED':
        return 'badge failed';
      case 'REFUNDED':
        return 'badge refunded';
      default:
        return 'badge';
    }
  }
}