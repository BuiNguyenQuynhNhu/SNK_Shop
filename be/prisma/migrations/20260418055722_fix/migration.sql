/*
  Warnings:

  - You are about to drop the column `sneakerId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `sneakerId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `changedAt` on the `SalaryHistory` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SneakerImage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[url]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Made the column `variantId` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Variant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_sneakerId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_sneakerId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_sneakerId_fkey";

-- DropForeignKey
ALTER TABLE "SneakerImage" DROP CONSTRAINT "SneakerImage_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "SneakerImage" DROP CONSTRAINT "SneakerImage_sneakerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_addressId_fkey";

-- DropIndex
DROP INDEX "Address_customerId_key";

-- DropIndex
DROP INDEX "Media_link_key";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "sneakerId";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "position",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STAFF';

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "link",
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "sneakerId",
ALTER COLUMN "variantId" SET NOT NULL;

-- AlterTable
ALTER TABLE "SalaryHistory" DROP COLUMN "changedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sneaker" ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "updatedById" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "addressId";

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Price";

-- DropTable
DROP TABLE "SneakerImage";

-- CreateIndex
CREATE UNIQUE INDEX "Media_url_key" ON "Media"("url");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "Variant_sneakerId_idx" ON "Variant"("sneakerId");

-- AddForeignKey
ALTER TABLE "Sneaker" ADD CONSTRAINT "Sneaker_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sneaker" ADD CONSTRAINT "Sneaker_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
