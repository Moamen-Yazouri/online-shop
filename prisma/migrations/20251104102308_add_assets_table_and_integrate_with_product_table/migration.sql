-- CreateTable
CREATE TABLE `assets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `storage_provider_name` ENUM('IMAGE_KIT') NOT NULL DEFAULT 'IMAGE_KIT',
    `fileId` VARCHAR(255) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `fileType` VARCHAR(255) NOT NULL,
    `fileSizeInKB` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `product_id` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
