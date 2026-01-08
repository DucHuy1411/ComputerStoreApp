-- Migration: Remove MoMo, Add VNPay support
-- This migration removes momoRequestId column and updates paymentMethod enum

-- Step 1: Remove momoRequestId column if exists
ALTER TABLE `orders` DROP COLUMN IF EXISTS `momoRequestId`;

-- Step 2: Update paymentMethod enum to replace 'momo' with 'vnpay'
-- Note: MySQL doesn't support direct enum modification, so we need to:
-- 1. Alter column to allow NULL temporarily
-- 2. Update existing 'momo' values to 'vnpay'
-- 3. Modify enum to remove 'momo' and add 'vnpay'

-- Update existing 'momo' payment methods to 'vnpay'
UPDATE `orders` SET `paymentMethod` = 'vnpay' WHERE `paymentMethod` = 'momo';

-- Modify enum (MySQL syntax)
ALTER TABLE `orders` 
MODIFY COLUMN `paymentMethod` ENUM('cod', 'vnpay', 'bank', 'other') NULL DEFAULT NULL;



