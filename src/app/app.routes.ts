import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
   {
    path: '',
    redirectTo: 'auth/sign-in',
    pathMatch: 'full'
  },
  // FRONT
  {
    path: 'front',
    loadComponent: () =>
      import('./layout/all-template-front/all-template-front.component')
        .then(m => m.AllTemplateFrontComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(m => m.ContactComponent)
      }, 
      {
  path: 'credit',
  loadComponent: () =>
    import('./pages/credit/credit.component').then(m => m.CreditComponent)
},
{
  path: 'crowdfunding',
  loadComponent: () =>
    import('./pages/crowdfunding/crowdfunding.component').then(m => m.CrowdfundingComponent)
},
{
  path: 'finance',
  loadComponent: () =>
    import('./pages/finance-front/finance-front.component').then(m => m.FinanceFrontComponent)
},
{
  path: 'partnership',
  loadComponent: () =>
    import('./pages/partnership/partnership.component').then(m => m.PartnershipComponent)
},
{
  path: 'events',
  loadComponent: () =>
    import('./pages/events-front/events-front.component').then(m => m.EventsFrontComponent)
},
{
  path: 'ecommerce',
  loadComponent: () =>
    import('./pages/ecommerce/ecommerce-front/ecommerce-front.component')
      .then(m => m.EcommerceFrontComponent)
},
{
  path: 'products/:id',
  loadComponent: () =>
    import('./pages/ecommerce/product-detail-front/product-detail-front.component')
      .then(m => m.ProductDetailFrontComponent)
},
{
  path: 'cart',
  loadComponent: () =>
    import('./pages/ecommerce/cart/cart.component').then(m => m.CartComponent)
},
{
  path: 'orders',
  loadComponent: () =>
    import('./pages/ecommerce/orders-front/orders-front.component').then(m => m.OrdersFrontComponent)
},
{
  path: 'checkout',
  loadComponent: () =>
    import('./pages/ecommerce/checkout/checkout.component').then(m => m.CheckoutComponent)
},

{
  path: 'profile',
  loadComponent: () =>
    import('./pages/profile-front/profile-front.component').then(m => m.ProfileFrontComponent)
}
    ]
  },

  // AUTH
  {
    path: 'auth',
    children: [
      {
        path: 'sign-in',
        loadComponent: () =>
          import('./features/auth/sign-in/sign-in.component')
            .then(m => m.SignInComponent),
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./features/auth/sign-up/sign-up.component')
            .then(m => m.SignUpComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password.component')
            .then(m => m.ForgotPasswordComponent),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password.component')
            .then(m => m.ResetPasswordComponent),
      },
      {
        path: 'verify-otp',
        loadComponent: () =>
          import('./features/auth/verify-otp/verify-otp.component')
            .then(m => m.VerifyOtpComponent),
      },
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
      }
    ],
  },

  // ADMIN
  {
    path: 'admin',
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout.component')
        .then(m => m.AdminLayoutComponent),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users.component')
            .then(m => m.UsersComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component')
            .then(m => m.ProfileComponent)
      },
      {
        path: 'security',
        loadComponent: () =>
          import('./features/security/security.component')
            .then(m => m.SecurityComponent)
      },
      {
        path: 'ecommerce',
        loadComponent: () =>
          import('./features/ecommerce/ecommerce.component')
            .then(m => m.EcommerceComponent)
      },
      {
  path: 'ecommerce/categories',
  loadComponent: () =>
    import('./features/ecommerce/categories-admin/categories-admin.component')
      .then(m => m.CategoriesAdminComponent)
},
{
  path: 'ecommerce/products',
  loadComponent: () =>
    import('./features/ecommerce/products-admin/products-admin.component')
      .then(m => m.ProductsAdminComponent)
},
{
  path: 'ecommerce/products/new',
  loadComponent: () =>
    import('./features/ecommerce/product-form-admin/product-form-admin.component')
      .then(m => m.ProductFormAdminComponent)
},
{
  path: 'ecommerce/products/edit/:id',
  loadComponent: () =>
    import('./features/ecommerce/product-form-admin/product-form-admin.component')
      .then(m => m.ProductFormAdminComponent)
},
{
  path: 'ecommerce/orders',
  loadComponent: () =>
    import('./features/ecommerce/orders-admin/orders-admin.component')
      .then(m => m.OrdersAdminComponent)
},
{
  path: 'ecommerce/promo-codes',
  loadComponent: () =>
    import('./features/ecommerce/promo-codes-admin/promo-codes-admin.component')
      .then(m => m.PromoCodesAdminComponent)
},
{
  path: 'ecommerce/payments',
  loadComponent: () =>
    import('./features/ecommerce/payments-admin/payments-admin.component')
      .then(m => m.PaymentsAdminComponent)
},
{
  path: 'ecommerce/deliveries',
  loadComponent: () =>
    import('./features/ecommerce/deliveries-admin/deliveries-admin.component')
      .then(m => m.DeliveriesAdminComponent)
},

      {
        path: 'finance',
        loadComponent: () =>
          import('./features/finance/finance.component')
            .then(m => m.FinanceComponent)
      },
      {
        path: 'credit',
        loadComponent: () =>
          import('./features/credit/credit.component')
            .then(m => m.CreditComponent)
      },
      {
        path: 'partners-insurance',
        loadComponent: () =>
          import('./features/partners-insurance/partners-insurance.component')
            .then(m => m.PartnersInsuranceComponent)
      },
      {
        path: 'crowdfunding',
        loadComponent: () =>
          import('./features/crowdfunding/crowdfunding.component')
            .then(m => m.CrowdfundingComponent)
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./features/events/events.component')
            .then(m => m.EventsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: '**',
     redirectTo: 'auth/sign-in'
  }
];