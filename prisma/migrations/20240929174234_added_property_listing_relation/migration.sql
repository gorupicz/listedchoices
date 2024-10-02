/*
  Warnings:

  - You are about to drop the column `googleMaps` on the `Property` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,4)`.
  - You are about to drop the column `userId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Review` table. All the data in the column will be lost.
  - You are about to alter the column `price_per_share` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,4)`.
  - Added the required column `google_maps` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listing_id` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Reservation` DROP FOREIGN KEY `Reservation_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_userId_fkey`;

-- AlterTable
ALTER TABLE `Property` DROP COLUMN `googleMaps`,
    ADD COLUMN `google_maps` VARCHAR(191) NOT NULL,
    MODIFY `price` DECIMAL(10, 4) NOT NULL;

-- AlterTable
ALTER TABLE `Reservation` DROP COLUMN `userId`,
    ADD COLUMN `listing_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `userId`,
    ADD COLUMN `user_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `Transactions` MODIFY `price_per_share` DECIMAL(10, 4) NOT NULL;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `Listing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
