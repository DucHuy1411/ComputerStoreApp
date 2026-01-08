-- Migration: Add payment fields to orders table
-- Date: 2025-01-06
-- Description: Add paymentMethod, paymentTransactionId, and momoRequestId columns to orders table

-- Check if columns already exist before adding
-- This migration is idempotent (safe to run multiple times)

-- Add paymentMethod column
ALTER TABLE `orders` 
ADD COLUMN IF NOT EXISTS `paymentMethod` ENUM('cod', 'momo', 'bank', 'other') DEFAULT NULL AFTER `paymentStatus`;

-- Add paymentTransactionId column
ALTER TABLE `orders` 
ADD COLUMN IF NOT EXISTS `paymentTransactionId` VARCHAR(100) DEFAULT NULL AFTER `paymentMethod`;

-- Add momoRequestId column
ALTER TABLE `orders` 
ADD COLUMN IF NOT EXISTS `momoRequestId` VARCHAR(100) DEFAULT NULL AFTER `paymentTransactionId`;

-- Note: MySQL doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- If columns already exist, you'll get an error - that's okay, just ignore it
-- Or use this safer approach:

-- Check and add paymentMethod
SET @dbname = DATABASE();
SET @tablename = "orders";
SET @columnname = "paymentMethod";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  "SELECT 'Column paymentMethod already exists.'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " ENUM('cod', 'momo', 'bank', 'other') DEFAULT NULL AFTER paymentStatus;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add paymentTransactionId
SET @columnname = "paymentTransactionId";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  "SELECT 'Column paymentTransactionId already exists.'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " VARCHAR(100) DEFAULT NULL AFTER paymentMethod;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add momoRequestId
SET @columnname = "momoRequestId";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  "SELECT 'Column momoRequestId already exists.'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " VARCHAR(100) DEFAULT NULL AFTER paymentTransactionId;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;



