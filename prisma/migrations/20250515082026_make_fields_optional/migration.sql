-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `userinfo` DROP FOREIGN KEY `userinfo_department_id_fkey`;

-- DropForeignKey
ALTER TABLE `userinfo` DROP FOREIGN KEY `userinfo_job_title_id_fkey`;

-- DropForeignKey
ALTER TABLE `userinfo` DROP FOREIGN KEY `userinfo_role_id_fkey`;

-- DropIndex
DROP INDEX `accounts_user_id_fkey` ON `accounts`;

-- DropIndex
DROP INDEX `userinfo_department_id_fkey` ON `userinfo`;

-- DropIndex
DROP INDEX `userinfo_job_title_id_fkey` ON `userinfo`;

-- DropIndex
DROP INDEX `userinfo_role_id_fkey` ON `userinfo`;

-- AlterTable
ALTER TABLE `accounts` MODIFY `user_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `userinfo` ADD COLUMN `birth_date` DATETIME(3) NULL,
    MODIFY `role_id` INTEGER NULL,
    MODIFY `job_title_id` VARCHAR(191) NULL,
    MODIFY `department_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `userinfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userinfo` ADD CONSTRAINT `userinfo_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userinfo` ADD CONSTRAINT `userinfo_job_title_id_fkey` FOREIGN KEY (`job_title_id`) REFERENCES `jobtitles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userinfo` ADD CONSTRAINT `userinfo_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
