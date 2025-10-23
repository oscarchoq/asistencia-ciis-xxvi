/*
  Warnings:

  - You are about to drop the column `id_metodo_pago` on the `Inscripcion` table. All the data in the column will be lost.
  - You are about to drop the column `id_persona` on the `Inscripcion` table. All the data in the column will be lost.
  - You are about to drop the column `id_plan` on the `Inscripcion` table. All the data in the column will be lost.
  - You are about to drop the `MetodoPago` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Persona` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[numeroDocumento]` on the table `Inscripcion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apellidos` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `celular` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correo` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metodo_pago` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombres` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroDocumento` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('yape', 'bcp', 'efectivo', 'otros');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('profesionales', 'estudiantes', 'delegaciones', 'docenteesis', 'estudianteesis');

-- CreateEnum
CREATE TYPE "InscriptionType" AS ENUM ('virtual', 'presencial');

-- DropForeignKey
ALTER TABLE "public"."Inscripcion" DROP CONSTRAINT "Inscripcion_id_metodo_pago_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inscripcion" DROP CONSTRAINT "Inscripcion_id_persona_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inscripcion" DROP CONSTRAINT "Inscripcion_id_plan_fkey";

-- DropIndex
DROP INDEX "public"."Inscripcion_id_persona_id_plan_key";

-- AlterTable
ALTER TABLE "Inscripcion" DROP COLUMN "id_metodo_pago",
DROP COLUMN "id_persona",
DROP COLUMN "id_plan",
ADD COLUMN     "apellidos" TEXT NOT NULL,
ADD COLUMN     "celular" TEXT NOT NULL,
ADD COLUMN     "correo" TEXT NOT NULL,
ADD COLUMN     "correo_formulario" TEXT,
ADD COLUMN     "email_enviado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metodo_pago" "PaymentMethod" NOT NULL,
ADD COLUMN     "nombres" TEXT NOT NULL,
ADD COLUMN     "numeroDocumento" TEXT NOT NULL,
ADD COLUMN     "pais" TEXT,
ADD COLUMN     "plan" "PlanType" NOT NULL,
ADD COLUMN     "tipo_inscripcion" "InscriptionType" NOT NULL DEFAULT 'virtual',
ADD COLUMN     "universidad" TEXT;

-- DropTable
DROP TABLE "public"."MetodoPago";

-- DropTable
DROP TABLE "public"."Persona";

-- DropTable
DROP TABLE "public"."Plan";

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_numeroDocumento_key" ON "Inscripcion"("numeroDocumento");
