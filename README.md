# ⚽ MSN Talents XI - La Vitrine Numérique des Talents Sportifs Sénégalais

Bienvenue sur le projet **MSN Talents XI**, une plateforme conçue pour la détection, la valorisation et la visibilité des jeunes talents sportifs sénégalais (en commençant par le football).

Ce projet a été développé selon un principe fondamental : **un code très simple, lisible, sans sur-ingénierie, avec des technologies stables et pérennes.**

---

## 🛠️ Stack Technique

- **Frontend** : [Angular](https://angular.dev/) (Composants autonomes, routing clair, formulaires simples, CSS soigné sans dépendances lourdes).
- **Backend** : [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) (Architecture classique : `routes/`, `controllers/`, `middlewares/`).
- **Base de données & ORM** : [PostgreSQL](https://www.postgresql.org/) avec [Prisma](https://www.prisma.io/) (Modèles clairs et interface graphique **Prisma Studio**).
- **Cache Haute Performance** : [Redis](https://redis.io/) (Mise en cache ultra-rapide des profils de joueurs avec bascule transparente si Redis est éteint).
- **Gestion des Médias** : [Multer](https://github.com/expressjs/multer) (Upload local de photos et vidéos dans le dossier `backend/uploads/`).
- **Conteneurs** : Docker Compose (Démarrage de PostgreSQL et Redis en 1 commande).

---

## 📁 Structure du Projet

```text
msntalentsxi/
├── docker-compose.yml          # Démarre PostgreSQL (5432) et Redis (6379)
│
├── backend/                    # API REST Node.js & Express
│   ├── prisma/
│   │   ├── schema.prisma       # Schéma de la base de données (User, PlayerProfile)
│   │   └── seed.js             # Données de test (joueurs de Dakar, Thiès, Ziguinchor...)
│   ├── uploads/                # Fichiers photos et vidéos uploadés
│   ├── src/
│   │   ├── config/             # Connexions Prisma et Redis
│   │   ├── controllers/        # Logique métier (authController, playerController)
│   │   ├── middlewares/        # Sécurité JWT (auth.js) et Upload (upload.js)
│   │   ├── routes/             # Définition des URL (/api/auth, /api/players)
│   │   └── server.js           # Point d'entrée de l'API
│   └── package.json
│
└── frontend/                   # Application Web Angular
    ├── src/
    │   ├── app/
    │   │   ├── components/     # Navbar, etc.
    │   │   ├── pages/          # Home, PlayersList, PlayerDetail, Login, Register, ProfileEdit
    │   │   ├── services/       # AuthService, PlayerService
    │   │   ├── app.routes.ts   # Configuration des routes (/players, /login, etc.)
    │   │   └── app.ts / app.html
    │   └── styles.css          # Thème vert & or du Sénégal, responsive
    └── package.json
```

---

## 🚀 Guide de Démarrage Rapide (Pas à Pas)

### 1. Démarrer la base de données et le cache (Docker)
À la racine du projet `msntalentsxi/`, lancez :
```bash
docker compose up -d
```
Cela démarre :
- PostgreSQL sur le port `5432`
- Redis sur le port `6379`

---

### 2. Démarrer le Backend (API Express)
Dans un premier terminal :
```bash
cd backend
npm install
npm run dev
```
> Le serveur backend démarrera sur : **`http://localhost:4000`**  
> Fichiers médias accessibles sur : `http://localhost:4000/uploads`  
> Test de bonne santé : `http://localhost:4000/api/health`

#### Initialiser la base de données et les joueurs de test :
```bash
cd backend
npx prisma migrate dev --name init
npm run seed
```

#### Ouvrir l'interface graphique Prisma Studio :
Prisma Studio vous permet de voir et modifier vos données en quelques clics dans votre navigateur :
```bash
cd backend
npm run prisma:studio
```
> Ouvrez votre navigateur sur **`http://localhost:5555`** pour explorer les tables `User` et `PlayerProfile`.

---

### 3. Démarrer le Frontend (Angular)
Dans un deuxième terminal :
```bash
cd frontend
npm install
npm start
```
> Ouvrez votre navigateur sur : **`http://localhost:4200`**

---

## 🌟 Fonctionnalités Incluses

1. **Page d'Accueil** :
   - Présentation de la vision et des piliers de MSN Talents XI.
   - Section des talents à la une (avec cache Redis).
2. **Annuaire des Talents & Recherche** :
   - Recherche en direct par nom, prénom ou club.
   - Filtres par poste : Attaquants, Milieux, Défenseurs, Gardiens.
   - Filtre par ville / région (Dakar, Thiès, Ziguinchor, Saint-Louis, Kaolack, etc.).
   - Indicateur visuel montrant si la requête provient du **Cache Redis** ou de **PostgreSQL**.
3. **Fiche Détail du Joueur** :
   - Photo haute résolution et badges de poste.
   - Caractéristiques physiques (Taille, Poids, Pied fort, Âge).
   - Biographie sportive et palmarès / distinctions.
   - Lecteur vidéo intégré pour les vidéos locales ou liens YouTube.
   - Bouton direct **WhatsApp** pour contacter le joueur ou son club.
4. **Espace Compte & Édition** :
   - Inscription / Connexion avec JWT.
   - Formulaire complet de profil sportif.
   - Upload de photo et vidéo en local (`backend/uploads/`).
