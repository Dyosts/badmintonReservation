# Système de réservation de terrains de badminton

## Table des matières
- [Lancer le projet](#lancer-le-projet)
- [Conception](#conception)
    - [Dictionnaire des données](#dictionnaire-des-donnéees)
- [Sécurité](#sécurité)
  - [JWT](#jwt)
  - [Rate Limiter](#rate-limiter)
- [Remarques](#remarques)

## Lancer le projet

```
git clone
npm install
npm run start
```

## Conception
### Dictionnaire des donnéees

| Nom                 | Type     | Description                                                                  |
|---------------------|----------|------------------------------------------------------------------------------|
| id                  | UUID     | Identifiant unique des ressources                                            | 
| user-login          | String   | Pseudo d'un utilisateur (adhérent ou admin)                                  |
| user-password       | String   | Mot de passe de l'administrateur                                             |
| user-isAdmin        | Boolean  | Rôle de l'administrateur (admin, user)                                       |
| field-name          | String   | Nom du terrain (A,B,C,D)                                                     |
| field-availability  | Boolean  | Indique si le terrain est disponible                                         |
| reservation-date    | Datetime | Date et heure de la réservation (du lundi au samedi, 45min entre 10h et 22H) |
| reservation-fieldId | UUID     | Indentifiant unique du terrain concerné par la réservation                   |
| reservation-userId  | UUID     | Identifiant unique de l'utilisateur ayant effectué la réservation            |

### Liste des ressources

| Ressource                           | URL                       | Méthode HTTP | Paramètres d'URL / Variations | Commentaires                                                                |
|-------------------------------------|---------------------------|--------------|-------------------------------|-----------------------------------------------------------------------------|
| Authentification                    | /login                    | GET          | Aucune                        | Authentifie un utilisateur ou un administrateur et retourne un token.       |
| Liste des terrains                  | /fields                   | GET          | Aucune                        | Retourne la liste des terrains et leur état de disponibilité.               |
| Afficher un terrain                 | /fields/{id}              | GET          | id: identifiant terrain       | Retourne les informations d'un terrain spécifique                           |
| Modifier un terrain                 | /fields/{id}              | PUT          | id: identifiant terrain       | Met à jour l’état d’indisponibilité d’un terrain (admin uniquement).        |
| Liste des réservations              | /reservations             | GET          | Aucune                        | Retourne les réservations pour la semaine en cours. (admin)                 |
| Afficher une réservation            | /reservations/{id}        | GET          | id: identifiant reservation   | Retourne les informations d'une réservation spécifique                      |
| Liste les réservations d'un terrain | /fields/{id}/reservations | GET          | id: identifiant terrain       | Retourne toutes les reservations d'un terrain spécifique (admin)            |
| Ajouter une réservation             | /fields/{id}/reservations | POST         | id: identifiant terrain       | Permet de réserver un créneau pour un terrain donné. (utilisateur connecté) |
| Supprimer une réservation           | /reservations/{id}        | DELETE       | id: identifiant reservation   | Permet de supprimer une réservation (admin)                                 |

## Sécurité

### JWT
Certaines routes possèdent un middleware de vérification de token.
Deux versions de ce middleware ont été mises en place:
- checkUserTokenMiddleware
- checkAdminTokenMiddleware

Ils permettent donc de vérifier que l'utilisateur essayant d'accéder à la requête est bien un utilisateur connecté / un administrateur

### Rate limiter
La route de login bénéficie d'un rate limiter permettant de limiter le nombre de tentative de connexion.
Implémenté avec express rate limiter, celà permet de limiter le nombre de requête de connexion à 15 pour une durée de 15minutes. Ces variables sont configurables dans la fonction limiter.

## Remarques

Une amélioration à ajouter serait la vérification du jour pour les demandes de réservation. En effet rien n'empêche de réserver un terrain le dimanche même si le club est fermé ce jour.