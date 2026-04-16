import { Injectable, signal } from '@angular/core';

export interface User {
  id_utilisateur: number;
  nom: string;
  role: 'bénéficiaire' | 'partenaire' | 'admin';
}

export interface FinancialAccount {
  id_compte: number;
  solde: number;
  type_compte: 'bénéficiaire' | 'partenaire' | 'plateforme';
  id_utilisateur: number;
}

export interface Transaction {
  id_transaction: number;
  id_transaction_str?: string; // e.g. "TRX-001"
  client: string;
  type_transaction: 'Dépôt' | 'Retrait' | 'Transfert' | 'Vente' | 'Achat' | 'Remboursement';
  montant: number;
  date_transaction: Date;
  statut: 'Complété' | 'En attente' | 'Annulé' | 'Validée' | 'Rejetée';
  id_compte_source: number;
  id_compte_destination: number;
}

export interface Sale {
  id_vente: number;
  montant_total: number;
  date_vente: Date;
}

export interface CreditStats {
  totalCredit: number;
  repaid: number;
  remaining: number;
}

export interface ProductSale {
  item: string;
  amount: number;
  date: Date;
  status: 'Vendu' | 'En cours';
}

export interface Budget {
  total: number;
  allocated: number;
  available: number;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  // Mock Data
  hasFinancialAccount = signal<boolean>(false); // Start as false to show create form

  currentUser = signal<User>({
    id_utilisateur: 1,
    nom: 'Jean Dupont',
    role: 'bénéficiaire'
  });

  currentAccount = signal<FinancialAccount>({
    id_compte: 101,
    solde: 1500.50,
    type_compte: 'bénéficiaire',
    id_utilisateur: 1
  });

  transactions = signal<Transaction[]>([
    {
      id_transaction: 1,
      id_transaction_str: 'TRX-001',
      client: 'Mohamed Ben Ali',
      type_transaction: 'Dépôt',
      montant: 5000.00,
      date_transaction: new Date('2026-02-08'),
      statut: 'Complété',
      id_compte_source: 101,
      id_compte_destination: 101
    },
    {
      id_transaction: 2,
      id_transaction_str: 'TRX-002',
      client: 'Fatma Gharbi',
      type_transaction: 'Retrait',
      montant: -2000.00,
      date_transaction: new Date('2026-02-07'),
      statut: 'Complété',
      id_compte_source: 101,
      id_compte_destination: 202
    },
    {
      id_transaction: 3,
      id_transaction_str: 'TRX-003',
      client: 'Ahmed Sassi',
      type_transaction: 'Transfert',
      montant: 10000.00,
      date_transaction: new Date('2026-02-06'),
      statut: 'En attente',
      id_compte_source: 101,
      id_compte_destination: 303
    },
    {
      id_transaction: 4,
      id_transaction_str: 'TRX-004',
      client: 'Leila Trabelsi',
      type_transaction: 'Dépôt',
      montant: 7500.00,
      date_transaction: new Date('2026-02-05'),
      statut: 'Complété',
      id_compte_source: 101,
      id_compte_destination: 101
    }
  ]);

  creditStats = signal<CreditStats>({
    totalCredit: 5000,
    repaid: 3250,
    remaining: 1750
  });

  productSales = signal<ProductSale[]>([
    { item: 'Smartphone X', amount: 800, date: new Date('2026-02-01'), status: 'Vendu' },
    { item: 'Laptop Pro', amount: 1500, date: new Date('2026-02-05'), status: 'Vendu' },
    { item: 'Tablette Tab', amount: 400, date: new Date('2026-02-10'), status: 'En cours' }
  ]);

  budget = signal<Budget>({
    total: 3000,
    allocated: 1200,
    available: 1800
  });

  constructor() { }

  createAccount(details: any) {
    this.hasFinancialAccount.set(true);
  }

  getChatbotResponse(question: string): string {
    const q = question.toLowerCase();
    if (q.includes('finance') || q.includes('financier')) {
      return "Le module de gestion financière suit tous les flux financiers de la plateforme, incluant les comptes et les transactions.";
    }
    if (q.includes('remboursement') || q.includes('rembourser')) {
      return "Les remboursements sont traités comme des transactions spécifiques. Le délai moyen est de 3 à 5 jours ouvrables selon le type de compte.";
    }
    if (q.includes('crédit') || q.includes('credit')) {
      return "Nous proposons plusieurs offres de crédit adaptées à vos besoins. Vous pouvez consulter la section Crédit pour plus de détails.";
    }
    if (q.includes('solde') || q.includes('argent')) {
      return `Votre solde actuel est de ${this.currentAccount().solde} €.`;
    }
    return "Je ne suis pas sûr de comprendre. Vous pouvez poser des questions sur la finance, les remboursements ou votre crédit.";
  }
}
