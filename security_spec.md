# Spécification de Sécurité ImmoPilot - TogoLux Properties

## 1. Invariants de Données et Règles Métier

- **Isolation Stricte du Bailleur (Zero-Leak)** : Un utilisateur ayant le rôle `owner` ne peut en aucun cas lire ou modifier des biens, contrats, quittances de paiement, dépenses, interventions de maintenance ou rapports appartenant à un autre propriétaire.
- **Rôles Internes Privilégiés** :
  - `admin` (incluant l'administrateur système `olamonde7@gmail.com`) : Accès total aux opérations.
  - `manager` : Gestion complète des biens, propriétaires, locataires, contrats, maintenance et documents ; consultation des finances.
  - `accountant` : Gestion des transactions, quittances, paiements, dépenses, reversements et rapports financiers.
  - `agent` : Gestion opérationnelle des biens, locataires, interventions et consultation des tiers.
- **Immuabilité des Traces d'Audit** : Les documents de la collection `auditLogs` ne peuvent jamais être modifiés (`update: if false`) ni supprimés (`delete: if false`).
- **Contrôle d'Intégrité Relationnelle** :
  - Tout contrat doit lier un bien existant, un bailleur existant et un locataire existant.
  - Tout paiement doit référencer le bien et le bailleur appropriés.
  - Tout document lié à un bailleur ne peut être lu que par l'agence ou ce bailleur précis.

## 2. The Dirty Dozen Payloads (Tentatives d'Exploitation Rejetées)

1. **Privilege Escalation** : Un utilisateur avec rôle `agent` tente de s'attribuer le rôle `admin` dans `/users/{userId}`.
2. **Cross-Owner Property Read** : Un bailleur authentifié A tente d'exécuter un `get` ou `list` sur les propriétés du bailleur B.
3. **Cross-Owner Payment Sniffing** : Un bailleur tente de consulter les quittances ou montants d'un autre bien non possédé.
4. **Audit Log Tampering** : Un employé tente de supprimer ou mettre à jour un document dans `/auditLogs/{logId}`.
5. **Orphan Payment Injection** : Insertion d'un paiement avec un montant négatif ou sans `propertyId` ou `ownerId`.
6. **Owner Payout Self-Approval** : Un agent non-comptable tente de passer le statut d'un reversement à `paid`.
7. **Identity Spoofing on Tenant** : Un utilisateur anonyme ou non autorisé tente de lire les pièces d'identité de locataires dans `/tenants/{tenantId}`.
8. **Shadow Field Injection** : Ajout d'un champ non autorisé `isAdmin: true` lors de la création d'un document.
9. **Denial of Wallet Attack** : Envoi d'un ID de plus de 128 caractères ou payload contenant des chaînes volumineuses non conformes.
10. **Maintenance Quote Modification Post-Completion** : Modification d'une intervention déjà marquée `completed`.
11. **Direct Role Manipulation** : Modification du champ `role` par un utilisateur lambda sur son propre document `users`.
12. **Unauthenticated Read** : Tentative de lecture des documents confidentiels sans jeton d'authentification valide.
