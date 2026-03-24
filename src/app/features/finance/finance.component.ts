import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.scss'
})
export class FinanceComponent {
  cards = [
    {
      title: 'Transactions',
      description: 'Track incoming and outgoing financial transactions.',
      value: 0,
      action: 'Open Transactions'
    },
    {
      title: 'Revenue',
      description: 'Monitor platform revenue and financial growth.',
      value: 0,
      action: 'Open Revenue'
    },
    {
      title: 'Expenses',
      description: 'Manage operational expenses and cost tracking.',
      value: 0,
      action: 'Open Expenses'
    },
    {
      title: 'Reports',
      description: 'Generate financial reports and summaries.',
      value: 0,
      action: 'Open Reports'
    },
    {
      title: 'Accounts',
      description: 'Manage financial accounts and balances.',
      value: 0,
      action: 'Open Accounts'
    },
    {
      title: 'Risk Indicators',
      description: 'Follow KPIs and indicators related to financial risk.',
      value: 0,
      action: 'Open KPIs'
    }
  ];
}