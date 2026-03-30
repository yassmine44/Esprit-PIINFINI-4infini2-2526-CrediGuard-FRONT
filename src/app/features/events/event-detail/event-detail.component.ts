import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, Event } from '../../../core/services/event.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(+id);
    }
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.eventService.getEvent(id).subscribe({
      next: (data) => {
        this.event = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/events']);
  }

  deleteEvent(): void {
    if (this.event && confirm('Supprimer cet événement ?')) {
      this.eventService.deleteEvent(this.event.id!).subscribe({
        next: () => {
          this.router.navigate(['/admin/events']);
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
