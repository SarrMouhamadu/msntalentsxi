// backend/src/routes/authRoutes.js
// Routes pour l'authentification (Inscription, Connexion, Profil courant)

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

// POST /api/auth/register : Inscription
router.post('/register', authController.register);

// POST /api/auth/login : Connexion
router.post('/login', authController.login);

// GET /api/auth/me : Obtenir l'utilisateur connecté (nécessite un token JWT)
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
