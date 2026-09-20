// backend/src/routes/playerRoutes.js
// Routes pour la consultation et la gestion des profils de joueurs

const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { authenticateToken } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// GET /api/players : Lister tous les joueurs (avec filtres optionnels position, city, search)
router.get('/', playerController.getAllPlayers);

// GET /api/players/featured : Lister les joueurs mis en avant
router.get('/featured', playerController.getFeaturedPlayers);

// GET /api/players/:id : Obtenir le détail d'un joueur par son ID
router.get('/:id', playerController.getPlayerById);

// POST /api/players/my-profile : Créer ou mettre à jour le profil du joueur connecté (avec photos et vidéos)
router.post(
  '/my-profile',
  authenticateToken,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  playerController.saveMyProfile
);

module.exports = router;
