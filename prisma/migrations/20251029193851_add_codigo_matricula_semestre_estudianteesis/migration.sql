-- CreateEnum
CREATE TYPE "Semestre" AS ENUM ('segundo', 'cuarto', 'sexto', 'octavo', 'decimo');

-- AlterTable
ALTER TABLE "Asistencia" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Evento" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Inscripcion" ADD COLUMN     "codigo_matricula" TEXT,
ADD COLUMN     "semestre" "Semestre",
ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Kit" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "createdAt" SET DEFAULT now();
