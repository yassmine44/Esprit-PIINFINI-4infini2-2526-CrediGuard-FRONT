import { Routes } from '@angular/router';
import { CreditComponent } from './credit.component';
import { DemandeCreditFormComponent } from './pages/demande-credit-form/demande-credit-form.component';
import { DemandeCreditHistoryComponent } from './pages/demande-credit-history/demande-credit-history.component';

export const FRONT_CREDIT_ROUTES: Routes = [
  {
    path: '',
    component: CreditComponent,
  },
  {
    path: 'request',
    component: DemandeCreditFormComponent,
  },
  {
    path: 'history',
    component: DemandeCreditHistoryComponent,
  },
  {
    path: 'history/:demandeId/plan',
    loadComponent: () =>
      import('./pages/plan-utilisation-form/plan-utilisation-form.component')
        .then(m => m.PlanUtilisationFormComponent),
  },
  {
    path: 'wallet',
    loadComponent: () =>
      import('./pages/credit-wallet/credit-wallet.component')
        .then(m => m.CreditWalletComponent),
  },
  {
    path: 'wallet/:creditId/echeances',
    loadComponent: () =>
      import('./pages/echeance-list/echeance-list.component')
        .then(m => m.EcheanceListComponent),
  },
];