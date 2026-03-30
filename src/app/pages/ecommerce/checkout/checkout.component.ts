import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { DeliveryAddressService } from '../services/delivery-address.service';
import { DeliveryService } from '../services/delivery.service';

import { Cart } from '../models/cart.model';
import { OrderCreateRequest } from '../models/order.model';
import { DeliveryAddressResponse } from '../models/delivery-address.model';
import { DeliverySlot, DeliveryType } from '../models/delivery.model';
import { PaymentService } from '../services/payment.service';
import { PaymentType } from '../models/payment.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private deliveryAddressService = inject(DeliveryAddressService);
  private deliveryService = inject(DeliveryService);
  private router = inject(Router);
private paymentService = inject(PaymentService);

  cart = signal<Cart | null>(null);
  loading = signal(false);
  placingOrder = signal(false);
  savingAddress = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  savedAddress = signal<DeliveryAddressResponse | null>(null);

  promoCode = '';

  fullName = '';
  phone = '';
  city = '';
  addressLine = '';
  additionalInfo = '';

  deliveryType: DeliveryType = 'STANDARD';
  deliverySlot: DeliverySlot = 'MORNING';
  deliveryFee = 7;
  paymentType: PaymentType = 'CASH_ON_DELIVERY';

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading.set(true);
    this.error.set(null);

    this.cartService.getMyCart().subscribe({
      next: (data) => {
        this.cart.set(data);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to load cart:', err);
        this.error.set('Failed to load cart.');
        this.loading.set(false);
      }
    });
  }

  saveDeliveryAddress(): void {
    if (!this.fullName.trim() || !this.phone.trim() || !this.city.trim() || !this.addressLine.trim()) {
      this.error.set('Please fill in all required delivery address fields.');
      return;
    }

    this.savingAddress.set(true);
    this.error.set(null);

    this.deliveryAddressService.create({
      fullName: this.fullName.trim(),
      phone: this.phone.trim(),
      city: this.city.trim(),
      addressLine: this.addressLine.trim(),
      additionalInfo: this.additionalInfo.trim() || null
    }).subscribe({
      next: (address) => {
        this.savedAddress.set(address);
        this.savingAddress.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to save delivery address:', err);
        this.error.set('Failed to save delivery address.');
        this.savingAddress.set(false);
      }
    });
  }
placeOrder(): void {
  const currentCart = this.cart();

  if (!currentCart || !currentCart.items.length) {
    this.error.set('Your cart is empty.');
    return;
  }

  if (!this.savedAddress()) {
    this.error.set('Please save a delivery address.');
    return;
  }

  this.placingOrder.set(true);
  this.error.set(null);

this.orderService.createOrder({
  promoCode: this.promoCode.trim() || null,
  items: currentCart.items.map(i => ({
    productId: i.productId,
    quantity: i.quantity
  }))
}).subscribe({
    next: (order) => {

      // 🔹 DELIVERY
      this.deliveryService.create({
        orderId: order.id,
        addressId: this.savedAddress()!.id,
        deliveryType: this.deliveryType,
        deliverySlot: this.deliverySlot,
        deliveryFee: this.deliveryFee
      }).subscribe({

        next: () => {

          // 🔹 PAYMENT
          this.paymentService.create({
            orderId: order.id,
            paymentType: this.paymentType
          }).subscribe({

            next: () => {

              // 🔹 CLEAR CART
              this.cartService.clearCart().subscribe({
                next: () => {
                  this.successMessage.set('Order completed successfully!');
                  this.placingOrder.set(false);

                  setTimeout(() => {
                    this.router.navigate(['/front/orders']);
                  }, 1200);
                }
              });

            },

            error: () => {
              this.error.set('Payment failed.');
              this.placingOrder.set(false);
            }

          });

        },

        error: () => {
          this.error.set('Delivery failed.');
          this.placingOrder.set(false);
        }

      });

    },

    error: () => {
      this.error.set('Order failed.');
      this.placingOrder.set(false);
    }
  });
}

  getImageUrl(imageUrl?: string | null): string {
    if (!imageUrl || !imageUrl.trim()) {
      return 'assets/default-product.png';
    }

    const value = imageUrl.trim().replace(/^"+|"+$/g, '');

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    if (value.startsWith('/uploads/')) {
      return `http://localhost:8089/api${value}`;
    }

    return 'assets/default-product.png';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/default-product.png';
  }
}