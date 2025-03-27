# Task Manager

## Description
Application web de gestion de tâches développée avec Next.js pour le frontend et Laravel pour le backend API REST. 

## Fonctionnalités
- Authentification des utilisateurs (inscription, connexion)
- Création de tâches avec titre, image, description et date d'échéance
- Affichage de la liste des tâches
- Marquage des tâches comme terminées
- Modification et suppression des tâches (uniquement celles créées par l'utilisateur connecté)
- Visualisation de toutes les tâches (mais modification limitée aux tâches de l'utilisateur)
- Interface utilisateur intuitive

## Technologies utilisées
### Backend (Laravel)
- API RESTful pour la gestion des tâches
- Base de données MySQL
- Validation des données et gestion des erreurs
- Authentification Sanctum

### Frontend (Next.js)
- Interface utilisateur React
- Gestion d'état avec React Hooks
- Communication avec l'API backend
- Gestion des formulaires avec validation
- Affichages conditionnels (chargement, erreurs)

## Prérequis
- PHP 
- Composer
- Node.js
- npm ou yarn
- MySQL

## Installation

### Backend (Laravel)
1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/RudelAv/task-manager.git
   cd task-manager-backend
   ```

2. Installez les dépendances :
   ```bash
   composer install
   ```

3. Configurez le fichier .env :
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Configurez la base de données dans le fichier .env

5. Exécutez les migrations et les seeders :
   ```bash
   php artisan migrate --seed
   ```

6. Lancez le serveur :
   ```bash
   php artisan serve
   ```

### Frontend (Next.js)
1. Naviguez vers le dossier frontend :
   ```bash
   cd task-manager-frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez l'application :
   ```bash
   npm run dev
   ```


## Utilisation
1. Inscrivez-vous ou connectez-vous à l'application
2. Consultez la liste des tâches existantes
3. Créez une nouvelle tâche en cliquant sur "Ajouter une tâche"
4. Remplissez le formulaire avec le titre, l'image (optionnelle), la description et la date d'échéance
5. Modifiez ou supprimez vos propres tâches via les boutons d'action
6. Marquez vos tâches comme terminées en cochant la case correspondante


## Bonnes pratiques implémentées
- Architecture MVC côté backend
- Composants React réutilisables
- Validation des données côté client et serveur
- Gestion des erreurs et feedback utilisateur
- Code commenté et organisé
- Commits Git réguliers et descriptifs
- Documentation complète

## Questions Supplémentaires

### I. Difficultés rencontrées
Durant le développement de cette application, j'ai rencontré plusieurs défis :

2. **Gestion du téléchargement d'images** : L'implémentation du téléchargement et du stockage des images pour les tâches a demandé une attention particulière, notamment pour la validation des types de fichiers et la gestion des erreurs.

3. **Synchronisation des états React** : Maintenir une cohérence entre l'état local et les données du serveur, particulièrement lors des opérations de modification et de suppression

### II. Gestion du temps
J'ai organisé mon temps de développement selon les étapes suivantes :

1. **Planification (1h)** : Définition de l'architecture, des modèles de données et des endpoints API.
2. **Backend (3h)** : Développement de l'API Laravel, des migrations et de l'authentification.
3. **Frontend (4h)** : Création des composants React, des formulaires et de l'interface utilisateur.
4. **Tests et débogage (1h)** : Vérification des fonctionnalités et correction des bugs.


### III. Améliorations potentielles
Plusieurs améliorations pourraient être apportées à l'application :

1. **Fonctionnalités supplémentaires** :
   - Système de catégorisation des tâches
   - Notifications pour les tâches à échéance proche
   - Partage de tâches entre utilisateurs

2. **Améliorations techniques** :
   - Mise en place de tests automatisés plus complets
   - Implémentation d'un système de cache pour améliorer les performances
   - Utilisation de WebSockets pour les mises à jour en temps réel

### IV. Sécurité web

1. **Authentification et autorisation** :
   - Utilisation de Laravel Sanctum pour l'authentification par token
   - Vérification des permissions pour chaque action (un utilisateur ne peut modifier que ses propres tâches)
   - Stockage sécurisé des mots de passe avec hachage
   - Authentification par token et Authentification OAuth
   

2. **Validation des données** :
   - Validation stricte des entrées utilisateur côté serveur et client
   - Échappement des données pour prévenir les attaques XSS
   - Paramétrage des requêtes SQL pour éviter les injections

3. **Bonnes pratiques** :
   - Utilisation de HTTPS pour toutes les communications
   - Headers de sécurité appropriés (Content-Security-Policy, X-XSS-Protection)
   - Limitation du nombre de requêtes pour prévenir les attaques par force brute

### V. Gestion des performances

1. **Optimisations backend** :
   - Pagination des résultats pour limiter la taille des réponses
   - Utilisation du cache pour les réponses fréquentes
   - Optimisation des requêtes SQL
   - Limitation du nombre de requêtes et Priorité des requêtes
   - Compression des données
   - Architecture scalable et modulaire (microservices, MVC)

2. **Optimisations frontend** :
   - Chargement différé (lazy loading) des images
   - Mise en cache des données côté client
   - Optimisation des rendus React avec la mémorisation (useMemo, useCallback)
   - Optimisation du css avec TailwindCSS
   - Optimisation du SEO 
   
3. **Stratégies générales** :
   - Minimisation des requêtes HTTP
   - Compression des assets (images, CSS, JavaScript)


## Auteur
RudelAv
