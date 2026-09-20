-- CreateEnum
CREATE TYPE "Role" AS ENUM ('JOUEUR', 'RECRUTEUR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('GARDIEN', 'DEFENSEUR', 'MILIEU', 'ATTAQUANT');

-- CreateEnum
CREATE TYPE "Foot" AS ENUM ('DROITIER', 'GAUCHER', 'AMBIDEXTRE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'JOUEUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "city" TEXT NOT NULL,
    "phone" TEXT,
    "position" "Position" NOT NULL,
    "strongFoot" "Foot",
    "height" INTEGER,
    "weight" INTEGER,
    "currentClub" TEXT,
    "bio" TEXT,
    "palmares" TEXT,
    "photoUrl" TEXT,
    "videoUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerProfile_userId_key" ON "PlayerProfile"("userId");

-- AddForeignKey
ALTER TABLE "PlayerProfile" ADD CONSTRAINT "PlayerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
