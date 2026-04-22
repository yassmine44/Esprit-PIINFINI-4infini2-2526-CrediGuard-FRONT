# Scenarios UI sans auth (clic par clic)

Ce document couvre les parcours fonctionnels a tester sans decrire le login/sign-up.

## Pre-requis

- Backend demarre sur le port 8090.
- Front demarre (ex: http://localhost:62581).
- Session deja connectee dans le navigateur:
  - soit utilisateur front (Beneficiary/PARTNER)
  - soit admin (ADMIN)

---

## A. Parcours Front (hors auth)

### Scenario F1 - Navigation principale front
Objectif: verifier que le menu front charge tous les modules publics.

Etapes:
1. Ouvrir /front.
2. Cliquer successivement dans le header: Home, About, Contact, Credit, Crowdfunding, Finance, Partnership, Events, E-Commerce.

Resultat attendu:
- Chaque clic change la route vers /front/... correspondante.
- Aucune erreur console bloquante.

### Scenario F2 - Raccourcis Home
Objectif: verifier les boutons/cartes de navigation de la page Home.

Etapes:
1. Aller sur /front.
2. Cliquer le bouton Get Started.
3. Revenir Home.
4. Cliquer chaque carte: Finance, E-commerce, Credit, Partners.

Resultat attendu:
- Get Started redirige vers /front/finance.
- Chaque carte ouvre le module cible.

### Scenario F3 - Profil front (mise a jour)
Objectif: verifier lecture + update du profil utilisateur.

Etapes:
1. Depuis le header, cliquer l icone Profile.
2. Verifier la page /front/profile.
3. Modifier Full Name, Email, Phone.
4. Cliquer Save Changes.

Resultat attendu:
- Message de succes: Profile updated successfully.
- Les nouvelles valeurs restent visibles apres refresh.

### Scenario F4 - Finance: creation de compte
Objectif: verifier la creation du compte financier depuis la vue front.

Etapes:
1. Aller sur /front/finance.
2. Si le formulaire de creation apparait, remplir:
   - Nom
   - Prenom
   - Email
   - Telephone
   - Solde initial
   - Type de Compte
3. Cliquer CREER MON COMPTE.

Resultat attendu:
- Message de succes de creation.
- La vue bascule vers Tableau de Bord Financier.

### Scenario F5 - Finance: transactions et filtres
Objectif: verifier creation/lecture transaction + recherche.

Etapes:/
1. Dans Tableau de Bord Financier, cliquer Ajouter transaction test.
2. Dans le tableau Transactions des Clients, cliquer l icone oeil sur une ligne.///f ne marche pas
3. Dans la meme ligne, cliquer l icone refresh.///f il créer un nouvelle ligne
4. Utiliser Rechercher un client... et Status (Tous les statuts, Complete, En attente, Annule).

Resultat attendu:
- Une transaction test est creee.
- Le detail transaction est charge (message API en haut).
- Les filtres filtrent correctement le tableau.

### Scenario F6 - Finance: mise a jour solde
Objectif: verifier update compte financier.

Etapes:
1. Cliquer Mettre a jour solde.
2. Dans la popup navigateur, saisir un nouveau montant.
3. Valider.

Resultat attendu:
- Message de succes de mise a jour.
- Le solde affiche est mis a jour.///f je trouve pas la nouvelle solde, je trouve pas son emplament d'affichage

### Scenario F7 - Finance: operations credit (remboursements + regles)
Objectif: verifier les actions API sur remboursements et regles.

Etapes:
1. Dans Operations Credit, saisir Credit ID.
2. Cliquer Charger par Credit ID.
3. Bloc Nouveau Remboursement:
   - saisir Credit ID
   - saisir Montant
   - saisir Mode
   - (optionnel) Transaction ID
   - cliquer Creer remboursement///f echec
4. Dans la liste remboursements, cliquer l icone oeil.
5. Bloc Regles de Remboursement: ///f echec
   - saisir Credit ID
   - choisir type regle
   - saisir valeur
   - cliquer Creer regle
6. Sur une regle creee: 
   - cliquer oeil
   - cliquer crayon (update)
   - cliquer poubelle (delete)

Resultat attendu:
- Chargement par credit fonctionne.
- Creation remboursement/regle fonctionne.
- View/update/delete regle fonctionnent.

### Scenario F8 - Finance: suppression compte///f ne marche pas
Objectif: verifier suppression du compte financier.

Etapes:
1. Cliquer Supprimer compte.
2. Confirmer dans la popup navigateur.

Resultat attendu:
- Message de suppression.
- Retour a la vue de creation de compte.

---

## B. Parcours Admin (hors auth)

### Scenario A1 - Navigation sidebar admin///f tous cela ne marche pas, si je mettre /admin/ une autre chose, il ne marche pas et retourne au main page
Objectif: verifier toutes les routes admin accessibles.

Etapes:
1. Ouvrir /admin/dashboard.//ne marche pas
2. Dans la sidebar, cliquer: Dashboard, Users, Security, E-Commerce, Finance, Credit, Partners & Insurance, Crowdfunding, Events.

Resultat attendu:
- Chaque lien charge la page correspondante.
- Pas de redirection inattendue vers sign-in si token admin valide.

### Scenario A2 - Users: creation utilisateur
Objectif: verifier creation user depuis popup admin.

Etapes:
1. Aller sur /admin/users.
2. Cliquer + Add User.
3. Remplir le popup:
   - Full Name
   - Email
   - Password
   - Role (Beneficiary/PARTNER/Admin)
   - Phone (8 chiffres)
4. Cliquer Create.

Resultat attendu:
- Le popup se ferme.
- Le nouvel utilisateur apparait dans Users List.
- Les compteurs (Total Users, Active Users, etc.) se mettent a jour.

### Scenario A3 - Users: recherche et pagination
Objectif: verifier filtre + navigation pages.

Etapes:
1. Dans Search by name or email..., taper une valeur.
2. Verifier le nombre de resultats.
3. Si plusieurs pages, cliquer Next puis Prev.

Resultat attendu:
- Le filtre fonctionne sur nom/email.
- La pagination fonctionne sans erreur.

### Scenario A4 - Users: edition utilisateur
Objectif: verifier update user (role, statut, mot de passe optionnel).

Etapes:
1. Sur une ligne utilisateur, cliquer Edit.
2. Dans le popup Edit User, modifier un ou plusieurs champs:
   - Full Name
   - Email
   - New Password (optionnel)
   - Role
   - Phone
   - Status (Active/Disabled)
3. Cliquer Save.

Resultat attendu:
- Le popup se ferme.
- La ligne utilisateur est mise a jour dans le tableau.

### Scenario A5 - Users: suppression utilisateur
Objectif: verifier delete user.

Etapes:
1. Sur une ligne utilisateur, cliquer Delete.
2. Confirmer Delete this user?.

Resultat attendu:
- L utilisateur disparait du tableau.
- Les compteurs sont recalcules.

### Scenario A6 - Finance admin dashboard
Objectif: verifier chargement dashboard finance admin.

Etapes:
1. Aller sur /admin/finance.
2. Verifier les cards: Total Transactions, Total Revenue, Total Expenses, Financial Alerts.
3. Descendre sur Recent Transactions.

Resultat attendu:
- Les valeurs se chargent depuis API.
- En cas d erreur API, un message d erreur explicite apparait.

---

## C. Parcours complet conseille (sans auth)

1. F1 -> F2 -> F3
2. F4 -> F5 -> F6 -> F7 -> F8
3. A1 -> A2 -> A3 -> A4 -> A5 -> A6

Ce parcours couvre les principaux boutons et scenarios metier hors authentification.
