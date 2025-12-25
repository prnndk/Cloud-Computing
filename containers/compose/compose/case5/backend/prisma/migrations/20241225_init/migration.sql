-- CreateTable
CREATE TABLE `tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    `dueDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO `tasks` (`title`, `description`, `status`, `priority`, `dueDate`, `createdAt`, `updatedAt`) VALUES
('Belajar Docker Compose', 'Mempelajari cara membuat multi-container application dengan Docker Compose', 'IN_PROGRESS', 'HIGH', '2024-12-30 00:00:00', NOW(), NOW()),
('Setup CI/CD Pipeline', 'Konfigurasi GitHub Actions untuk automated deployment', 'PENDING', 'URGENT', '2024-12-28 00:00:00', NOW(), NOW()),
('Review Code Backend', 'Review dan optimasi kode Express.js backend', 'PENDING', 'MEDIUM', NULL, NOW(), NOW()),
('Update Documentation', 'Update README dan API documentation', 'COMPLETED', 'LOW', '2024-12-25 00:00:00', NOW(), NOW()),
('Bug Fix Login Page', 'Perbaiki bug pada halaman login', 'CANCELLED', 'HIGH', '2024-12-20 00:00:00', NOW(), NOW());
