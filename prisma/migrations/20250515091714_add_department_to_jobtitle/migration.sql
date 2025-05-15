-- AlterTable
ALTER TABLE `jobtitles` ADD COLUMN `department_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `jobtitles` ADD CONSTRAINT `jobtitles_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
