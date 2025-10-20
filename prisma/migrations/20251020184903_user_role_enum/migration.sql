/*
  Warnings:

  - You are about to drop the column `id_persona` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[correo]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `correo` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_id_persona_fkey";

-- DropIndex
DROP INDEX "public"."Usuario_username_key";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "id_persona",
DROP COLUMN "username",
ADD COLUMN     "correo" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");
