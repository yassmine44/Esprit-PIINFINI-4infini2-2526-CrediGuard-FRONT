import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, Event } from '../../../core/services/event.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit {
  eventForm: FormGroup;
  loading = false;
  error = '';
  eventId: number | null = null;

  eventTypes = ['ATELIER', 'CONFERENCE', 'FORMATION', 'REUNION', 'EVENEMENT_SOCIAL'];
  statuses = ['PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      eventType: ['', Validators.required],
      dateStart: ['', Validators.required],
      dateEnd: ['', Validators.required],
      location: ['', Validators.required],
      capacity: [1, [Validators.required, Validators.min(1)]],
      status: ['PLANIFIE', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventId = +id;
      this.loadEvent(this.eventId);
    }
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.eventService.getEvent(id).subscribe({
      next: (data) => {
        this.eventForm.patchValue(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid || !this.eventId) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.eventService.updateEvent(this.eventId, this.eventForm.value).subscribe({
      next: () => {
        this.router.navigate(['/admin/events']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour';
        this.loading = false;
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/events']);
  }
}
