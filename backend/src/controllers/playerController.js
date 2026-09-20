// backend/src/controllers/playerController.js
// Gestion des profils de joueurs (recherche, consultation, création, mise à jour, cache Redis)

const prisma = require('../config/prisma');
const { redisClient } = require('../config/redis');

// Durée de validité du cache Redis en secondes (ex: 5 minutes)
const CACHE_TTL_SECONDS = 300;

// 1. Lister tous les joueurs avec filtres (recherche, poste, ville)
async function getAllPlayers(req, res) {
  try {
    const { position, city, search } = req.query;

    // Clé de cache Redis simple pour les requêtes standard sans filtres
    const cacheKey = `players:all:${position || 'all'}:${city || 'all'}:${search || 'all'}`;

    // Tentative de lecture depuis le cache Redis
    if (redisClient && redisClient.isOpen) {
      try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          return res.status(200).json({
            success: true,
            source: 'cache-redis',
            players: JSON.parse(cachedData),
          });
        }
      } catch (cacheErr) {
        console.warn('Erreur lecture cache Redis :', cacheErr.message);
      }
    }

    // Construction dynamique du filtre SQL Prisma
    const where = {};

    if (position) {
      where.position = position.toUpperCase();
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { currentClub: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Requête dans la base de données PostgreSQL
    const players = await prisma.playerProfile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    // Enregistrement dans le cache Redis pour les requêtes suivantes
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.setEx(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(players));
      } catch (cacheErr) {
        console.warn('Erreur écriture cache Redis :', cacheErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      source: 'database-postgres',
      players,
    });
  } catch (error) {
    console.error('Erreur getAllPlayers :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des joueurs.',
    });
  }
}

// 2. Récupérer les joueurs mis en avant (Featured / À la une)
async function getFeaturedPlayers(req, res) {
  try {
    const cacheKey = 'players:featured';

    if (redisClient && redisClient.isOpen) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return res.status(200).json({
            success: true,
            source: 'cache-redis',
            players: JSON.parse(cached),
          });
        }
      } catch (err) {
        console.warn('Redis get error :', err.message);
      }
    }

    const featuredPlayers = await prisma.playerProfile.findMany({
      where: { isFeatured: true },
      take: 6, // Les 6 premiers profils en vedette
      orderBy: { updatedAt: 'desc' },
    });

    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.setEx(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(featuredPlayers));
      } catch (err) {
        console.warn('Redis set error :', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      source: 'database-postgres',
      players: featuredPlayers,
    });
  } catch (error) {
    console.error('Erreur getFeaturedPlayers :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des joueurs en vedette.',
    });
  }
}

// 3. Récupérer un profil joueur par son ID
async function getPlayerById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant de joueur invalide.',
      });
    }

    const player = await prisma.playerProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: { email: true, createdAt: true },
        },
      },
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Profil joueur introuvable.',
      });
    }

    return res.status(200).json({
      success: true,
      player,
    });
  } catch (error) {
    console.error('Erreur getPlayerById :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil joueur.',
    });
  }
}

// 4. Créer ou mettre à jour le profil du joueur connecté
async function saveMyProfile(req, res) {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      birthDate,
      city,
      phone,
      position,
      strongFoot,
      height,
      weight,
      currentClub,
      bio,
      palmares,
      videoUrlLink, // Si l'utilisateur met un lien externe YouTube
    } = req.body;

    if (!firstName || !lastName || !city || !position) {
      return res.status(400).json({
        success: false,
        message: 'Le prénom, le nom, la ville et le poste sont obligatoires.',
      });
    }

    // Gestion des fichiers uploadés par Multer (photos et vidéos)
    let photoPath = undefined;
    let videoPath = undefined;

    if (req.files) {
      if (req.files.photo && req.files.photo.length > 0) {
        photoPath = `/uploads/${req.files.photo[0].filename}`;
      }
      if (req.files.video && req.files.video.length > 0) {
        videoPath = `/uploads/${req.files.video[0].filename}`;
      }
    }

    // Si pas de fichier vidéo uploadé mais un lien YouTube fourni
    const finalVideoUrl = videoPath || videoUrlLink || undefined;

    // Préparation des données pour Prisma
    const dataToSave = {
      firstName,
      lastName,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      city,
      phone: phone || null,
      position: position.toUpperCase(),
      strongFoot: strongFoot ? strongFoot.toUpperCase() : null,
      height: height ? parseInt(height, 10) : null,
      weight: weight ? parseInt(weight, 10) : null,
      currentClub: currentClub || null,
      bio: bio || null,
      palmares: palmares || null,
    };

    if (photoPath) dataToSave.photoUrl = photoPath;
    if (finalVideoUrl) dataToSave.videoUrl = finalVideoUrl;

    // Upsert Prisma (Crée le profil s'il n'existe pas, sinon le met à jour)
    const profile = await prisma.playerProfile.upsert({
      where: { userId },
      update: dataToSave,
      create: {
        ...dataToSave,
        userId,
      },
    });

    // Invalider le cache Redis pour que les prochaines requêtes voient les nouvelles infos
    if (redisClient && redisClient.isOpen) {
      try {
        const keys = await redisClient.keys('players:*');
        if (keys.length > 0) {
          await redisClient.del(keys);
        }
      } catch (cacheErr) {
        console.warn('Erreur invalidation cache Redis :', cacheErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Profil enregistré avec succès !',
      profile,
    });
  } catch (error) {
    console.error('Erreur saveMyProfile :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement du profil.',
    });
  }
}

module.exports = {
  getAllPlayers,
  getFeaturedPlayers,
  getPlayerById,
  saveMyProfile,
};
