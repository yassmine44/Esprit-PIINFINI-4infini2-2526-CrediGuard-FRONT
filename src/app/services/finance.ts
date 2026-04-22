import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id_utilisateur: number;
  nom: string;
  role: 'bénéficiaire' | 'partenaire' | 'admin';
}

export type CompteTypeApi = 'BENEFICIAIRE' | 'PARTENAIRE' | 'PLATEFORME';
export type TransactionTypeApi = 'VENTE' | 'ACHAT' | 'REMBOURSEMENT';
export type TransactionStatutApi = 'PENDING' | 'COMPLETED' | 'FAILED';
export type RegleTypeApi = 'POURCENTAGE_SUR_VENTE' | 'MONTANT_FIXE';

export interface FinancialAccountApi {
  idCompte: number;
  solde: number;
  typeCompte: CompteTypeApi;
  utilisateurId: number;
}

export interface CreateFinancialAccountRequest {
  solde: number;
  typeCompte: CompteTypeApi;
  utilisateurId: number;
}

export type UpdateFinancialAccountRequest = CreateFinancialAccountRequest;

export interface TransactionApi {
  idTransaction: number;
  typeTransaction: TransactionTypeApi;
  montant: number;
  dateTransaction: string;
  statut: TransactionStatutApi;
  compteSourceId: number;
  compteDestinationId: number;
  orderId: number;
}

export interface CreateTransactionRequest {
  typeTransaction: TransactionTypeApi;
  montant: number;
  compteSourceId: number;
  compteDestinationId: number;
  orderId?: number;
}

export interface RemboursementApi {
  idRemboursement: number;
  montant: number;
  dateRemboursement: string;
  mode: string;
  creditId: number;
  transactionId?: number;
}

export interface CreateRemboursementRequest {
  montant: number;
  mode?: string;
  creditId: number;
  transactionId?: number;
}

export interface RegleRemboursementApi {
  idRegle: number;
  typeRegle: RegleTypeApi;
  valeur: number;
  creditId: number;
}

export interface CreateRegleRemboursementRequest {
  typeRegle: RegleTypeApi;
  valeur: number;
  creditId: number;
}

export type UpdateRegleRemboursementRequest = CreateRegleRemboursementRequest;

export interface FinanceSummary {
  totalTransactions: number;
  totalRevenue: number;
  totalExpenses: number;
  totalAccounts: number;
  pendingTransactions: number;
  totalRemboursements: number;
  totalUsers: number;
  totalAdmins: number;
  totalBeneficiaries: number;
  totalPartners: number;
  totalCredits: number;
  activeCredits: number;
  closedCredits: number;
  totalAmountGranted: number;
  totalAmountRemaining: number;
  revenueTrend: number;
  expenseTrend: number;
  monthlyRevenue: { [key: string]: number };
  monthlyExpenses: { [key: string]: number };
  activeAlerts: string[];
  forecastedRevenue: number;
}

export interface FinanceCreditApi {
  id: number;
  montantRestant: number;
  statut: string;
}

export interface FinancialAccount {
  id_compte: number;
  solde: number;
  type_compte: 'bénéficiaire' | 'partenaire' | 'plateforme';
  id_utilisateur: number;
}

export interface Transaction {
  id_transaction: number;
  id_transaction_str?: string;
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

// Valeur par défaut du summary quand l'endpoint n'existe pas encore
const EMPTY_SUMMARY: FinanceSummary = {
  totalTransactions: 0,
  totalRevenue: 0,
  totalExpenses: 0,
  totalAccounts: 0,
  pendingTransactions: 0,
  totalRemboursements: 0,
  totalUsers: 0,
  totalAdmins: 0,
  totalBeneficiaries: 0,
  totalPartners: 0,
  totalCredits: 0,
  activeCredits: 0,
  closedCredits: 0,
  totalAmountGranted: 0,
  totalAmountRemaining: 0,
  revenueTrend: 0,
  expenseTrend: 0,
  monthlyRevenue: {},
  monthlyExpenses: {},
  activeAlerts: [],
  forecastedRevenue: 0
};

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  private readonly apiUrl = environment.apiUrl;

  // ================= SIGNALS =================

  hasFinancialAccount = signal<boolean>(false);

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
    { item: 'Smartphone X', amount: 800,  date: new Date('2026-02-01'), status: 'Vendu'    },
    { item: 'Laptop Pro',   amount: 1500, date: new Date('2026-02-05'), status: 'Vendu'    },
    { item: 'Tablette Tab', amount: 400,  date: new Date('2026-02-10'), status: 'En cours' }
  ]);

  budget = signal<Budget>({
    total: 3000,
    allocated: 1200,
    available: 1800
  });

  constructor(private http: HttpClient) {}

  // ================= NORMALIZER =================

  /**
   * Convertit une entité Spring (relations imbriquées compteSource/compteDestination)
   * vers le format plat TransactionApi utilisé par le frontend.
   */
  private normalizeTransaction(t: any): TransactionApi {
    return {
      idTransaction:       t.idTransaction              ?? t.id               ?? 0,
      typeTransaction:     t.typeTransaction             ?? 'VENTE',
      montant:             t.montant                    ?? 0,
      dateTransaction:     t.dateTransaction             ?? new Date().toISOString(),
      statut:              t.statut                     ?? 'PENDING',
      compteSourceId:      t.compteSource?.idCompte     ?? t.compteSourceId   ?? 0,
      compteDestinationId: t.compteDestination?.idCompte ?? t.compteDestinationId ?? 0,
      orderId:             t.orderId                    ?? 0
    };
  }

  /**
   * Convertit une entité Spring CompteFinancier vers le format plat FinancialAccountApi.
   * Le backend retourne utilisateur comme objet imbriqué { id, ... }.
   */
  private normalizeAccount(a: any): FinancialAccountApi {
    return {
      idCompte:      a.idCompte      ?? a.id          ?? 0,
      solde:         a.solde         ?? 0,
      typeCompte:    a.typeCompte    ?? 'BENEFICIAIRE',
      utilisateurId: a.utilisateur?.id ?? a.utilisateurId ?? 0
    };
  }

  // ================= FINANCE SUMMARY =================

  /**
   * Endpoint /finance/summary pas encore créé dans le backend.
   * Retourne des données vides jusqu'à ce que le backend soit mis à jour.
   * → Remplacez of(EMPTY_SUMMARY) par l'appel HTTP une fois l'endpoint créé.
   */
  getFinanceSummary(): Observable<FinanceSummary> {
    // TODO: décommenter quand le backend aura créé GET /finance/summary
    // return this.http.get<FinanceSummary>(`${this.apiUrl}/finance/summary`);
    return of(EMPTY_SUMMARY);
  }

  /**
   * Endpoint /finance/credits pas encore créé dans le backend.
   * Retourne une liste vide jusqu'à ce que le backend soit mis à jour.
   * → Remplacez of([]) par l'appel HTTP une fois l'endpoint créé.
   */
  getCreditsApi(): Observable<FinanceCreditApi[]> {
    // TODO: décommenter quand le backend aura créé GET /finance/credits
    // return this.http.get<FinanceCreditApi[]>(`${this.apiUrl}/finance/credits`);
    return of([]);
  }

  // ================= COMPTES FINANCIERS =================

  getAccountsApi(): Observable<FinancialAccountApi[]> {
    return this.http.get<any[]>(`${this.apiUrl}/comptes-financiers`).pipe(
      map(accounts => accounts.map(a => this.normalizeAccount(a)))
    );
  }

  getAccountByIdApi(id: number): Observable<FinancialAccountApi> {
    return this.http.get<any>(`${this.apiUrl}/comptes-financiers/${id}`).pipe(
      map(a => this.normalizeAccount(a))
    );
  }

  /**
   * Endpoint /comptes-financiers/utilisateur/{id} pas encore dans le backend.
   * À activer une fois l'endpoint ajouté dans CompteFinancierController.java.
   */
  getAccountByUserIdApi(userId: number): Observable<FinancialAccountApi> {
    // TODO: décommenter quand le backend aura l'endpoint GET /comptes-financiers/utilisateur/{id}
    // return this.http.get<any>(`${this.apiUrl}/comptes-financiers/utilisateur/${userId}`).pipe(
    //   map(a => this.normalizeAccount(a))
    // );
    return of({
      idCompte: 0,
      solde: 0,
      typeCompte: 'BENEFICIAIRE' as CompteTypeApi,
      utilisateurId: userId
    });
  }

  createAccountApi(payload: CreateFinancialAccountRequest): Observable<FinancialAccountApi> {
    // Le backend attend une entité CompteFinancier avec utilisateur imbriqué
   // Actuellement dans createAccountApi()
const body = {
  solde:      payload.solde,
  typeCompte: payload.typeCompte,
  utilisateur: { id: payload.utilisateurId }  // ← peut causer 500
};
    return this.http.post<any>(`${this.apiUrl}/comptes-financiers`, body).pipe(
      map(a => this.normalizeAccount(a))
    );
  }

  updateAccountApi(id: number, payload: UpdateFinancialAccountRequest): Observable<FinancialAccountApi> {
    const body = {
      solde:      payload.solde,
      typeCompte: payload.typeCompte,
      utilisateur: { id: payload.utilisateurId }
    };
    return this.http.put<any>(`${this.apiUrl}/comptes-financiers/${id}`, body).pipe(
      map(a => this.normalizeAccount(a))
    );
  }

  deleteAccountApi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comptes-financiers/${id}`);
  }

  // ================= TRANSACTIONS =================

  getTransactionsApi(): Observable<TransactionApi[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transactions`).pipe(
      map(transactions => transactions.map(t => this.normalizeTransaction(t)))
    );
  }

  getTransactionByIdApi(id: number): Observable<TransactionApi> {
    return this.http.get<any>(`${this.apiUrl}/transactions/${id}`).pipe(
      map(t => this.normalizeTransaction(t))
    );
  }

  /**
   * Le backend n'a pas d'endpoint /transactions/compte/{id}.
   * On récupère toutes les transactions et on filtre côté frontend.
   */
  getTransactionsByCompteApi(compteId: number): Observable<TransactionApi[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transactions`).pipe(
      map(transactions =>
        transactions
          .map(t => this.normalizeTransaction(t))
          .filter(t =>
            t.compteSourceId === compteId || t.compteDestinationId === compteId
          )
      )
    );
  }

  createTransactionApi(payload: CreateTransactionRequest): Observable<TransactionApi> {
    // Le backend attend des objets imbriqués pour compteSource et compteDestination
    const body = {
      typeTransaction:   payload.typeTransaction,
      montant:           payload.montant,
      statut:            'PENDING',
      orderId:           payload.orderId ?? 1, // @NotNull dans l'entité Spring
      compteSource:      { idCompte: payload.compteSourceId },
      compteDestination: { idCompte: payload.compteDestinationId }
    };
    return this.http.post<any>(`${this.apiUrl}/transactions`, body).pipe(
      map(t => this.normalizeTransaction(t))
    );
  }

  // ================= REMBOURSEMENTS =================

  getRemboursementsApi(): Observable<RemboursementApi[]> {
    return this.http.get<RemboursementApi[]>(`${this.apiUrl}/remboursements`);
  }

  getRemboursementByIdApi(id: number): Observable<RemboursementApi> {
    return this.http.get<RemboursementApi>(`${this.apiUrl}/remboursements/${id}`);
  }

  getRemboursementsByCreditApi(creditId: number): Observable<RemboursementApi[]> {
    return this.http.get<RemboursementApi[]>(`${this.apiUrl}/remboursements/credit/${creditId}`);
  }

  createRemboursementApi(payload: CreateRemboursementRequest): Observable<RemboursementApi> {
    return this.http.post<RemboursementApi>(`${this.apiUrl}/remboursements`, payload);
  }

  // ================= REGLES REMBOURSEMENT =================

  getReglesRemboursementApi(): Observable<RegleRemboursementApi[]> {
    return this.http.get<RegleRemboursementApi[]>(`${this.apiUrl}/regles-remboursement`);
  }

  getRegleRemboursementByIdApi(id: number): Observable<RegleRemboursementApi> {
    return this.http.get<RegleRemboursementApi>(`${this.apiUrl}/regles-remboursement/${id}`);
  }

  getReglesRemboursementByCreditApi(creditId: number): Observable<RegleRemboursementApi[]> {
    return this.http.get<RegleRemboursementApi[]>(`${this.apiUrl}/regles-remboursement/credit/${creditId}`);
  }

  createRegleRemboursementApi(payload: CreateRegleRemboursementRequest): Observable<RegleRemboursementApi> {
    return this.http.post<RegleRemboursementApi>(`${this.apiUrl}/regles-remboursement`, payload);
  }

  updateRegleRemboursementApi(id: number, payload: UpdateRegleRemboursementRequest): Observable<RegleRemboursementApi> {
    return this.http.put<RegleRemboursementApi>(`${this.apiUrl}/regles-remboursement/${id}`, payload);
  }

  deleteRegleRemboursementApi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/regles-remboursement/${id}`);
  }

  // ================= UTILITAIRES =================

  createAccount(details: unknown) {
    void details;
    this.hasFinancialAccount.set(true);
  }

  getChatbotResponse(question: string): string {
    const q = question.toLowerCase();
    if (q.includes('finance') || q.includes('financier')) {
      return 'Le module de gestion financière suit tous les flux financiers de la plateforme, incluant les comptes et les transactions.';
    }
    if (q.includes('remboursement') || q.includes('rembourser')) {
      return 'Les remboursements sont traités comme des transactions spécifiques. Le délai moyen est de 3 à 5 jours ouvrables selon le type de compte.';
    }
    if (q.includes('crédit') || q.includes('credit')) {
      return 'Nous proposons plusieurs offres de crédit adaptées à vos besoins. Vous pouvez consulter la section Crédit pour plus de détails.';
    }
    if (q.includes('solde') || q.includes('argent')) {
      return `Votre solde actuel est de ${this.currentAccount().solde} TND.`;
    }
    return 'Je ne suis pas sûr de comprendre. Vous pouvez poser des questions sur la finance, les remboursements ou votre crédit.';
  }
}