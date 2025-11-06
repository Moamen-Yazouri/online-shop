/*
  Warnings:

  - You are about to drop the `order_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_return` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `order_product` DROP FOREIGN KEY `Order_Product_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_product` DROP FOREIGN KEY `Order_Product_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_return` DROP FOREIGN KEY `Order_Return_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `return_item` DROP FOREIGN KEY `Return_Item_order_return_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_transaction` DROP FOREIGN KEY `User_Transaction_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_transaction` DROP FOREIGN KEY `User_Transaction_order_return_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_transaction` DROP FOREIGN KEY `User_Transaction_user_id_fkey`;

-- DropTable
DROP TABLE `order_product`;

-- DropTable
DROP TABLE `order_return`;

-- DropTable
DROP TABLE `user_transaction`;

-- CreateTable
CREATE TABLE `OrderProduct` (
    `order_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,

    INDEX `OrderProduct_product_id_idx`(`product_id`),
    PRIMARY KEY (`order_id`, `product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderReturn` (
    `order_return_id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `status` ENUM('PICKED', 'REFUND', 'PENDING') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OrderReturn_order_id_idx`(`order_id`),
    INDEX `OrderReturn_status_idx`(`status`),
    PRIMARY KEY (`order_return_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserTransaction` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `type` ENUM('DEBIT', 'CREDIT') NOT NULL,
    `order_id` BIGINT NULL,
    `order_return_id` BIGINT NULL,

    INDEX `UserTransaction_user_id_idx`(`user_id`),
    INDEX `UserTransaction_order_id_idx`(`order_id`),
    INDEX `UserTransaction_order_return_id_idx`(`order_return_id`),
    INDEX `UserTransaction_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderProduct` ADD CONSTRAINT `OrderProduct_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderProduct` ADD CONSTRAINT `OrderProduct_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderReturn` ADD CONSTRAINT `OrderReturn_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Return_Item` ADD CONSTRAINT `Return_Item_order_return_id_fkey` FOREIGN KEY (`order_return_id`) REFERENCES `OrderReturn`(`order_return_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTransaction` ADD CONSTRAINT `UserTransaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTransaction` ADD CONSTRAINT `UserTransaction_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTransaction` ADD CONSTRAINT `UserTransaction_order_return_id_fkey` FOREIGN KEY (`order_return_id`) REFERENCES `OrderReturn`(`order_return_id`) ON DELETE SET NULL ON UPDATE CASCADE;
