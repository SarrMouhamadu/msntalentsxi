// backend/src/controllers/authController.js
// Gestion simple de l'inscription, la connexion et l'identité de l'utilisateur

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cle_jwt_msn_talents_xi_2024';

// Inscription d'un nouvel utilisateur
async function register(req, res) {
  try {
    const { email, password, role } = req.body;

    // Validation simple des champs obligatoires
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'L\'email et le mot de passe sont obligatoires.',
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec cette adresse email existe déjà.',
      });
    }

    // Hachage sécurisé du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Détermination du rôle (par défaut JOUEUR)
    const validRoles = ['JOUEUR', 'RECRUTEUR', 'ADMIN'];
    const userRole = validRoles.includes(role) ? role : 'JOUEUR';

    // Création de l'utilisateur en base de données
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        role: userRole,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Génération du jeton JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' } // Valide 7 jours
    );

    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès !',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur lors de l\'inscription.',
    });
  }
}

// Connexion d'un utilisateur existant
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner votre email et mot de passe.',
      });
    }

    // Recherche de l'utilisateur avec son profil associé
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    // Vérification de la validité du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie !',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur lors de la connexion.',
    });
  }
}

// Récupérer le profil de l'utilisateur actuellement connecté
async function getMe(req, res) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Erreur getMe :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne lors de la récupération du profil.',
    });
  }
}

module.exports = {
  register,
  login,
  getMe,
};
