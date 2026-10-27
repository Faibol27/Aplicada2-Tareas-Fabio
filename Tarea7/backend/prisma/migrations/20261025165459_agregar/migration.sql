-- AlterTable
ALTER TABLE "Servicio" ADD COLUMN     "usuarioId" INTEGER;

-- CreateTable
CREATE TABLE "Reservas" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIME NOT NULL,
    "estado" TEXT NOT NULL,
    "servicioId" INTEGER,
    "usuarioId" INTEGER,

    CONSTRAINT "Reservas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
