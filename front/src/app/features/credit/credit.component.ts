import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.scss'
})
export class CreditComponent {
  cards = [
    {
      title: 'Credit Requests',
      description: 'Review and manage submitted credit requests.',
      value: 0,
      action: 'Open Requests'
    },
    {
      title: 'Risk Evaluation',
      description: 'Analyze credit risk and scoring indicators.',
      value: 0,
      action: 'Open Evaluations'
    },
    {
      title: 'Credit Decisions',
      description: 'Track approved, rejected, and pending decisions.',
      value: 0,
      action: 'Open Decisions'
    },
    {
      title: 'Repayment Schedule',
      description: 'Manage repayment plans and échéances.',
      value: 0,
      action: 'Open Schedules'
    },
    {
      title: 'Credit History',
      description: 'Consult borrower credit records and history.',
      value: 0,
      action: 'Open History'
    },
    {
      title: 'Approval Workflow',
      description: 'Follow the credit validation and approval flow.',
      value: 0,
      action: 'Open Workflow'
    }
  ];
}