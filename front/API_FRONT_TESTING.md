# Front API Map and Testing Guide

This file lists all backend APIs currently exposed and how to test them from the frontend.

## 1) Current setup (from this workspace)

- Backend port: `8090`
- Front proxy: `/api` -> `http://localhost:8090` (see `proxy.conf.json`)
- Front dev server: any localhost port (for example `4200` or `62581`)
- JWT: attached automatically by frontend interceptor after login

## 2) Start commands

Backend (from project root):

```powershell
& "c:\Users\mouha\Downloads\projet_nadine\back\back\mvnw.cmd" -f "c:\Users\mouha\Downloads\projet_nadine\back\back\pom.xml" spring-boot:run
```

Frontend (from `front/front`):

```powershell
npm start
```

## 3) Admin account for frontend access

This account is auto-created at backend startup:

- Email: `ad!min@crediguard.local`
- Password: `Admin123`

## 4) Fast test (all main frontend APIs)

Use the smoke script in this project:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-front.ps1 -FrontBaseUrl http://localhost:62581 -Email admin@crediguard.local -Password Admin123!
```

If your frontend runs on `4200`, replace `62581` with `4200`.

## 5) API catalog + how to trigger from frontend

### Auth APIs (public)

| Method | Endpoint | Access | Front trigger |
|---|---|---|---|
| POST | `/api/auth/register` | Public | `/auth/sign-up` form submit |
| POST | `/api/auth/login` | Public | `/auth/sign-in` form submit |

Register payload example:

```json
{
  "fullName": "Test User",
  "email": "test.user@mail.com",
  "password": "123456",
  "phone": "12345678",
  "userType": "Beneficiary",
  "enabled": true
}
```

Login payload example:

```json
{
  "email": "admin@crediguard.local",
  "password": "Admin123!"
}
```

### User APIs

| Method | Endpoint | Access | Front trigger |
|---|---|---|---|
| GET | `/api/users/me` | Authenticated | `/front/profile` load; also finance bootstrap |
| PUT | `/api/users/me` | Authenticated | `/front/profile` -> Save Changes |
| GET | `/api/users` | Admin | `/admin/users` page load |
| GET | `/api/users/{id}` | Admin | `/admin/users` -> Edit button (preload) |
| POST | `/api/users` | Admin | `/admin/users` -> Add User |
| PUT | `/api/users/{id}` | Admin | `/admin/users` -> Edit -> Save |
| DELETE | `/api/users/{id}` | Admin | `/admin/users` -> Delete |

Update profile payload example:

```json
{
  "fullName": "Updated Name",
  "email": "updated@mail.com",
  "phone": "12345678"
}
```

### Finance APIs (authenticated)

| Method | Endpoint | Access | Front trigger |
|---|---|---|---|
| GET | `/api/finance/summary` | Authenticated | `/front/finance` load |
| GET | `/api/comptes-financiers` | Authenticated | `/front/finance` load |
| GET | `/api/comptes-financiers/{id}` | Authenticated | `/front/finance` account details flow |
| GET | `/api/comptes-financiers/utilisateur/{utilisateurId}` | Authenticated | `/front/finance` account-by-user flow |
| POST | `/api/comptes-financiers` | Authenticated | `/front/finance` create account |
| PUT | `/api/comptes-financiers/{id}` | Authenticated | `/front/finance` update balance |
| DELETE | `/api/comptes-financiers/{id}` | Authenticated | `/front/finance` delete account |
| GET | `/api/transactions` | Authenticated | `/front/finance` load |
| GET | `/api/transactions/{id}` | Authenticated | `/front/finance` view transaction |
| GET | `/api/transactions/compte/{compteId}` | Authenticated | `/front/finance` account transactions |
| POST | `/api/transactions` | Authenticated | `/front/finance` quick transaction |
| GET | `/api/remboursements` | Authenticated | `/front/finance` load |
| GET | `/api/remboursements/{id}` | Authenticated | `/front/finance` view remboursement |
| GET | `/api/remboursements/credit/{creditId}` | Authenticated | `/front/finance` load by credit |
| POST | `/api/remboursements` | Authenticated | `/front/finance` create remboursement |
| GET | `/api/regles-remboursement` | Authenticated | `/front/finance` load |
| GET | `/api/regles-remboursement/{id}` | Authenticated | `/front/finance` view regle |
| GET | `/api/regles-remboursement/credit/{creditId}` | Authenticated | `/front/finance` load by credit |
| POST | `/api/regles-remboursement` | Authenticated | `/front/finance` create regle |
| PUT | `/api/regles-remboursement/{id}` | Authenticated | `/front/finance` update regle |
| DELETE | `/api/regles-remboursement/{id}` | Authenticated | `/front/finance` delete regle |

Create account payload example:

```json
{
  "solde": 1000,
  "typeCompte": "BENEFICIAIRE",
  "utilisateurId": 1
}
```

Create transaction payload example:

```json
{
  "typeTransaction": "VENTE",
  "montant": 100,
  "compteSourceId": 1,
  "compteDestinationId": 1,
  "orderId": 123456
}
```

Create remboursement payload example:

```json
{
  "montant": 50,
  "mode": "automatique",
  "creditId": 1,
  "transactionId": 1
}
```

Create regle payload example:

```json
{
  "typeRegle": "POURCENTAGE_SUR_VENTE",
  "valeur": 5,
  "creditId": 1
}
```

## 6) Manual API checks through frontend origin (optional)

This checks APIs through the same front URL/proxy path used by browser calls.

```powershell
$base = "http://localhost:62581"
$login = Invoke-RestMethod -Uri "$base/api/auth/login" -Method POST -ContentType "application/json" -Body (@{ email="admin@crediguard.local"; password="Admin123!" } | ConvertTo-Json)
$token = $login.accessToken
$headers = @{ Authorization = "Bearer $token" }

Invoke-RestMethod -Uri "$base/api/users/me" -Method GET -Headers $headers
Invoke-RestMethod -Uri "$base/api/finance/summary" -Method GET -Headers $headers
Invoke-RestMethod -Uri "$base/api/comptes-financiers" -Method GET -Headers $headers
Invoke-RestMethod -Uri "$base/api/transactions" -Method GET -Headers $headers
Invoke-RestMethod -Uri "$base/api/remboursements" -Method GET -Headers $headers
Invoke-RestMethod -Uri "$base/api/regles-remboursement" -Method GET -Headers $headers
```

## 7) Important note about auth endpoints in frontend service

Frontend service includes these auth methods:

- `/api/auth/forgot-password`
- `/api/auth/reset-password`
- `/api/auth/verify-otp`
- `/api/auth/enable-2fa`
- `/api/auth/disable-2fa`
- `/api/auth/2fa-status`

These routes are currently referenced in frontend code but are not implemented in the current backend controllers. Calls to them will fail until backend endpoints are added.
