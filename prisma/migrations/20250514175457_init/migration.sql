-- DropForeignKey
ALTER TABLE `holidays` DROP FOREIGN KEY `holidays_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `leaves` DROP FOREIGN KEY `leaves_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `roles` DROP FOREIGN KEY `roles_created_by_fkey`;

-- DropIndex
DROP INDEX `holidays_created_by_fkey` ON `holidays`;

-- DropIndex
DROP INDEX `leaves_created_by_fkey` ON `leaves`;

-- DropIndex
DROP INDEX `roles_created_by_fkey` ON `roles`;

-- AlterTable
ALTER TABLE `holidays` MODIFY `created_by` INTEGER NULL;

-- AlterTable
ALTER TABLE `leaves` MODIFY `created_by` INTEGER NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `created_by` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `holidays` ADD CONSTRAINT `holidays_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `userinfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `userinfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaves` ADD CONSTRAINT `leaves_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `userinfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
