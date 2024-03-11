/*
  Warnings:

  - You are about to drop the column `userId` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,id]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,budgetId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropIndex
DROP INDEX "Budget_userId_key";

-- DropIndex
DROP INDEX "Category_name_userId_key";

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "userId",
ADD COLUMN     "budgetId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "budgetId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Budget_name_id_key" ON "Budget"("name", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_budgetId_key" ON "Category"("name", "budgetId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
