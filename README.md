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

## Auteur
RudelAv
