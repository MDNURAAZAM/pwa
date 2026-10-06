/*
  Warnings:

  - You are about to drop the column `brand` on the `Phone` table. All the data in the column will be lost.
  - Added the required column `brandId` to the `Phone` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Phone_brand_idx";

-- DropIndex
DROP INDEX "Phone_brand_name_idx";

-- AlterTable
ALTER TABLE "Phone" DROP COLUMN "brand",
ADD COLUMN     "brandId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE INDEX "Brand_name_idx" ON "Brand"("name");

-- CreateIndex
CREATE INDEX "Brand_isActive_idx" ON "Brand"("isActive");

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
