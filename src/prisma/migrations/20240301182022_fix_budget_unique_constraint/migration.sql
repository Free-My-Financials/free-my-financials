/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Budget_name_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Budget_name_userId_key" ON "Budget"("name", "userId");
