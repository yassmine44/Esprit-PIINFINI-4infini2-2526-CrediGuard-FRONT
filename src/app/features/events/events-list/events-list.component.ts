import { Component, OnInit } from '@angular/core';
import { EventService, Event } from '../../../core/services/event.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des événements';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteEvent(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.events = this.events.filter(e => e.id !== id);
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
}
