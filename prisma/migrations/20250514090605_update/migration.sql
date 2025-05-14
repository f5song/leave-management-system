/*
  Warnings:

  - You are about to drop the `UserInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserInfo` DROP FOREIGN KEY `UserInfo_department_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserInfo` DROP FOREIGN KEY `UserInfo_job_title_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserInfo` DROP FOREIGN KEY `UserInfo_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_approved_by_fkey`;

-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `holidays` DROP FOREIGN KEY `holidays_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `leaves` DROP FOREIGN KEY `leaves_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `leaves` DROP FOREIGN KEY `leaves_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `roles` DROP FOREIGN KEY `roles_created_by_fkey`;

-- DropIndex
DROP INDEX `accounts_approved_by_fkey` ON `accounts`;

-- DropIndex
DROP INDEX `accounts_user_id_fkey` ON `accounts`;

-- DropIndex
DROP INDEX `holidays_created_by_fkey` ON `holidays`;

-- DropIndex
DROP INDEX `leaves_created_by_fkey` ON `leaves`;

-- DropIndex
DROP INDEX `leaves_user_id_fkey` ON `leaves`;

-- DropIndex
DROP INDEX `roles_created_by_fkey` ON `roles`;

-- DropTable
DROP TABLE `UserInfo`;

-- CreateTable
CREATE TABLE `userinfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role_id` INTEGER NOT NULL,
    `job_title_id` VARCHAR(191) NOT NULL,
    `department_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NULL,
    `delete_time` DATETIME(3) NULL,

    UNIQUE INDEX `userinfo_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `userinfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `userinfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userinfo` ADD CONSTRAINT `userinfo_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userinfo` ADD CONSTRAINT `userinfo_job_title_id_fkey` FOREIGN KEY (`job_title_id`) REFERENCES `jobtitles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userinfo` ADD CONSTRAINT `userinfo_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `holidays` ADD CONSTRAINT `holidays_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `userinfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `userinfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaves` ADD CONSTRAINT `leaves_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `userinfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaves` ADD CONSTRAINT `leaves_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `userinfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
