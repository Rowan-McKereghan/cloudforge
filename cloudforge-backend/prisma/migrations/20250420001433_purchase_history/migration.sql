/*
  Warnings:

  - You are about to drop the `Quote` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "onHand" SET DEFAULT 0,
ALTER COLUMN "onHand" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "allocated" SET DEFAULT 0,
ALTER COLUMN "allocated" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "Quote";

-- CreateTable
CREATE TABLE "PurchaseHistory" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "vendor" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PurchaseHistory" ADD CONSTRAINT "PurchaseHistory_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
