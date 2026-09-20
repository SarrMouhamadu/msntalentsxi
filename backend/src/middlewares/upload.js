// backend/src/middlewares/upload.js
// Middleware Multer pour gérer l'upload des photos et vidéos en local

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dossier de destination pour les fichiers uploadés
const uploadDir = path.join(__dirname, '../../uploads');

// Créer le dossier s'il n'existe pas encore
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage sur disque
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Nettoyer le nom du fichier et ajouter un timestamp pour garantir l'unicité
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname).toLowerCase();
    const cleanBaseName = path.basename(file.originalname, extension).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// Filtre pour n'accepter que les images et les vidéos
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov', '.webm', '.mkv'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Format de fichier non supporté (${ext}). Formats autorisés : jpg, png, webp, mp4, mov, webm`), false);
  }
};

// Limites : 100 Mo max pour gérer les vidéos sans souci
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 Mo max
  },
});

module.exports = upload;
