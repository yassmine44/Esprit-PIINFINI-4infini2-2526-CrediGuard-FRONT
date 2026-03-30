import { Component } from '@angular/core';
import { EventService, Event } from '../../../core/services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent {
  eventForm: FormGroup;
  loading = false;
  error = '';

  eventTypes = ['ATELIER', 'CONFERENCE', 'FORMATION', 'REUNION', 'EVENEMENT_SOCIAL'];
  statuses = ['PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE'];

  constructor(
    private fb: FormBuilder,
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

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.eventService.createEvent(this.eventForm.value).subscribe({
      next: () => {
        this.router.navigate(['/admin/events']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la création';
        this.loading = false;
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/events']);
  }
}
