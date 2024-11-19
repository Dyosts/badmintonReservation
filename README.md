# Système de réservation de terrains de badminton

## Table des matières
- [Lancer le projet](#lancer-le-projet)
- [Conception](#conception)
    - [Dictionnaire des données](#dictionnaire-des-donnéees)
- [Sécurité](#sécurité)
- [Remarques](#remarques)

## Lancer le projet
## Conception
### Dictionnaire des donnéees

| Nom               | Type    | Description                                                       |
|-------------------|---------|-------------------------------------------------------------------|
| id                | UUID    | Identifiant unique des ressources                                 | 
| pseudo            | String  | Pseudo d'un utilisateur (adhérent ou admin)                       |
| password          | String  | Mot de passe de l'administrateur                                  |
| role              | Enum    | Rôle de l'administrateur (admin, user)                            |
| field             | String  | Nom du terrain (A,B,C,D)                                          |
| availability      | Boolean | Indique si le terrain est disponible                              |
| reservation-date  | Date    | Date de la réservation (du lundi au samedi)                       |
| reservation-start | Time    | Heure de début de la réservation (45 min entre 10h et 22h)        |
| reservation-end   | Time    | Heure de fin de la réservation (calculé automatiquement)          |
| user_id           | UUID    | Identifiant unique de l'utilisateur ayant effectué la réservation |

### Liste des ressources

| Ressource                | URL                | Méthode HTTP | Paramètres d'URL / Variations | Commentaires                                                          |
|--------------------------|--------------------|--------------|-------------------------------|-----------------------------------------------------------------------|
| Authentification         | /login             | GET          | Aucune                        | Authentifie un utilisateur ou un administrateur et retourne un token. |
| Liste des terrains       | /fields            | GET          | Aucune                        | Retourne la liste des terrains et leur état de disponibilité.         |
| Modifier un terrain      | /fields/{id}       | PATCH        | id: identifiant terrain       | Met à jour l’état d’indisponibilité d’un terrain (admin uniquement).  |
| Liste des réservations   | /reservations      | GET          | Aucune                        | Retourne les réservations pour la semaine en cours.                   |
| Ajouter une réservation  | /reservations      | POST         | Aucune                        | Permet de réserver un créneau pour un terrain donné.                  |
| Annuler une réservation  | /reservations/{id} | DELETE       | id: identifiant réservation   | Supprime une réservation existante.                                   |
| Créer un utilisateur     | /users             | POST         | Aucune                        | Permet de créer un utilisateur (optionnel, futur).                    |
| Supprimer un utilisateur | /users/{id}        | DELETE       | id: identifiant utilisateur   | Supprime un utilisateur (optionnel, futur).                           |

## Sécurité
## Remarques