import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FinanceService } from '../../services/finance';
import { Chatbot } from '../../components/chatbot/chatbot';

@Component({
  selector: 'app-finance-front',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    PercentPipe,
    FormsModule,
    RouterLink,
    Chatbot
  ],
  templateUrl: './finance-front.component.html',
  styleUrls: ['./finance-front.component.scss']
})
export class FinanceFrontComponent {
  financeService = inject(FinanceService);

  user = this.financeService.currentUser;
  account = this.financeService.currentAccount;
  transactions = this.financeService.transactions;

  hasAccount = this.financeService.hasFinancialAccount;
  creditStats = this.financeService.creditStats;
  productSales = this.financeService.productSales;
  budget = this.financeService.budget;

  accountForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idType: 'CIN',
    idFile: null as File | null
  };

  searchTerm = signal('');
  statusFilter = signal('Tous les statuts');

  filteredTransactions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();

    return this.transactions().filter(t => {
      const matchesSearch =
        t.client.toLowerCase().includes(term) ||
        t.id_transaction_str?.toLowerCase().includes(term);

      const matchesStatus =
        status === 'Tous les statuts' || t.statut === status;

      return matchesSearch && matchesStatus;
    });
  });

  createAccount(): void {
    this.financeService.createAccount(this.accountForm);
  }
}