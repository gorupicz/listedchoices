/*
  Warnings:

  - Added the required column `googleMaps` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Property` ADD COLUMN `googleMaps` VARCHAR(191) NOT NULL;
