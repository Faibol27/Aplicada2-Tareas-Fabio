-- AlterTable
ALTER TABLE "Inventario" ALTER COLUMN "stockMinimo" SET DEFAULT 5;

-- CreateTable
CREATE TABLE "Turnos" (
    "id" SERIAL NOT NULL,
    "cliente" TEXT NOT NULL,
    "servicio" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'esperando',

    CONSTRAINT "Turnos_pkey" PRIMARY KEY ("id")
);
