// backend/prisma/seed.js
// Script d'insertion de profils réels de joueurs professionnels sénégalais avec photos et vidéos de dribles

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mise à jour des profils avec les vraies vidéos de dribles...');

  const defaultPassword = await bcrypt.hash('passer123', 10);

  const playersData = [
    {
      email: 'sadio.mane@msntalents.sn',
      firstName: 'Sadio',
      lastName: 'Mané',
      birthDate: new Date('1992-04-10'),
      city: 'Sédhiou',
      phone: '+221 77 100 10 10',
      position: 'ATTAQUANT',
      strongFoot: 'DROITIER',
      height: 175,
      weight: 69,
      currentClub: 'Al-Nassr FC (ex-Liverpool / Génération Foot)',
      bio: 'Attaquant et ailier mondial, formé à Génération Foot. Célèbre pour ses accélérations, dribbles déroutants et son efficacité devant le but.',
      palmares: 'Vainqueur CAN 2021, Double Ballon d\'Or Africain (2019, 2022), Ligue des Champions UEFA, Premier League.',
      photoUrl: '/uploads/sadio_mane.jpg',
      videoUrl: '/uploads/dribble_mane.mp4',
      isFeatured: true,
    },
    {
      email: 'lamine.camara@msntalents.sn',
      firstName: 'Lamine',
      lastName: 'Camara',
      birthDate: new Date('2004-01-01'),
      city: 'Diouloulou',
      phone: '+221 70 300 30 30',
      position: 'MILIEU',
      strongFoot: 'DROITIER',
      height: 177,
      weight: 70,
      currentClub: 'AS Monaco (ex-FC Metz / Génération Foot)',
      bio: 'Milieu relayeur moderne. Technique soignée, vista, dribbles courts et précision chirurgicale sur coups francs.',
      palmares: 'Meilleur Joueur CHAN 2022, Champion d\'Afrique U20, Révélation CAN 2023, Jeune Joueur CAF de l\'Année.',
      photoUrl: '/uploads/lamine_camara.jpg',
      videoUrl: '/uploads/dribble_camara.mp4',
      isFeatured: true,
    },
    {
      email: 'nicolas.jackson@msntalents.sn',
      firstName: 'Nicolas',
      lastName: 'Jackson',
      birthDate: new Date('2001-06-20'),
      city: 'Ziguinchor',
      phone: '+221 77 500 50 50',
      position: 'ATTAQUANT',
      strongFoot: 'DROITIER',
      height: 187,
      weight: 78,
      currentClub: 'Chelsea FC (ex-Villarreal / Casa Sports)',
      bio: 'Attaquant explosif issu du Casa Sports. Dribbles en percussion, puissance physique et sens du démarquage.',
      palmares: 'Vainqueur Coupe du Sénégal avec le Casa Sports, Joueur du mois Premier League.',
      photoUrl: '/uploads/nicolas_jackson.jpg',
      videoUrl: '/uploads/dribble_jackson.mp4',
      isFeatured: true,
    },
    {
      email: 'kalidou.koulibaly@msntalents.sn',
      firstName: 'Kalidou',
      lastName: 'Koulibaly',
      birthDate: new Date('1991-06-20'),
      city: 'Dakar',
      phone: '+221 78 200 20 20',
      position: 'DEFENSEUR',
      strongFoot: 'DROITIER',
      height: 186,
      weight: 89,
      currentClub: 'Al-Hilal (ex-SSC Napoli / Chelsea FC)',
      bio: 'Capitaine des Lions. Puissance dans les duels, anticipation et relance propre.',
      palmares: 'Capitaine Champion d\'Afrique CAN 2021, Meilleur Défenseur Serie A, Champion Saudi Pro League.',
      photoUrl: '/uploads/kalidou_koulibaly.jpg',
      videoUrl: '/uploads/dribble_hero.mp4',
      isFeatured: true,
    },
    {
      email: 'pape.matar.sarr@msntalents.sn',
      firstName: 'Pape Matar',
      lastName: 'Sarr',
      birthDate: new Date('2002-09-14'),
      city: 'Thiès',
      phone: '+221 78 600 60 60',
      position: 'MILIEU',
      strongFoot: 'DROITIER',
      height: 184,
      weight: 70,
      currentClub: 'Tottenham Hotspur (ex-FC Metz / Génération Foot)',
      bio: 'Milieu box-to-box infatigable, grosse frappe de balle et sorties de balle sous pression.',
      palmares: 'Champion d\'Afrique CAN 2021, Jeune Joueur CAF (2022), Titulaire Premier League.',
      photoUrl: '/uploads/pape_matar_sarr.jpg',
      videoUrl: '/uploads/dribble_sarr.mp4',
      isFeatured: false,
    },
    {
      email: 'edouard.mendy@msntalents.sn',
      firstName: 'Édouard',
      lastName: 'Mendy',
      birthDate: new Date('1992-03-01'),
      city: 'Saint-Louis',
      phone: '+221 76 400 40 40',
      position: 'GARDIEN',
      strongFoot: 'DROITIER',
      height: 194,
      weight: 86,
      currentClub: 'Al-Ahli (ex-Chelsea FC / Stade Rennais)',
      bio: 'Gardien d\'envergure mondiale. Réflexes exceptionnels et sérénité sur sa ligne.',
      palmares: 'Champion d\'Afrique CAN 2021, Vainqueur Ligue des Champions UEFA, Meilleur Gardien FIFA The Best 2021.',
      photoUrl: '/uploads/edouard_mendy.jpg',
      videoUrl: '/uploads/dribble_skills.mp4',
      isFeatured: false,
    },
  ];

  for (const item of playersData) {
    const user = await prisma.user.upsert({
      where: { email: item.email },
      update: {},
      create: {
        email: item.email,
        password: defaultPassword,
        role: 'JOUEUR',
      },
    });

    await prisma.playerProfile.upsert({
      where: { userId: user.id },
      update: {
        firstName: item.firstName,
        lastName: item.lastName,
        birthDate: item.birthDate,
        city: item.city,
        phone: item.phone,
        position: item.position,
        strongFoot: item.strongFoot,
        height: item.height,
        weight: item.weight,
        currentClub: item.currentClub,
        bio: item.bio,
        palmares: item.palmares,
        photoUrl: item.photoUrl,
        videoUrl: item.videoUrl,
        isFeatured: item.isFeatured,
      },
      create: {
        userId: user.id,
        firstName: item.firstName,
        lastName: item.lastName,
        birthDate: item.birthDate,
        city: item.city,
        phone: item.phone,
        position: item.position,
        strongFoot: item.strongFoot,
        height: item.height,
        weight: item.weight,
        currentClub: item.currentClub,
        bio: item.bio,
        palmares: item.palmares,
        photoUrl: item.photoUrl,
        videoUrl: item.videoUrl,
        isFeatured: item.isFeatured,
      },
    });
  }

  console.log('✅ Base de données actualisée avec les vidéos de dribles !');
}

main()
  .catch((e) => {
    console.error('Erreur seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
