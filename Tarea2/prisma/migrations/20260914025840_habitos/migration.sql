-- CreateTable
CREATE TABLE "Habito" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "meta" TEXT NOT NULL,

    CONSTRAINT "Habito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registro" (
    "id" SERIAL NOT NULL,
    "fecha" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT true,
    "habitoId" INTEGER NOT NULL,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_habitoId_fkey" FOREIGN KEY ("habitoId") REFERENCES "Habito"("id") ON DELETE CASCADE ON UPDATE CASCADE;
