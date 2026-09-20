// backend/src/middlewares/auth.js
// Middleware pour vérifier la validité du token JWT

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Récupérer le header "Authorization: Bearer <TOKEN>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé : Aucun jeton (token) d\'authentification fourni',
    });
  }

  const secret = process.env.JWT_SECRET || 'super_secret_cle_jwt_msn_talents_xi_2024';

  jwt.verify(token, secret, (err, userPayload) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé : Jeton invalide ou expiré',
      });
    }

    // On attache les informations de l'utilisateur à la requête
    req.user = userPayload; // contient { id, email, role }
    next();
  });
}

module.exports = {
  authenticateToken,
};
