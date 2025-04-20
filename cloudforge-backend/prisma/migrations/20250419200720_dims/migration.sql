/*
  Warnings:

  - Added the required column `lengthUnits` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceUnits` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thicknessUnits` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `widthUnits` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "lengthUnits" TEXT NOT NULL,
ADD COLUMN     "priceUnits" TEXT NOT NULL,
ADD COLUMN     "thicknessUnits" TEXT NOT NULL,
ADD COLUMN     "widthUnits" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);
