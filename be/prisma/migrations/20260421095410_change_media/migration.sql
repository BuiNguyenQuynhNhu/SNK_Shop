/*
  Warnings:

  - You are about to drop the column `imageId` on the `Brand` table. All the data in the column will be lost.
  - You are about to alter the column `totalAmount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `shippingFee` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `discountAmount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `finalAmount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `total` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `value` on the `Promotion` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `minOrderValue` on the `Promotion` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `SalaryHistory` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `Variant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[name]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[logoId]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageId]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('BRAND', 'SNEAKER', 'VARIANT');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('MAIN', 'FRONT', 'BACK', 'SIDE', 'DETAIL', 'GALLERY');

-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_imageId_fkey";

-- DropIndex
DROP INDEX "Order_createdAt_idx";

-- DropIndex
DROP INDEX "Order_customerId_createdAt_idx";

-- DropIndex
DROP INDEX "Order_paymentStatus_idx";

-- DropIndex
DROP INDEX "Order_status_createdAt_idx";

-- DropIndex
DROP INDEX "Promotion_isActive_idx";

-- DropIndex
DROP INDEX "Promotion_startDate_endDate_idx";

-- DropIndex
DROP INDEX "Sneaker_brandId_categoryId_idx";

-- DropIndex
DROP INDEX "Sneaker_createdAt_idx";

-- DropIndex
DROP INDEX "Variant_price_idx";

-- DropIndex
DROP INDEX "Variant_sneakerId_idx";

-- DropIndex
DROP INDEX "Variant_sneakerId_price_idx";

-- DropIndex
DROP INDEX "Variant_sneakerId_stock_idx";

-- DropIndex
DROP INDEX "Variant_stock_idx";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "imageId";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "imageType" "ImageType",
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "type" "MediaType" NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "shippingFee" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "discountAmount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "finalAmount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Promotion" ALTER COLUMN "value" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "minOrderValue" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "SalaryHistory" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Variant" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "_BrandImages" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BrandImages_AB_unique" ON "_BrandImages"("A", "B");

-- CreateIndex
CREATE INDEX "_BrandImages_B_index" ON "_BrandImages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_logoId_key" ON "Brand"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_imageId_key" ON "Employee"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_imageId_key" ON "Variant"("imageId");

-- AddForeignKey
ALTER TABLE "_BrandImages" ADD CONSTRAINT "_BrandImages_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandImages" ADD CONSTRAINT "_BrandImages_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
