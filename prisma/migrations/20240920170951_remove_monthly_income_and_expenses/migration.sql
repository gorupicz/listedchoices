/*
  Warnings:

  - You are about to drop the `MonthlyExpenses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MonthlyIncome` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `MonthlyExpenses` DROP FOREIGN KEY `MonthlyExpenses_property_id_fkey`;

-- DropForeignKey
ALTER TABLE `MonthlyIncome` DROP FOREIGN KEY `MonthlyIncome_property_id_fkey`;

-- DropTable
DROP TABLE `MonthlyExpenses`;

-- DropTable
DROP TABLE `MonthlyIncome`;
