/*
  Warnings:

  - The `position` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `basePrice` on the `Sneaker` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Variant` table. All the data in the column will be lost.
  - Added the required column `color` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "position",
ADD COLUMN     "position" "Role" NOT NULL DEFAULT 'STAFF';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sneaker" DROP COLUMN "basePrice",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "image",
ADD COLUMN     "imageId" INTEGER;

-- CreateIndex
CREATE INDEX "Sneaker_brandId_idx" ON "Sneaker"("brandId");

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
