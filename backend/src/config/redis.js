// backend/src/config/redis.js
// Configuration du client Redis pour le cache

const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => {
  console.warn('⚠️ [Redis] Erreur de connexion au serveur Redis :', err.message);
});

redisClient.on('connect', () => {
  console.log('✅ [Redis] Connecté avec succès à Redis');
});

// Fonction d'initialisation de la connexion Redis
async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.warn('⚠️ [Redis] Impossible de se connecter à Redis, le cache sera ignoré :', error.message);
  }
}

module.exports = {
  redisClient,
  connectRedis,
};
