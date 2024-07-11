# Sky Explorer

Bienvenue dans le projet Sky Explorer ! Cette application utilise Vue.js pour le frontend et un serveur Node.js/Express pour le backend. Elle permet de gérer des événements d'une école d'aviation, avec des fonctionnalités d'authentification, de gestion des utilisateurs, des avions et des événements.

## Prérequis

- Node.js et npm installés sur votre machine.
- Une instance de MongoDB en cours d'exécution.

## Installation

### Backend

1. **Naviguez vers le dossier backend** :
   ```bash
   cd backend
   ```
2. **Installez les dépendances** :
   ```bash
   npm install
   ```
3. **Configurez les variables d'environnement** en créant un fichier `.env` basé sur le modèle suivant :
   ```env
   JWT_SECRET=my_super_secret_key
   MONGO_URI=mongodb://localhost:27017/skyexplorer
   PORT=5000
   ```
4. **Initialisez la base de données** avec des données de départ :
   ```bash
   node populateDatabase.js
   ```
5. **Démarrez le serveur** :
   ```bash
   npm start
   ```

### Frontend

1. **Naviguez vers le dossier frontend** :
   ```bash
   cd frontend
   ```
2. **Installez les dépendances** :
   ```bash
   npm install
   ```
3. **Démarrez le serveur de développement** :
   ```bash
   npm run serve
   ```

### Prettier

Nous utilisons Prettier pour formater le code. Pour lancer Prettier, utilisez la commande suivante :
```bash
npm run format
```

## Scripts npm

### Backend

- `npm start` : Démarre le serveur Express.
- `npm run dev` : Démarre le serveur en mode développement avec nodemon.
- `node populateDatabase.js` : Initialise la base de données.

### Frontend

- `npm run serve` : Démarre le serveur de développement Vue.js.
- `npm run build` : Compile l'application pour la production.
- `npm run lint` : Analyse et fixe les fichiers source.
- `npm run format` : Formate le code avec Prettier.

