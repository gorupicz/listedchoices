/*
  Warnings:

  - The values [AED,ARS,AUD,BDT,BGN,BRL,CAD,CHF,CNY,COP,CZK,DKK,EUR,GBP,HKD,HRK,HUF,IDR,ILS,INR,JPY,KRW,KWD,LKR,MAD,MYR,NOK,NPR,NZD,PHP,PKR,PLN,QAR,RON,RUB,SAR,SEK,SGD,THB,TRY,TWD,UAH,VND,ZAR] on the enum `Transactions_currency` will be removed. If these variants are still used in the database, this will fail.
  - The values [AED,ARS,AUD,BDT,BGN,BRL,CAD,CHF,CNY,COP,CZK,DKK,EUR,GBP,HKD,HRK,HUF,IDR,ILS,INR,JPY,KRW,KWD,LKR,MAD,MYR,NOK,NPR,NZD,PHP,PKR,PLN,QAR,RON,RUB,SAR,SEK,SGD,THB,TRY,TWD,UAH,VND,ZAR] on the enum `Transactions_currency` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `social_token` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `MonthlyIncome` MODIFY `currency` ENUM('USD', 'MXN') NOT NULL;

-- AlterTable
ALTER TABLE `Reservation` MODIFY `currency` ENUM('USD', 'MXN') NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `social_token`,
    ADD COLUMN `oauth_token` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `MonthlyExpenses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `currency` ENUM('USD', 'MXN') NOT NULL,
    `property_id` INTEGER NOT NULL,

    UNIQUE INDEX `MonthlyExpenses_year_month_property_id_currency_key`(`year`, `month`, `property_id`, `currency`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `buyer_id` INTEGER NOT NULL,
    `seller_id` INTEGER NOT NULL,
    `shares_traded` INTEGER NOT NULL,
    `price_per_share` DECIMAL(65, 30) NOT NULL,
    `currency` ENUM('USD', 'MXN') NOT NULL,
    `transaction_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SharePriceHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `price` DECIMAL(10, 2) NOT NULL,
    `reason` ENUM('PROPERTY_VALUE_UPDATE', 'MARKET_DEMAND', 'DIVIDEND_PAYMENT') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MonthlyExpenses` ADD CONSTRAINT `MonthlyExpenses_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `Property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `Property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_seller_id_fkey` FOREIGN KEY (`seller_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharePriceHistory` ADD CONSTRAINT `SharePriceHistory_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `Property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
