/*
  Warnings:

  - You are about to drop the `InvoiceItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShipmentItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_materialId_fkey";

-- DropForeignKey
ALTER TABLE "ShipmentItem" DROP CONSTRAINT "ShipmentItem_materialId_fkey";

-- DropForeignKey
ALTER TABLE "ShipmentItem" DROP CONSTRAINT "ShipmentItem_shipmentId_fkey";

-- DropTable
DROP TABLE "InvoiceItem";

-- DropTable
DROP TABLE "ShipmentItem";
