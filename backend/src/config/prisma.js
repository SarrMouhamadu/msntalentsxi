// backend/src/config/prisma.js
// Configuration du client Prisma pour accéder à PostgreSQL

const { PrismaClient } = require('@prisma/client');

// On instancie un client Prisma unique pour toute l'application
const prisma = new PrismaClient({
  log: ['error', 'warn'], // Affiche les erreurs SQL importantes
});

module.exports = prisma;
