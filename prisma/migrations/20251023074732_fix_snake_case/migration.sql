/*
  Warnings:

  - You are about to drop the column `numeroDocumento` on the `Inscripcion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numero_documento]` on the table `Inscripcion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numero_documento` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Inscripcion_numeroDocumento_key";

-- AlterTable
ALTER TABLE "Inscripcion" DROP COLUMN "numeroDocumento",
ADD COLUMN     "numero_documento" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_numero_documento_key" ON "Inscripcion"("numero_documento");
