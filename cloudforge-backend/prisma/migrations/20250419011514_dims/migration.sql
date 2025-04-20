/*
  Warnings:

  - Added the required column `length` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thickness` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "length" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "thickness" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "width" DOUBLE PRECISION NOT NULL;
