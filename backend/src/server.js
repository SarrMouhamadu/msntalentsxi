// backend/src/server.js
// Point d'entrée principal de l'API MSN Talents XI

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectRedis } = require('./config/redis');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const playerRoutes = require('./routes/playerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
app.use(cors({ origin: true, credentials: true })); // Autorise toutes les requêtes du frontend Angular
app.use(express.json()); // Permet de parser le corps des requêtes en format JSON

app.use(express.urlencoded({ extended: true }));

// Rendre le dossier des uploads public pour afficher les photos et lire les vidéos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Enregistrement des routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);

// Route de bienvenue / test de bonne santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API MSN Talents XI opérationnelle 🚀',
    timestamp: new Date().toISOString(),
  });
});

// Démarrage de l'application
async function startServer() {
  // Connexion au cache Redis (si disponible)
  await connectRedis();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Serveur MSN Talents XI démarré avec succès !`);
    console.log(`📍 URL de l'API : http://localhost:${PORT}`);
    console.log(`📁 Fichiers médias (uploads) : http://localhost:${PORT}/uploads`);
    console.log(`🩺 Vérification santé : http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

startServer();
