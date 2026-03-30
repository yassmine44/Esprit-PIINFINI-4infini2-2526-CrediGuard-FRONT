import { Component, OnInit } from '@angular/core';
import { TransportService, TransportService as Transport } from '../../../core/services/transport.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transport-services-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './transport-services-list.component.html',
  styleUrls: ['./transport-services-list.component.scss']
})
export class TransportServicesListComponent implements OnInit {
  transportServices: Transport[] = [];
  loading = false;
  error = '';

  constructor(private transportService: TransportService) {}

  ngOnInit(): void {
    this.loadTransportServices();
  }

  loadTransportServices(): void {
    this.loading = true;
    this.transportService.getTransportServices().subscribe({
      next: (data) => {
        this.transportServices = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteTransportService(id: number): void {
    if (confirm('Supprimer ce service ?')) {
      this.transportService.deleteTransportService(id).subscribe({
        next: () => {
          this.transportServices = this.transportServices.filter(s => s.id !== id);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PLANIFIE': return 'badge bg-primary';
      case 'EN_COURS': return 'badge bg-warning';
      case 'TERMINE': return 'badge bg-success';
      case 'ANNULE': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getTransportTypeIcon(type: string): string {
    switch (type) {
      case 'BUS': return 'fa-bus';
      case 'VOITURE': return 'fa-car';
      case 'VTC': return 'fa-taxi';
      case 'TRAIN': return 'fa-train';
      case 'AVION': return 'fa-plane';
      default: return 'fa-shuttle-van';
    }
  }
}
