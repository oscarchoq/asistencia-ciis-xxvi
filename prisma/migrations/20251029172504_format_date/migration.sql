-- AlterTable
ALTER TABLE "Asistencia" ALTER COLUMN "fecha_asistencia" SET DEFAULT CURRENT_DATE,
ALTER COLUMN "hora_asistencia" SET DEFAULT CURRENT_TIME,
ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Evento" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Inscripcion" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Kit" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "createdAt" SET DEFAULT now();
