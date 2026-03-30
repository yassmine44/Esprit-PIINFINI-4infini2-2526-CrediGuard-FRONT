import { Component } from '@angular/core';
import { TransportService, TransportService as Transport } from '../../../core/services/transport.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transport-service-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './transport-service-create.component.html',
  styleUrls: ['./transport-service-create.component.scss']
})
export class TransportServiceCreateComponent {
  transportForm: FormGroup;
  loading = false;
  error = '';

  transportTypes = ['BUS', 'VOITURE', 'VTC', 'TRAIN', 'AVION', 'SHUTTLE'];
  statuses = ['PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE'];

  constructor(
    private fb: FormBuilder,
    private transportService: TransportService,
    private router: Router
  ) {
    this.transportForm = this.fb.group({
      eventId: [1, [Validators.required, Validators.min(1)]],
      transportType: ['', Validators.required],
      departurePlace: ['', Validators.required],
      departureTime: ['', Validators.required],
      returnTime: ['', Validators.required],
      capacity: [1, [Validators.required, Validators.min(1)]],
      status: ['PLANIFIE', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.transportForm.invalid) {
      this.transportForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.transportService.createTransportService(this.transportForm.value).subscribe({
      next: () => {
        this.router.navigate(['/admin/transport']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la création';
        this.loading = false;
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/transport']);
  }
}
