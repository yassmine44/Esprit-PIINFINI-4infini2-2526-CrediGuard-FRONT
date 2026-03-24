import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partners-insurance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partners-insurance.component.html',
  styleUrl: './partners-insurance.component.scss'
})
export class PartnersInsuranceComponent {
  cards = [
    {
      title: 'Partners',
      description: 'Manage partner companies and institutional relationships.',
      value: 0,
      action: 'Open Partners'
    },
    {
      title: 'Insurance Products',
      description: 'Manage insurance offers, packages, and conditions.',
      value: 0,
      action: 'Open Products'
    },
    {
      title: 'Contracts',
      description: 'Track agreements, contracts, and partner commitments.',
      value: 0,
      action: 'Open Contracts'
    },
    {
      title: 'Claims',
      description: 'Manage insurance claims and related processing.',
      value: 0,
      action: 'Open Claims'
    },
    {
      title: 'Coverage',
      description: 'Monitor active coverage and guarantee policies.',
      value: 0,
      action: 'Open Coverage'
    },
    {
      title: 'Guarantees',
      description: 'Track guarantees and risk-sharing conditions.',
      value: 0,
      action: 'Open Guarantees'
    }
  ];
}