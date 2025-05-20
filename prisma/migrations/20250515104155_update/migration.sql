/*
  Warnings:

  - You are about to drop the column `role_id` on the `permission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `permission` DROP FOREIGN KEY `permission_role_id_fkey`;

-- DropIndex
DROP INDEX `permission_role_id_fkey` ON `permission`;

-- AlterTable
ALTER TABLE `permission` DROP COLUMN `role_id`;

-- CreateTable
CREATE TABLE `role_permission` (
    `role_id` INTEGER NOT NULL,
    `permission_id` INTEGER NOT NULL,

    PRIMARY KEY (`role_id`, `permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
