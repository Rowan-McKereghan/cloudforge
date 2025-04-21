/*
  Warnings:

  - The values [EXPIRED] on the enum `QuoteStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `customerId` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `SalesOrder` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customerName` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `SalesOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuoteStatus_new" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'REJECTED');
ALTER TABLE "Quote" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Quote" ALTER COLUMN "status" TYPE "QuoteStatus_new" USING ("status"::text::"QuoteStatus_new");
ALTER TYPE "QuoteStatus" RENAME TO "QuoteStatus_old";
ALTER TYPE "QuoteStatus_new" RENAME TO "QuoteStatus";
DROP TYPE "QuoteStatus_old";
ALTER TABLE "Quote" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_customerId_fkey";

-- DropForeignKey
ALTER TABLE "SalesOrder" DROP CONSTRAINT "SalesOrder_customerId_fkey";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "customerId",
DROP COLUMN "expiresAt",
ADD COLUMN     "customerName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SalesOrder" DROP COLUMN "customerId",
ADD COLUMN     "customerName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Customer";
