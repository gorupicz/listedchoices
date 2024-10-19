/*
  Warnings:

  - Added the required column `biography` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facebook` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instagram` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkedin` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photograph` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `biography` VARCHAR(191) NOT NULL,
    ADD COLUMN `facebook` VARCHAR(191) NOT NULL,
    ADD COLUMN `instagram` VARCHAR(191) NOT NULL,
    ADD COLUMN `linkedin` VARCHAR(191) NOT NULL,
    ADD COLUMN `photograph` VARCHAR(191) NOT NULL;
