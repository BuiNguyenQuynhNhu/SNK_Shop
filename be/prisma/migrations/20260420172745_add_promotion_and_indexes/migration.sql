/*
  Warnings:

  - Added the required column `finalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Sneaker` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('PERCENT', 'FIXED_AMOUNT');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "finalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "promotionId" INTEGER;

-- AlterTable
ALTER TABLE "Sneaker" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "PromotionType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "minOrderValue" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_code_key" ON "Promotion"("code");

-- CreateIndex
CREATE INDEX "Promotion_isActive_idx" ON "Promotion"("isActive");

-- CreateIndex
CREATE INDEX "Promotion_startDate_endDate_idx" ON "Promotion"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_customerId_createdAt_idx" ON "Order"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Sneaker_categoryId_idx" ON "Sneaker"("categoryId");

-- CreateIndex
CREATE INDEX "Sneaker_brandId_categoryId_idx" ON "Sneaker"("brandId", "categoryId");

-- CreateIndex
CREATE INDEX "Sneaker_deletedAt_idx" ON "Sneaker"("deletedAt");

-- CreateIndex
CREATE INDEX "Sneaker_createdAt_idx" ON "Sneaker"("createdAt");

-- CreateIndex
CREATE INDEX "Variant_price_idx" ON "Variant"("price");

-- CreateIndex
CREATE INDEX "Variant_stock_idx" ON "Variant"("stock");

-- CreateIndex
CREATE INDEX "Variant_sneakerId_price_idx" ON "Variant"("sneakerId", "price");

-- CreateIndex
CREATE INDEX "Variant_sneakerId_stock_idx" ON "Variant"("sneakerId", "stock");

-- AddForeignKey
ALTER TABLE "Sneaker" ADD CONSTRAINT "Sneaker_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
