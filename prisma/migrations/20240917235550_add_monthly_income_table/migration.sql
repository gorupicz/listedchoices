-- AlterTable
ALTER TABLE `Reservation` MODIFY `currency` ENUM('AED', 'ARS', 'AUD', 'BDT', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'COP', 'CZK', 'DKK', 'EUR', 'GBP', 'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'KWD', 'LKR', 'MAD', 'MXN', 'MYR', 'NOK', 'NPR', 'NZD', 'PHP', 'PKR', 'PLN', 'QAR', 'RON', 'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'UAH', 'USD', 'VND', 'ZAR') NOT NULL;

-- CreateTable
CREATE TABLE `MonthlyIncome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `currency` ENUM('AED', 'ARS', 'AUD', 'BDT', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'COP', 'CZK', 'DKK', 'EUR', 'GBP', 'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'KWD', 'LKR', 'MAD', 'MXN', 'MYR', 'NOK', 'NPR', 'NZD', 'PHP', 'PKR', 'PLN', 'QAR', 'RON', 'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'UAH', 'USD', 'VND', 'ZAR') NOT NULL,
    `property_id` INTEGER NOT NULL,

    UNIQUE INDEX `MonthlyIncome_year_month_currency_property_id_key`(`year`, `month`, `currency`, `property_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MonthlyIncome` ADD CONSTRAINT `MonthlyIncome_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `Property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
