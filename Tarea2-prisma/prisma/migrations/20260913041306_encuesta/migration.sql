-- CreateTable
CREATE TABLE "Encuestas" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,

    CONSTRAINT "Encuestas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opcion" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "votos" INTEGER NOT NULL DEFAULT 0,
    "encuestaId" INTEGER NOT NULL,

    CONSTRAINT "Opcion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Opcion" ADD CONSTRAINT "Opcion_encuestaId_fkey" FOREIGN KEY ("encuestaId") REFERENCES "Encuestas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
