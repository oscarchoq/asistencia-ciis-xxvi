/*
  Warnings:

  - You are about to drop the column `id_rol` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `Rol` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('administrador', 'organizador', 'asistencia');

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_id_rol_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "id_rol",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'organizador';

-- DropTable
DROP TABLE "public"."Rol";
