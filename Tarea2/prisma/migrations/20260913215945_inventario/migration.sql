-- CreateTable
CREATE TABLE "Inventario" (
    "id" SERIAL NOT NULL,
    "producto" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "stockMinimo" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id")
);
