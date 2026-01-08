-- Simple migration: Add payment fields to orders table
-- Run this if the complex version doesn't work
-- If columns already exist, you'll get an error - that's okay

USE techstore;

ALTER TABLE `orders` 
ADD COLUMN `paymentMethod` ENUM('cod', 'momo', 'bank', 'other') DEFAULT NULL AFTER `paymentStatus`,
ADD COLUMN `paymentTransactionId` VARCHAR(100) DEFAULT NULL AFTER `paymentMethod`,
ADD COLUMN `momoRequestId` VARCHAR(100) DEFAULT NULL AFTER `paymentTransactionId`;



