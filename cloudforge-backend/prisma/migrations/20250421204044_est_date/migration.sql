-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "estimatedDelivery" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
