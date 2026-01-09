-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 09, 2026 at 09:53 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `techstore`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `recipientName` varchar(120) NOT NULL,
  `recipientPhone` varchar(30) NOT NULL,
  `line1` varchar(255) NOT NULL,
  `ward` varchar(120) DEFAULT NULL,
  `district` varchar(120) DEFAULT NULL,
  `city` varchar(120) DEFAULT NULL,
  `province` varchar(120) DEFAULT NULL,
  `country` varchar(2) NOT NULL DEFAULT 'VN',
  `type` enum('home','work','other') NOT NULL DEFAULT 'home',
  `isDefault` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `userId`, `recipientName`, `recipientPhone`, `line1`, `ward`, `district`, `city`, `province`, `country`, `type`, `isDefault`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Nguyễn Văn A', '0912345678', '123 Nguyễn Huệ', 'Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'VN', 'home', 1, '2025-12-24 13:33:48.918', '2025-12-24 13:33:48.918'),
(2, 1, 'Nguyễn Văn A', '0912345678', '456 Lê Lợi', 'Bến Thành', 'Quận 1', 'TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'VN', 'work', 0, '2025-12-24 13:33:48.918', '2025-12-24 13:33:48.918'),
(3, 1, 'Trần Thị B', '0923456789', '789 Võ Văn Tần', 'Phường 5', 'Quận 3', 'TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'VN', 'other', 0, '2025-12-24 13:33:48.918', '2025-12-24 13:33:48.918'),
(4, 2, 'Nguyen Van An', '0222333555', '123 Hoang Quoc Viet', 'Cau Giay', 'Cau Giay', 'Ha Noi', 'Ha Noi', 'VN', 'home', 0, '2025-12-24 16:58:09.000', '2025-12-25 11:42:29.000'),
(5, 2, 'Nguyen Van An', '0222333222', '123 Quang Trung', 'Thanh Xuân', 'Thanh Xuân', 'Hà Nôi', 'Hà Nội', 'VN', '', 1, '2025-12-25 02:49:13.000', '2025-12-25 11:42:29.000');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `productId` bigint(20) UNSIGNED NOT NULL,
  `qty` int(11) NOT NULL DEFAULT 1,
  `selected` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `userId`, `productId`, `qty`, `selected`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 1, 1, '2025-12-24 13:33:49.005', '2025-12-24 13:33:49.005'),
(2, 1, 3, 1, 1, '2025-12-24 13:33:49.005', '2025-12-24 13:33:49.005'),
(3, 1, 4, 1, 1, '2025-12-24 13:33:49.005', '2025-12-24 13:33:49.005');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `parentId` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(140) NOT NULL,
  `slug` varchar(160) NOT NULL,
  `icon` varchar(64) DEFAULT NULL,
  `hint` varchar(180) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `parentId`, `name`, `slug`, `icon`, `hint`, `sortOrder`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, NULL, 'Thiết bị', 'thiet-bi', 'grid-outline', NULL, 1, 1, '2025-12-24 13:33:48.936', '2025-12-24 13:33:48.936'),
(2, NULL, 'Phụ kiện', 'phu-kien', 'headset-outline', NULL, 2, 1, '2025-12-24 13:33:48.936', '2025-12-24 13:33:48.936'),
(3, NULL, 'Khác', 'khac', 'cube-outline', NULL, 3, 1, '2025-12-24 13:33:48.936', '2025-12-24 13:33:48.936'),
(4, 1, 'Laptop', 'laptop', 'laptop-outline', 'Gaming, văn phòng, mỏng nhẹ', 1, 1, '2025-12-24 13:33:48.956', '2025-12-24 13:33:48.956'),
(5, 1, 'PC & Linh kiện', 'pc-linh-kien', 'desktop-outline', 'CPU, VGA, RAM, SSD', 2, 1, '2025-12-24 13:33:48.956', '2025-12-24 13:33:48.956'),
(6, 1, 'Màn hình', 'man-hinh', 'tv-outline', 'Gaming, đồ hoạ, văn phòng', 3, 1, '2025-12-24 13:33:48.956', '2025-12-24 13:33:48.956'),
(7, 2, 'Bàn phím', 'ban-phim', 'keypad-outline', 'Cơ, văn phòng, wireless', 1, 1, '2025-12-24 13:33:48.956', '2025-12-24 13:33:48.956'),
(8, 2, 'Chuột', 'chuot', 'mouse-outline', 'Gaming, ergonomic', 2, 1, '2025-12-24 13:33:48.956', '2025-12-24 13:33:48.956'),
(9, 2, 'Tai nghe', 'tai-nghe', 'headset-outline', 'Gaming, chống ồn', 3, 1, '2025-12-24 13:33:48.956', '2025-12-24 13:33:48.956'),
(10, 3, 'Lưu trữ', 'luu-tru', 'server-outline', 'SSD, HDD, thẻ nhớ', 1, 1, '2025-12-24 13:33:48.956', '2025-12-24 13:33:48.956'),
(11, 3, 'Mạng', 'mang', 'wifi-outline', 'Router, mesh, switch', 2, 1, '2025-12-24 13:33:48.956', '2025-12-24 13:33:48.956'),
(12, 3, 'Ghế', 'ghe', 'cube-outline', 'Gaming, công thái học', 3, 1, '2025-12-24 13:33:48.956', '2025-12-24 13:33:48.956');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(40) NOT NULL DEFAULT 'system',
  `title` varchar(140) NOT NULL,
  `body` varchar(500) DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `readAt` datetime(3) DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `userId`, `type`, `title`, `body`, `isRead`, `readAt`, `data`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'promo', 'Voucher mới', 'Bạn có voucher TECH500 giảm 500K', 0, NULL, NULL, '2025-12-24 13:33:49.112', '2025-12-24 13:33:49.112'),
(2, 1, 'order', 'Đơn hàng', 'Đơn #ORD-284756 đang được xử lý', 0, NULL, NULL, '2025-12-24 13:33:49.112', '2025-12-24 13:33:49.112'),
(3, 1, 'system', 'Thông báo', 'Flash sale sắp kết thúc', 0, NULL, NULL, '2025-12-24 13:33:49.112', '2025-12-24 13:33:49.112');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(32) NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `addressId` bigint(20) UNSIGNED DEFAULT NULL,
  `shipName` varchar(120) NOT NULL,
  `shipPhone` varchar(30) NOT NULL,
  `shipAddressText` varchar(450) NOT NULL,
  `status` enum('pending','processing','shipping','done','canceled') NOT NULL DEFAULT 'pending',
  `shippingMethod` varchar(50) DEFAULT NULL,
  `shippingFee` decimal(15,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(15,2) NOT NULL DEFAULT 0.00,
  `discountTotal` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total` decimal(15,2) NOT NULL DEFAULT 0.00,
  `appliedPromotionId` bigint(20) UNSIGNED DEFAULT NULL,
  `paymentStatus` enum('unpaid','paid','failed','refunded') NOT NULL DEFAULT 'unpaid',
  `paymentMethod` enum('cod','vnpay','bank','other') DEFAULT NULL,
  `paymentTransactionId` varchar(100) DEFAULT NULL,
  `placedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `code`, `userId`, `addressId`, `shipName`, `shipPhone`, `shipAddressText`, `status`, `shippingMethod`, `shippingFee`, `subtotal`, `discountTotal`, `total`, `appliedPromotionId`, `paymentStatus`, `paymentMethod`, `paymentTransactionId`, `placedAt`, `createdAt`, `updatedAt`) VALUES
(11, 'ORD-517543', 2, 4, 'Nguyen Van An', '0222333555', '123 Hoang Quoc Viet, Cau Giay, Cau Giay, Ha Noi', 'processing', 'standard', 0.00, 3180000.00, 0.00, 3180000.00, NULL, 'paid', NULL, NULL, '2025-12-25 02:51:57.138', '2025-12-25 02:51:57.000', '2026-01-06 22:40:58.000'),
(12, 'ORD-901046', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'canceled', 'standard', 0.00, 27380000.00, 0.00, 27380000.00, NULL, 'unpaid', NULL, NULL, '2025-12-25 11:48:46.552', '2025-12-25 11:48:46.000', '2025-12-25 12:02:23.000'),
(13, 'ORD-131081', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 7490000.00, 0.00, 7490000.00, NULL, 'unpaid', NULL, NULL, '2025-12-25 12:03:32.277', '2025-12-25 12:03:32.000', '2025-12-25 12:03:32.000'),
(14, 'ORD-531112', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 38990000.00, 0.00, 38990000.00, NULL, 'unpaid', NULL, NULL, '2026-01-06 21:51:53.044', '2026-01-06 21:51:53.000', '2026-01-06 21:51:53.000'),
(15, 'ORD-959905', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'done', 'standard', 0.00, 1790000.00, 0.00, 1790000.00, NULL, 'paid', NULL, NULL, '2026-01-06 22:01:48.832', '2026-01-06 22:01:48.000', '2026-01-07 00:09:43.000'),
(16, 'ORD-143659', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 31990000.00, 0.00, 31990000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 17:26:10.718', '2026-01-07 17:26:10.000', '2026-01-07 17:26:10.000'),
(17, 'ORD-135833', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 17:26:57.958', '2026-01-07 17:26:57.000', '2026-01-07 17:26:57.000'),
(18, 'ORD-111476', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 7490000.00, 0.00, 7490000.00, NULL, 'unpaid', NULL, NULL, '2026-01-07 17:33:43.022', '2026-01-07 17:33:43.000', '2026-01-07 17:33:43.000'),
(19, 'ORD-904429', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 7490000.00, 0.00, 7490000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 17:33:57.815', '2026-01-07 17:33:57.000', '2026-01-07 17:33:57.000'),
(20, 'ORD-844658', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 5990000.00, 0.00, 5990000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 17:43:19.273', '2026-01-07 17:43:19.000', '2026-01-07 17:43:19.000'),
(21, 'ORD-895001', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 5990000.00, 0.00, 5990000.00, NULL, 'unpaid', NULL, NULL, '2026-01-07 17:48:32.095', '2026-01-07 17:48:32.000', '2026-01-07 17:48:32.000'),
(22, 'ORD-962501', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 5990000.00, 0.00, 5990000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 17:48:50.190', '2026-01-07 17:48:50.000', '2026-01-07 17:48:50.000'),
(23, 'ORD-142951', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 5990000.00, 0.00, 5990000.00, NULL, 'unpaid', NULL, NULL, '2026-01-07 17:53:20.205', '2026-01-07 17:53:20.000', '2026-01-07 17:53:20.000'),
(24, 'ORD-341246', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 5990000.00, 0.00, 5990000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 17:55:07.770', '2026-01-07 17:55:07.000', '2026-01-07 17:55:07.000'),
(25, 'ORD-672573', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 17:57:14.500', '2026-01-07 17:57:14.000', '2026-01-07 17:57:14.000'),
(26, 'ORD-320319', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 5990000.00, 0.00, 5990000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 18:00:01.876', '2026-01-07 18:00:01.000', '2026-01-07 18:00:02.000'),
(27, 'ORD-727047', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 5990000.00, 0.00, 5990000.00, NULL, 'unpaid', NULL, NULL, '2026-01-07 18:09:33.054', '2026-01-07 18:09:33.000', '2026-01-07 18:09:33.000'),
(28, 'ORD-918665', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 18:16:36.248', '2026-01-07 18:16:36.000', '2026-01-07 18:16:36.000'),
(29, 'ORD-915513', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 18:22:37.725', '2026-01-07 18:22:37.000', '2026-01-07 18:22:37.000'),
(30, 'ORD-260362', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 18:32:31.293', '2026-01-07 18:32:31.000', '2026-01-07 18:32:35.000'),
(31, 'ORD-113670', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 20:18:32.911', '2026-01-07 20:18:32.000', '2026-01-07 20:18:33.000'),
(32, 'ORD-733484', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 20:29:35.181', '2026-01-07 20:29:35.000', '2026-01-07 20:29:36.000'),
(33, 'ORD-947871', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 20:35:36.149', '2026-01-07 20:35:36.000', '2026-01-07 20:35:37.000'),
(34, 'ORD-865058', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 20:37:17.044', '2026-01-07 20:37:17.000', '2026-01-07 20:37:18.000'),
(35, 'ORD-123178', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 5990000.00, 0.00, 5990000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 20:47:29.341', '2026-01-07 20:47:29.000', '2026-01-07 20:47:30.000'),
(36, 'ORD-482844', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 21:00:53.653', '2026-01-07 21:00:53.000', '2026-01-07 21:00:54.000'),
(37, 'ORD-383536', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 21:08:46.783', '2026-01-07 21:08:46.000', '2026-01-07 21:08:48.000'),
(38, 'ORD-677100', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 21:16:08.399', '2026-01-07 21:16:08.000', '2026-01-07 21:16:09.000'),
(39, 'ORD-121333', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1790000.00, 0.00, 1790000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 21:25:20.358', '2026-01-07 21:25:20.000', '2026-01-07 21:25:21.000'),
(40, 'ORD-663003', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 5990000.00, 0.00, 5990000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 21:28:04.722', '2026-01-07 21:28:04.000', '2026-01-07 21:28:05.000'),
(41, 'ORD-758260', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 21:38:20.944', '2026-01-07 21:38:20.000', '2026-01-07 21:38:21.000'),
(42, 'ORD-397450', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 21:40:57.679', '2026-01-07 21:40:57.000', '2026-01-07 21:40:58.000'),
(43, 'ORD-151907', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 21:42:40.830', '2026-01-07 21:42:40.000', '2026-01-07 21:42:41.000'),
(44, 'ORD-844910', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 21:44:01.302', '2026-01-07 21:44:01.000', '2026-01-07 21:44:02.000'),
(45, 'ORD-337762', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 21:46:24.972', '2026-01-07 21:46:24.000', '2026-01-07 21:46:25.000'),
(46, 'ORD-280365', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', NULL, NULL, '2026-01-07 21:57:33.448', '2026-01-07 21:57:33.000', '2026-01-07 21:57:33.000'),
(47, 'ORD-861968', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 22:00:59.395', '2026-01-07 22:00:59.000', '2026-01-07 22:01:00.000'),
(48, 'ORD-999524', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', NULL, NULL, '2026-01-07 22:29:08.527', '2026-01-07 22:29:08.000', '2026-01-07 22:29:08.000'),
(49, 'ORD-737715', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', NULL, NULL, '2026-01-07 22:30:10.704', '2026-01-07 22:30:10.000', '2026-01-07 22:30:10.000'),
(50, 'ORD-538630', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', NULL, NULL, '2026-01-07 22:33:52.950', '2026-01-07 22:33:52.000', '2026-01-07 22:33:52.000'),
(51, 'ORD-914002', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', NULL, NULL, '2026-01-07 22:34:56.493', '2026-01-07 22:34:56.000', '2026-01-07 22:34:56.000'),
(52, 'ORD-643752', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 22:37:45.975', '2026-01-07 22:37:45.000', '2026-01-07 22:37:46.000'),
(53, 'ORD-332235', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 22:42:25.330', '2026-01-07 22:42:25.000', '2026-01-07 22:42:26.000'),
(54, 'ORD-763527', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 22:47:11.577', '2026-01-07 22:47:11.000', '2026-01-07 22:47:12.000'),
(55, 'ORD-899832', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 22:54:18.070', '2026-01-07 22:54:18.000', '2026-01-07 22:54:18.000'),
(56, 'ORD-561054', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 22:56:24.566', '2026-01-07 22:56:24.000', '2026-01-07 22:56:25.000'),
(57, 'ORD-282003', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 5990000.00, 0.00, 5990000.00, NULL, 'unpaid', NULL, NULL, '2026-01-07 23:14:21.839', '2026-01-07 23:14:21.000', '2026-01-07 23:14:21.000'),
(58, 'ORD-527800', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1790000.00, 0.00, 1790000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 23:15:38.814', '2026-01-07 23:15:38.000', '2026-01-07 23:15:39.000'),
(59, 'ORD-625938', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 23:19:53.462', '2026-01-07 23:19:53.000', '2026-01-07 23:19:54.000'),
(60, 'ORD-794739', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 23:37:09.642', '2026-01-07 23:37:09.000', '2026-01-07 23:37:10.000'),
(61, 'ORD-662364', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 7490000.00, 0.00, 7490000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 23:49:58.031', '2026-01-07 23:49:58.000', '2026-01-07 23:49:58.000'),
(62, 'ORD-353574', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 23:55:04.288', '2026-01-07 23:55:04.000', '2026-01-07 23:55:05.000'),
(63, 'ORD-638908', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 5990000.00, 0.00, 5990000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-07 23:59:05.269', '2026-01-07 23:59:05.000', '2026-01-07 23:59:06.000'),
(64, 'ORD-771988', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-08 00:01:00.957', '2026-01-08 00:01:00.000', '2026-01-08 00:01:01.000'),
(65, 'ORD-205146', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', NULL, NULL, '2026-01-08 00:01:47.781', '2026-01-08 00:01:47.000', '2026-01-08 00:01:47.000'),
(66, 'ORD-597670', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 7490000.00, 0.00, 7490000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-08 00:01:57.254', '2026-01-08 00:01:57.000', '2026-01-08 00:01:57.000'),
(67, 'ORD-988168', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1790000.00, 0.00, 1790000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-08 00:03:18.507', '2026-01-08 00:03:18.000', '2026-01-08 00:03:19.000'),
(68, 'ORD-115499', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1790000.00, 0.00, 1790000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-08 00:05:40.050', '2026-01-08 00:05:40.000', '2026-01-08 00:05:40.000'),
(69, 'ORD-508225', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'pending', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'unpaid', 'vnpay', NULL, '2026-01-08 00:07:38.734', '2026-01-08 00:07:38.000', '2026-01-08 00:07:39.000'),
(70, 'ORD-721539', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'done', 'standard', 0.00, 1390000.00, 0.00, 1390000.00, NULL, 'paid', 'vnpay', NULL, '2026-01-08 00:10:36.798', '2026-01-08 00:10:36.000', '2026-01-09 15:42:18.000'),
(71, 'ORD-518523', 2, 5, 'Nguyen Van An', '0222333222', '123 Quang Trung, Thanh Xuân, Thanh Xuân, Hà Nôi', 'done', 'sieutochn', 80000.00, 1390000.00, 0.00, 1470000.00, NULL, 'paid', NULL, NULL, '2026-01-09 15:41:00.839', '2026-01-09 15:41:00.000', '2026-01-09 15:41:44.000');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `orderId` bigint(20) UNSIGNED NOT NULL,
  `productId` bigint(20) UNSIGNED DEFAULT NULL,
  `productName` varchar(220) NOT NULL,
  `productImageUrl` varchar(1024) DEFAULT NULL,
  `unitPrice` decimal(15,2) NOT NULL DEFAULT 0.00,
  `qty` int(11) NOT NULL DEFAULT 1,
  `lineTotal` decimal(15,2) NOT NULL DEFAULT 0.00,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `orderId`, `productId`, `productName`, `productImageUrl`, `unitPrice`, `qty`, `lineTotal`, `createdAt`, `updatedAt`) VALUES
(18, 11, 3, 'Bàn phím cơ Logitech G Pro X', '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', 1790000.00, 1, 1790000.00, '2025-12-25 02:51:57.000', '2025-12-25 02:51:57.000'),
(19, 11, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2025-12-25 02:51:57.000', '2025-12-25 02:51:57.000'),
(20, 12, 1, 'Laptop Dell XPS 13 Intel Core i7', '[\"https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80\", \"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80\", \"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80\"]', 25990000.00, 1, 25990000.00, '2025-12-25 11:48:46.000', '2025-12-25 11:48:46.000'),
(21, 12, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2025-12-25 11:48:46.000', '2025-12-25 11:48:46.000'),
(22, 13, 5, 'Tai nghe Sony WH-1000XM5', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 7490000.00, 1, 7490000.00, '2025-12-25 12:03:32.000', '2025-12-25 12:03:32.000'),
(23, 14, 134, 'Laptop Lenovo ThinkPad X1 Carbon Gen 11', '[\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80\"]', 38990000.00, 1, 38990000.00, '2026-01-06 21:51:53.000', '2026-01-06 21:51:53.000'),
(24, 15, 3, 'Bàn phím cơ Logitech G Pro X', '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', 1790000.00, 1, 1790000.00, '2026-01-06 22:01:48.000', '2026-01-06 22:01:48.000'),
(25, 16, 133, 'Laptop HP Spectre x360 14 Core i7', '[\"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80\", \"https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80\"]', 31990000.00, 1, 31990000.00, '2026-01-07 17:26:10.000', '2026-01-07 17:26:10.000'),
(26, 17, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 17:26:57.000', '2026-01-07 17:26:57.000'),
(27, 18, 5, 'Tai nghe Sony WH-1000XM5', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 7490000.00, 1, 7490000.00, '2026-01-07 17:33:43.000', '2026-01-07 17:33:43.000'),
(28, 19, 5, 'Tai nghe Sony WH-1000XM5', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 7490000.00, 1, 7490000.00, '2026-01-07 17:33:57.000', '2026-01-07 17:33:57.000'),
(29, 20, 184, 'Tai nghe Apple AirPods Pro (Gen 2)', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 5990000.00, 1, 5990000.00, '2026-01-07 17:43:19.000', '2026-01-07 17:43:19.000'),
(30, 21, 184, 'Tai nghe Apple AirPods Pro (Gen 2)', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 5990000.00, 1, 5990000.00, '2026-01-07 17:48:32.000', '2026-01-07 17:48:32.000'),
(31, 22, 184, 'Tai nghe Apple AirPods Pro (Gen 2)', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 5990000.00, 1, 5990000.00, '2026-01-07 17:48:50.000', '2026-01-07 17:48:50.000'),
(32, 23, 184, 'Tai nghe Apple AirPods Pro (Gen 2)', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 5990000.00, 1, 5990000.00, '2026-01-07 17:53:20.000', '2026-01-07 17:53:20.000'),
(33, 24, 184, 'Tai nghe Apple AirPods Pro (Gen 2)', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 5990000.00, 1, 5990000.00, '2026-01-07 17:55:07.000', '2026-01-07 17:55:07.000'),
(34, 25, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 17:57:14.000', '2026-01-07 17:57:14.000'),
(35, 26, 184, 'Tai nghe Apple AirPods Pro (Gen 2)', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 5990000.00, 1, 5990000.00, '2026-01-07 18:00:01.000', '2026-01-07 18:00:01.000'),
(36, 27, 184, 'Tai nghe Apple AirPods Pro (Gen 2)', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 5990000.00, 1, 5990000.00, '2026-01-07 18:09:33.000', '2026-01-07 18:09:33.000'),
(37, 28, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 18:16:36.000', '2026-01-07 18:16:36.000'),
(38, 29, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 18:22:37.000', '2026-01-07 18:22:37.000'),
(39, 30, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 18:32:31.000', '2026-01-07 18:32:31.000'),
(40, 31, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 20:18:32.000', '2026-01-07 20:18:32.000'),
(41, 32, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 20:29:35.000', '2026-01-07 20:29:35.000'),
(42, 33, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 20:35:36.000', '2026-01-07 20:35:36.000'),
(43, 34, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 20:37:17.000', '2026-01-07 20:37:17.000'),
(44, 35, 184, 'Tai nghe Apple AirPods Pro (Gen 2)', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 5990000.00, 1, 5990000.00, '2026-01-07 20:47:29.000', '2026-01-07 20:47:29.000'),
(45, 36, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 21:00:53.000', '2026-01-07 21:00:53.000'),
(46, 37, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 21:08:46.000', '2026-01-07 21:08:46.000'),
(47, 38, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 21:16:08.000', '2026-01-07 21:16:08.000'),
(48, 39, 3, 'Bàn phím cơ Logitech G Pro X', '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', 1790000.00, 1, 1790000.00, '2026-01-07 21:25:20.000', '2026-01-07 21:25:20.000'),
(49, 40, 184, 'Tai nghe Apple AirPods Pro (Gen 2)', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 5990000.00, 1, 5990000.00, '2026-01-07 21:28:04.000', '2026-01-07 21:28:04.000'),
(50, 41, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 21:38:20.000', '2026-01-07 21:38:20.000'),
(51, 42, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 21:40:57.000', '2026-01-07 21:40:57.000'),
(52, 43, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 21:42:40.000', '2026-01-07 21:42:40.000'),
(53, 44, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 21:44:01.000', '2026-01-07 21:44:01.000'),
(54, 45, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 21:46:24.000', '2026-01-07 21:46:24.000'),
(55, 46, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 21:57:33.000', '2026-01-07 21:57:33.000'),
(56, 47, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 22:00:59.000', '2026-01-07 22:00:59.000'),
(57, 48, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 22:29:08.000', '2026-01-07 22:29:08.000'),
(58, 49, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 22:30:10.000', '2026-01-07 22:30:10.000'),
(59, 50, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 22:33:52.000', '2026-01-07 22:33:52.000'),
(60, 51, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 22:34:56.000', '2026-01-07 22:34:56.000'),
(61, 52, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 22:37:45.000', '2026-01-07 22:37:45.000'),
(62, 53, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 22:42:25.000', '2026-01-07 22:42:25.000'),
(63, 54, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 22:47:11.000', '2026-01-07 22:47:11.000'),
(64, 55, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 22:54:18.000', '2026-01-07 22:54:18.000'),
(65, 56, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 22:56:24.000', '2026-01-07 22:56:24.000'),
(66, 57, 184, 'Tai nghe Apple AirPods Pro (Gen 2)', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 5990000.00, 1, 5990000.00, '2026-01-07 23:14:21.000', '2026-01-07 23:14:21.000'),
(67, 58, 3, 'Bàn phím cơ Logitech G Pro X', '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', 1790000.00, 1, 1790000.00, '2026-01-07 23:15:38.000', '2026-01-07 23:15:38.000'),
(68, 59, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 23:19:53.000', '2026-01-07 23:19:53.000'),
(69, 60, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 23:37:09.000', '2026-01-07 23:37:09.000'),
(70, 61, 5, 'Tai nghe Sony WH-1000XM5', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 7490000.00, 1, 7490000.00, '2026-01-07 23:49:58.000', '2026-01-07 23:49:58.000'),
(71, 62, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-07 23:55:04.000', '2026-01-07 23:55:04.000'),
(72, 63, 184, 'Tai nghe Apple AirPods Pro (Gen 2)', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 5990000.00, 1, 5990000.00, '2026-01-07 23:59:05.000', '2026-01-07 23:59:05.000'),
(73, 64, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-08 00:01:00.000', '2026-01-08 00:01:00.000'),
(74, 65, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-08 00:01:47.000', '2026-01-08 00:01:47.000'),
(75, 66, 5, 'Tai nghe Sony WH-1000XM5', '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', 7490000.00, 1, 7490000.00, '2026-01-08 00:01:57.000', '2026-01-08 00:01:57.000'),
(76, 67, 3, 'Bàn phím cơ Logitech G Pro X', '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', 1790000.00, 1, 1790000.00, '2026-01-08 00:03:18.000', '2026-01-08 00:03:18.000'),
(77, 68, 3, 'Bàn phím cơ Logitech G Pro X', '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', 1790000.00, 1, 1790000.00, '2026-01-08 00:05:40.000', '2026-01-08 00:05:40.000'),
(78, 69, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-08 00:07:38.000', '2026-01-08 00:07:38.000'),
(79, 70, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-08 00:10:36.000', '2026-01-08 00:10:36.000'),
(80, 71, 4, 'Chuột Razer DeathAdder V3 Pro', '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', 1390000.00, 1, 1390000.00, '2026-01-09 15:41:00.000', '2026-01-09 15:41:00.000');

-- --------------------------------------------------------

--
-- Table structure for table `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `orderId` bigint(20) UNSIGNED NOT NULL,
  `status` enum('pending','processing','shipping','done','canceled') NOT NULL,
  `title` varchar(120) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `happenedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_status_history`
--

INSERT INTO `order_status_history` (`id`, `orderId`, `status`, `title`, `description`, `happenedAt`, `createdAt`, `updatedAt`) VALUES
(13, 11, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2025-12-25 02:51:57.150', '2025-12-25 02:51:57.000', '2025-12-25 02:51:57.000'),
(14, 12, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2025-12-25 11:48:46.574', '2025-12-25 11:48:46.000', '2025-12-25 11:48:46.000'),
(15, 12, 'canceled', 'Hủy đơn', 'Đơn hàng đã bị hủy', '2025-12-25 12:02:23.048', '2025-12-25 12:02:23.000', '2025-12-25 12:02:23.000'),
(16, 13, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2025-12-25 12:03:32.287', '2025-12-25 12:03:32.000', '2025-12-25 12:03:32.000'),
(17, 14, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-06 21:51:53.078', '2026-01-06 21:51:53.000', '2026-01-06 21:51:53.000'),
(18, 15, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-06 22:01:48.871', '2026-01-06 22:01:48.000', '2026-01-06 22:01:48.000'),
(19, 15, 'processing', 'Đang xử lý', 'Chuyển trạng thái từ Chờ xử lý sang Đang xử lý', '2026-01-06 22:36:57.515', '2026-01-06 22:36:57.000', '2026-01-06 22:36:57.000'),
(20, 11, 'processing', 'Đang xử lý', 'Đơn hàng chuyển từ Chờ xử lý sang Đang xử lý', '2026-01-06 22:37:26.230', '2026-01-06 22:37:26.000', '2026-01-06 22:37:26.000'),
(21, 15, 'shipping', 'Đang giao hàng', 'Chuyển trạng thái từ Đang xử lý sang Đang giao hàng', '2026-01-06 22:37:30.225', '2026-01-06 22:37:30.000', '2026-01-06 22:37:30.000'),
(22, 15, 'done', 'Hoàn thành', 'Chuyển trạng thái từ Đang giao hàng sang Hoàn thành', '2026-01-06 22:37:34.433', '2026-01-06 22:37:34.000', '2026-01-06 22:37:34.000'),
(23, 11, 'processing', 'Cập nhật thanh toán: Đã thanh toán', 'Chuyển trạng thái thanh toán từ Chưa thanh toán sang Đã thanh toán', '2026-01-06 22:40:58.129', '2026-01-06 22:40:58.000', '2026-01-06 22:40:58.000'),
(24, 15, 'done', 'Cập nhật thanh toán: Đã thanh toán', 'Chuyển trạng thái thanh toán từ Chưa thanh toán sang Đã thanh toán', '2026-01-07 00:09:43.618', '2026-01-07 00:09:43.000', '2026-01-07 00:09:43.000'),
(25, 16, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 17:26:10.749', '2026-01-07 17:26:10.000', '2026-01-07 17:26:10.000'),
(26, 17, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 17:26:57.970', '2026-01-07 17:26:57.000', '2026-01-07 17:26:57.000'),
(27, 18, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 17:33:43.040', '2026-01-07 17:33:43.000', '2026-01-07 17:33:43.000'),
(28, 19, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 17:33:57.819', '2026-01-07 17:33:57.000', '2026-01-07 17:33:57.000'),
(29, 20, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 17:43:19.297', '2026-01-07 17:43:19.000', '2026-01-07 17:43:19.000'),
(30, 21, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 17:48:32.107', '2026-01-07 17:48:32.000', '2026-01-07 17:48:32.000'),
(31, 22, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 17:48:50.203', '2026-01-07 17:48:50.000', '2026-01-07 17:48:50.000'),
(32, 23, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 17:53:20.211', '2026-01-07 17:53:20.000', '2026-01-07 17:53:20.000'),
(33, 24, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 17:55:07.786', '2026-01-07 17:55:07.000', '2026-01-07 17:55:07.000'),
(34, 25, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 17:57:14.518', '2026-01-07 17:57:14.000', '2026-01-07 17:57:14.000'),
(35, 26, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 18:00:01.889', '2026-01-07 18:00:01.000', '2026-01-07 18:00:01.000'),
(36, 27, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 18:09:33.089', '2026-01-07 18:09:33.000', '2026-01-07 18:09:33.000'),
(37, 28, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 18:16:36.276', '2026-01-07 18:16:36.000', '2026-01-07 18:16:36.000'),
(38, 29, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 18:22:37.754', '2026-01-07 18:22:37.000', '2026-01-07 18:22:37.000'),
(39, 30, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 18:32:31.307', '2026-01-07 18:32:31.000', '2026-01-07 18:32:31.000'),
(40, 31, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 20:18:32.932', '2026-01-07 20:18:32.000', '2026-01-07 20:18:32.000'),
(41, 32, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 20:29:35.185', '2026-01-07 20:29:35.000', '2026-01-07 20:29:35.000'),
(42, 33, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 20:35:36.170', '2026-01-07 20:35:36.000', '2026-01-07 20:35:36.000'),
(43, 34, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 20:37:17.053', '2026-01-07 20:37:17.000', '2026-01-07 20:37:17.000'),
(44, 35, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 20:47:29.359', '2026-01-07 20:47:29.000', '2026-01-07 20:47:29.000'),
(45, 36, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 21:00:53.674', '2026-01-07 21:00:53.000', '2026-01-07 21:00:53.000'),
(46, 37, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 21:08:46.809', '2026-01-07 21:08:46.000', '2026-01-07 21:08:46.000'),
(47, 38, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 21:16:08.414', '2026-01-07 21:16:08.000', '2026-01-07 21:16:08.000'),
(48, 39, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 21:25:20.367', '2026-01-07 21:25:20.000', '2026-01-07 21:25:20.000'),
(49, 40, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 21:28:04.744', '2026-01-07 21:28:04.000', '2026-01-07 21:28:04.000'),
(50, 41, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 21:38:20.971', '2026-01-07 21:38:20.000', '2026-01-07 21:38:20.000'),
(51, 42, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 21:40:57.687', '2026-01-07 21:40:57.000', '2026-01-07 21:40:57.000'),
(52, 43, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 21:42:40.854', '2026-01-07 21:42:40.000', '2026-01-07 21:42:40.000'),
(53, 44, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 21:44:01.310', '2026-01-07 21:44:01.000', '2026-01-07 21:44:01.000'),
(54, 45, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 21:46:24.985', '2026-01-07 21:46:24.000', '2026-01-07 21:46:24.000'),
(55, 46, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 21:57:33.469', '2026-01-07 21:57:33.000', '2026-01-07 21:57:33.000'),
(56, 47, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 22:00:59.403', '2026-01-07 22:00:59.000', '2026-01-07 22:00:59.000'),
(57, 48, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 22:29:08.554', '2026-01-07 22:29:08.000', '2026-01-07 22:29:08.000'),
(58, 49, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 22:30:10.710', '2026-01-07 22:30:10.000', '2026-01-07 22:30:10.000'),
(59, 50, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 22:33:52.956', '2026-01-07 22:33:52.000', '2026-01-07 22:33:52.000'),
(60, 51, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 22:34:56.501', '2026-01-07 22:34:56.000', '2026-01-07 22:34:56.000'),
(61, 52, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 22:37:45.985', '2026-01-07 22:37:45.000', '2026-01-07 22:37:45.000'),
(62, 53, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 22:42:25.349', '2026-01-07 22:42:25.000', '2026-01-07 22:42:25.000'),
(63, 54, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 22:47:11.591', '2026-01-07 22:47:11.000', '2026-01-07 22:47:11.000'),
(64, 55, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 22:54:18.077', '2026-01-07 22:54:18.000', '2026-01-07 22:54:18.000'),
(65, 56, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 22:56:24.577', '2026-01-07 22:56:24.000', '2026-01-07 22:56:24.000'),
(66, 57, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 23:14:21.851', '2026-01-07 23:14:21.000', '2026-01-07 23:14:21.000'),
(67, 58, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 23:15:38.822', '2026-01-07 23:15:38.000', '2026-01-07 23:15:38.000'),
(68, 59, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 23:19:53.471', '2026-01-07 23:19:53.000', '2026-01-07 23:19:53.000'),
(69, 60, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 23:37:09.652', '2026-01-07 23:37:09.000', '2026-01-07 23:37:09.000'),
(70, 61, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 23:49:58.051', '2026-01-07 23:49:58.000', '2026-01-07 23:49:58.000'),
(71, 62, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 23:55:04.300', '2026-01-07 23:55:04.000', '2026-01-07 23:55:04.000'),
(72, 63, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-07 23:59:05.280', '2026-01-07 23:59:05.000', '2026-01-07 23:59:05.000'),
(73, 64, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-08 00:01:00.970', '2026-01-08 00:01:00.000', '2026-01-08 00:01:00.000'),
(74, 65, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-08 00:01:47.802', '2026-01-08 00:01:47.000', '2026-01-08 00:01:47.000'),
(75, 66, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-08 00:01:57.258', '2026-01-08 00:01:57.000', '2026-01-08 00:01:57.000'),
(76, 67, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-08 00:03:18.523', '2026-01-08 00:03:18.000', '2026-01-08 00:03:18.000'),
(77, 68, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-08 00:05:40.069', '2026-01-08 00:05:40.000', '2026-01-08 00:05:40.000'),
(78, 69, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-08 00:07:38.753', '2026-01-08 00:07:38.000', '2026-01-08 00:07:38.000'),
(79, 70, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-08 00:10:36.808', '2026-01-08 00:10:36.000', '2026-01-08 00:10:36.000'),
(80, 71, 'pending', 'Đặt hàng', 'Đơn hàng đã được đặt thành công', '2026-01-09 15:41:00.844', '2026-01-09 15:41:00.000', '2026-01-09 15:41:00.000'),
(81, 71, 'pending', 'Cập nhật thanh toán: Đã thanh toán', 'Chuyển trạng thái thanh toán từ Chưa thanh toán sang Đã thanh toán', '2026-01-09 15:41:39.394', '2026-01-09 15:41:39.000', '2026-01-09 15:41:39.000'),
(82, 71, 'processing', 'Đang xử lý', 'Chuyển trạng thái từ Chờ xử lý sang Đang xử lý', '2026-01-09 15:41:41.441', '2026-01-09 15:41:41.000', '2026-01-09 15:41:41.000'),
(83, 71, 'shipping', 'Đang giao hàng', 'Chuyển trạng thái từ Đang xử lý sang Đang giao hàng', '2026-01-09 15:41:43.257', '2026-01-09 15:41:43.000', '2026-01-09 15:41:43.000'),
(84, 71, 'done', 'Hoàn thành', 'Chuyển trạng thái từ Đang giao hàng sang Hoàn thành', '2026-01-09 15:41:44.971', '2026-01-09 15:41:44.000', '2026-01-09 15:41:44.000'),
(85, 70, 'processing', 'Đang xử lý', 'Đơn hàng chuyển từ Chờ xử lý sang Đang xử lý', '2026-01-09 15:42:07.836', '2026-01-09 15:42:07.000', '2026-01-09 15:42:07.000'),
(86, 70, 'shipping', 'Đang giao hàng', 'Chuyển trạng thái từ Đang xử lý sang Đang giao hàng', '2026-01-09 15:42:11.855', '2026-01-09 15:42:11.000', '2026-01-09 15:42:11.000'),
(87, 70, 'shipping', 'Cập nhật thanh toán: Đã thanh toán', 'Chuyển trạng thái thanh toán từ Chưa thanh toán sang Đã thanh toán', '2026-01-09 15:42:16.141', '2026-01-09 15:42:16.000', '2026-01-09 15:42:16.000'),
(88, 70, 'done', 'Hoàn thành', 'Chuyển trạng thái từ Đang giao hàng sang Hoàn thành', '2026-01-09 15:42:18.858', '2026-01-09 15:42:18.000', '2026-01-09 15:42:18.000');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `categoryId` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(220) NOT NULL,
  `slug` varchar(240) NOT NULL,
  `sku` varchar(64) NOT NULL,
  `brandName` varchar(80) DEFAULT NULL,
  `price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `oldPrice` decimal(15,2) DEFAULT NULL,
  `discountPct` int(11) DEFAULT NULL,
  `installmentMonthly` decimal(15,2) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `ratingAvg` decimal(3,2) NOT NULL DEFAULT 0.00,
  `reviewsCount` int(11) NOT NULL DEFAULT 0,
  `isFreeship` tinyint(1) NOT NULL DEFAULT 0,
  `isInstallment0` tinyint(1) NOT NULL DEFAULT 0,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `specs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specs`)),
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `description` longtext DEFAULT NULL,
  `status` enum('active','inactive','out_of_stock') NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `categoryId`, `name`, `slug`, `sku`, `brandName`, `price`, `oldPrice`, `discountPct`, `installmentMonthly`, `stock`, `ratingAvg`, `reviewsCount`, `isFreeship`, `isInstallment0`, `images`, `specs`, `tags`, `description`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 4, 'Laptop Dell XPS 13 Intel Core i7', 'laptop-dell-xps-13-i7', 'XPS9320I7', 'Dell', 25990000.00, 32990000.00, 21, 2165000.00, 24, 4.80, 324, 1, 1, '[\"https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80\", \"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80\", \"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80\"]', '[{\"k\": \"CPU\", \"v\": \"Intel Core i7-1260P\", \"icon\": \"hardware-chip-outline\"}, {\"k\": \"RAM\", \"v\": \"16GB LPDDR5\", \"icon\": \"albums-outline\"}, {\"k\": \"Storage\", \"v\": \"512GB SSD NVMe\", \"icon\": \"server-outline\"}, {\"k\": \"Display\", \"v\": \"13.4\\\" FHD+\", \"icon\": \"desktop-outline\"}]', '[\"Trả góp 0%\", \"Freeship\"]', NULL, 'active', '2025-12-24 13:33:48.983', '2025-12-24 13:33:48.983'),
(2, 4, 'Laptop Asus ROG Strix G15 RTX 4060', 'asus-rog-strix-g15-rtx4060', 'ROG-G15', 'Asus', 23390000.00, 35990000.00, 35, NULL, 12, 5.00, 567, 0, 0, '[\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80\"]', NULL, '[\"Trả góp 0%\"]', NULL, 'active', '2025-12-24 13:33:48.983', '2025-12-24 13:33:48.983'),
(3, 7, 'Bàn phím cơ Logitech G Pro X', 'logitech-g-pro-x', 'G-PRO', 'Logitech', 1790000.00, 2990000.00, 40, NULL, 20, 5.00, 892, 0, 0, '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', NULL, '[\"Flash Sale\"]', NULL, 'active', '2025-12-24 13:33:48.983', '2025-12-24 13:33:48.983'),
(4, 8, 'Chuột Razer DeathAdder V3 Pro', 'razer-deathadder-v3-pro', 'DA-V3', 'Razer', 1390000.00, 1990000.00, 30, NULL, 36, 5.00, 431, 0, 0, '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', NULL, '[\"Flash Sale\"]', NULL, 'active', '2025-12-24 13:33:48.983', '2025-12-24 13:33:48.983'),
(5, 9, 'Tai nghe Sony WH-1000XM5', 'sony-wh-1000xm5', 'WH-XM5', 'Sony', 7490000.00, 8990000.00, 17, NULL, 200, 5.00, 965, 0, 0, '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', NULL, '[\"Giảm giá\"]', NULL, 'active', '2025-12-24 13:33:48.983', '2026-01-09 15:25:33.000'),
(133, 4, 'Laptop HP Spectre x360 14 Core i7', 'laptop-hp-spectre-x360-14-i7', 'HP-SPX36014-I7', 'HP', 31990000.00, 36990000.00, 14, 2665000.00, 11, 4.70, 418, 1, 1, '[\"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80\", \"https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80\"]', '[{\"k\": \"CPU\", \"v\": \"Intel Core i7\", \"icon\": \"hardware-chip-outline\"}, {\"k\": \"RAM\", \"v\": \"16GB\", \"icon\": \"albums-outline\"}, {\"k\": \"Storage\", \"v\": \"1TB SSD\", \"icon\": \"server-outline\"}, {\"k\": \"Display\", \"v\": \"14\\\" OLED\", \"icon\": \"desktop-outline\"}]', '[\"Trả góp 0%\", \"Freeship\", \"Mới\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(134, 4, 'Laptop Lenovo ThinkPad X1 Carbon Gen 11', 'laptop-lenovo-thinkpad-x1-carbon-g11', 'LNV-X1C-G11', 'Lenovo', 38990000.00, 43990000.00, 11, 3249000.00, 8, 4.80, 256, 1, 1, '[\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80\"]', NULL, '[\"Trả góp 0%\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(135, 4, 'Laptop Acer Swift Go 14 OLED', 'laptop-acer-swift-go-14-oled', 'AC-SWGO14', 'Acer', 18990000.00, 21990000.00, 14, NULL, 19, 4.60, 173, 1, 0, '[\"https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80\"]', NULL, '[\"Freeship\", \"Mới\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(136, 4, 'Laptop MSI Katana 15 RTX 4060', 'laptop-msi-katana-15-rtx4060', 'MSI-KTN15-4060', 'MSI', 26990000.00, 31990000.00, 16, NULL, 14, 4.70, 522, 0, 0, '[\"https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&q=80\"]', NULL, '[\"Gaming\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(137, 4, 'Laptop ASUS TUF Gaming F15 2024', 'laptop-asus-tuf-f15-2024', 'AS-TUF-F15-2024', 'Asus', 21990000.00, 24990000.00, 12, NULL, 17, 4.70, 334, 0, 0, '[\"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80\"]', NULL, '[\"Gaming\", \"Mới\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(138, 4, 'Laptop Lenovo Legion 5 Pro RTX 4060', 'laptop-lenovo-legion-5-pro-rtx4060', 'LNV-L5P-4060', 'Lenovo', 32990000.00, 35990000.00, 8, 2749000.00, 9, 4.80, 612, 0, 1, '[\"https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&q=80\"]', NULL, '[\"Trả góp 0%\", \"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(139, 4, 'Laptop Dell Inspiron 14 Plus i7', 'laptop-dell-inspiron-14-plus-i7', 'DELL-INSP14P-I7', 'Dell', 19990000.00, 23990000.00, 17, NULL, 25, 4.50, 207, 1, 0, '[\"https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80\"]', NULL, '[\"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(140, 4, 'MacBook Air M2 13 inch 256GB', 'macbook-air-m2-13-256gb', 'APPLE-MBA-M2-256', 'Apple', 28990000.00, 31990000.00, 10, 2490000.00, 18, 4.90, 892, 1, 1, '[\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80\"]', NULL, '[\"Trả góp 0%\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(141, 4, 'Laptop Gigabyte AORUS 15 RTX 4070', 'laptop-gigabyte-aorus-15-rtx4070', 'GB-AORUS15-4070', 'Gigabyte', 39990000.00, 46990000.00, 15, NULL, 7, 4.70, 188, 0, 0, '[\"https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&q=80\"]', NULL, '[\"Gaming\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(142, 4, 'Laptop Samsung Galaxy Book3 Pro 14', 'laptop-samsung-galaxy-book3-pro-14', 'SS-GB3P-14', 'Samsung', 30990000.00, 34990000.00, 11, 2582000.00, 10, 4.60, 141, 1, 1, '[\"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80\"]', NULL, '[\"Trả góp 0%\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(143, 5, 'PC Gaming i5 + RTX 4060 16GB', 'pc-gaming-i5-rtx4060-16gb', 'PC-I5-4060-16', 'TechStore', 24990000.00, 28990000.00, 14, NULL, 6, 4.70, 221, 0, 0, '[\"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1200&q=80\"]', '[{\"k\": \"CPU\", \"v\": \"Intel Core i5\", \"icon\": \"hardware-chip-outline\"}, {\"k\": \"GPU\", \"v\": \"RTX 4060\", \"icon\": \"hardware-chip-outline\"}, {\"k\": \"RAM\", \"v\": \"16GB\", \"icon\": \"albums-outline\"}, {\"k\": \"Storage\", \"v\": \"1TB SSD\", \"icon\": \"server-outline\"}]', '[\"Gaming\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(144, 5, 'PC Gaming Ryzen 7 + RTX 4070', 'pc-gaming-ryzen7-rtx4070', 'PC-R7-4070', 'TechStore', 39990000.00, 45990000.00, 13, NULL, 4, 4.80, 177, 0, 0, '[\"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(145, 5, 'CPU Intel Core i7-14700K', 'cpu-intel-core-i7-14700k', 'CPU-I7-14700K', 'Intel', 10490000.00, 11990000.00, 13, NULL, 22, 4.90, 98, 1, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Mới\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(146, 5, 'CPU AMD Ryzen 7 7800X3D', 'cpu-amd-ryzen7-7800x3d', 'CPU-R7-7800X3D', 'AMD', 11990000.00, 13990000.00, 14, NULL, 18, 4.90, 134, 1, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Gaming\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(147, 5, 'VGA NVIDIA GeForce RTX 4070 SUPER', 'vga-rtx-4070-super', 'VGA-RTX4070S', 'NVIDIA', 18990000.00, 20990000.00, 10, NULL, 9, 4.80, 76, 0, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(148, 5, 'RAM Kingston Fury Beast 16GB DDR5', 'ram-kingston-fury-beast-16gb-ddr5', 'RAM-KF-16-DDR5', 'Kingston', 1490000.00, 1790000.00, 17, NULL, 40, 4.70, 211, 1, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(149, 5, 'SSD Samsung 990 PRO 1TB NVMe', 'ssd-samsung-990-pro-1tb', 'SSD-SS-990P-1T', 'Samsung', 2490000.00, 2990000.00, 17, NULL, 35, 4.80, 382, 1, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Freeship\", \"Mới\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(150, 5, 'Mainboard ASUS TUF B760M-PLUS', 'mainboard-asus-tuf-b760m-plus', 'MB-AS-B760M-TUF', 'Asus', 3890000.00, 4590000.00, 15, NULL, 16, 4.60, 97, 0, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(151, 5, 'Nguồn Corsair RM750e 750W 80+ Gold', 'psu-corsair-rm750e-750w', 'PSU-RM750E', 'Corsair', 2890000.00, 3390000.00, 15, NULL, 20, 4.70, 64, 0, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(152, 5, 'Tản nhiệt AIO Cooler Master 240mm', 'aio-coolermaster-240mm', 'AIO-CM-240', 'CoolerMaster', 2190000.00, 2590000.00, 15, NULL, 15, 4.60, 83, 0, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(153, 6, 'Màn hình LG UltraGear 27\" 165Hz', 'monitor-lg-ultragear-27-165hz', 'MON-LG-UG27-165', 'LG', 6990000.00, 7990000.00, 13, NULL, 28, 4.70, 251, 1, 0, '[\"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80\"]', NULL, '[\"Freeship\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(154, 6, 'Màn hình Samsung Odyssey G5 27\" 144Hz', 'monitor-samsung-odyssey-g5-27', 'MON-SS-G5-27', 'Samsung', 7490000.00, 8990000.00, 17, NULL, 19, 4.60, 312, 0, 0, '[\"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(155, 6, 'Màn hình Dell UltraSharp U2723QE 27\" 4K', 'monitor-dell-ultrasharp-u2723qe', 'MON-DELL-U2723QE', 'Dell', 12990000.00, 14990000.00, 13, NULL, 8, 4.80, 104, 1, 0, '[\"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80\"]', NULL, '[\"Đồ hoạ\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(156, 6, 'Màn hình ASUS TUF VG27AQ 27\" 165Hz', 'monitor-asus-tuf-vg27aq', 'MON-AS-VG27AQ', 'Asus', 8290000.00, 9790000.00, 15, NULL, 14, 4.70, 187, 0, 0, '[\"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(157, 6, 'Màn hình AOC 24G2 24\" 144Hz', 'monitor-aoc-24g2-24-144hz', 'MON-AOC-24G2', 'AOC', 3590000.00, 4290000.00, 16, NULL, 40, 4.60, 528, 1, 0, '[\"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80\"]', NULL, '[\"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(158, 6, 'Màn hình BenQ PD2705U 27\" 4K', 'monitor-benq-pd2705u', 'MON-BENQ-PD2705U', 'BenQ', 9990000.00, 11990000.00, 17, NULL, 10, 4.70, 92, 1, 0, '[\"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80\"]', NULL, '[\"Đồ hoạ\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(159, 6, 'Màn hình MSI G274QPF-QD 27\" 170Hz', 'monitor-msi-g274qpf-qd', 'MON-MSI-G274QPF', 'MSI', 8890000.00, 10490000.00, 15, NULL, 12, 4.70, 133, 0, 0, '[\"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(160, 6, 'Màn hình ViewSonic VX2428 24\" 180Hz', 'monitor-viewsonic-vx2428-24-180hz', 'MON-VS-VX2428', 'ViewSonic', 3290000.00, 3990000.00, 18, NULL, 32, 4.50, 205, 1, 0, '[\"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80\"]', NULL, '[\"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(161, 6, 'Màn hình Gigabyte M27Q 27\" 170Hz', 'monitor-gigabyte-m27q', 'MON-GB-M27Q', 'Gigabyte', 7990000.00, 9490000.00, 16, NULL, 11, 4.60, 168, 0, 0, '[\"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(162, 6, 'Màn hình Philips 272E1GAJ 27\" 144Hz', 'monitor-philips-272e1gaj', 'MON-PH-272E1GAJ', 'Philips', 4190000.00, 4990000.00, 16, NULL, 22, 4.50, 121, 1, 0, '[\"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80\"]', NULL, '[\"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(163, 7, 'Bàn phím cơ Keychron K8 Wireless', 'keyboard-keychron-k8-wireless', 'KB-KC-K8', 'Keychron', 1890000.00, 2190000.00, 14, NULL, 42, 4.70, 208, 1, 0, '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', NULL, '[\"Mới\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(164, 7, 'Bàn phím cơ Akko 3068B Plus', 'keyboard-akko-3068b-plus', 'KB-AKKO-3068B', 'Akko', 1590000.00, 1890000.00, 16, NULL, 35, 4.60, 179, 1, 0, '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', NULL, '[\"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(165, 7, 'Bàn phím Corsair K70 RGB MK.2', 'keyboard-corsair-k70-rgb-mk2', 'KB-CSR-K70MK2', 'Corsair', 2990000.00, 3490000.00, 14, NULL, 18, 4.60, 241, 0, 0, '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(166, 7, 'Bàn phím Razer Huntsman Mini', 'keyboard-razer-huntsman-mini', 'KB-RZ-HMNI', 'Razer', 2590000.00, 3090000.00, 16, NULL, 20, 4.70, 314, 0, 0, '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(167, 7, 'Bàn phím SteelSeries Apex Pro TKL', 'keyboard-steelseries-apex-pro-tkl', 'KB-SS-APEXPROTKL', 'SteelSeries', 4890000.00, 5590000.00, 13, NULL, 9, 4.80, 128, 0, 0, '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', NULL, '[\"Gaming\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(168, 7, 'Bàn phím Logitech MX Keys', 'keyboard-logitech-mx-keys', 'KB-LG-MXKEYS', 'Logitech', 2490000.00, 2890000.00, 14, NULL, 27, 4.70, 512, 1, 0, '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', NULL, '[\"Văn phòng\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(169, 7, 'Bàn phím HyperX Alloy Origins', 'keyboard-hyperx-alloy-origins', 'KB-HX-ALLOYORG', 'HyperX', 2390000.00, 2790000.00, 14, NULL, 16, 4.60, 203, 0, 0, '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(170, 7, 'Bàn phím Ducky One 2 Mini', 'keyboard-ducky-one-2-mini', 'KB-DUCKY-O2M', 'Ducky', 2690000.00, 3190000.00, 16, NULL, 12, 4.70, 154, 0, 0, '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(171, 7, 'Bàn phím Leopold FC750R', 'keyboard-leopold-fc750r', 'KB-LEO-FC750R', 'Leopold', 2890000.00, 3390000.00, 15, NULL, 10, 4.80, 96, 0, 0, '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', NULL, '[\"Văn phòng\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(172, 7, 'Bàn phím Aula F75 Wireless', 'keyboard-aula-f75-wireless', 'KB-AULA-F75', 'Aula', 1290000.00, 1590000.00, 19, NULL, 38, 4.50, 121, 1, 0, '[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80\"]', NULL, '[\"Freeship\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(173, 8, 'Chuột Logitech G Pro X Superlight', 'mouse-logitech-g-pro-x-superlight', 'MS-LG-GPXSL', 'Logitech', 2890000.00, 3290000.00, 12, NULL, 22, 4.80, 431, 0, 0, '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', NULL, '[\"Gaming\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(174, 8, 'Chuột Razer Viper V2 Pro', 'mouse-razer-viper-v2-pro', 'MS-RZ-VIPV2P', 'Razer', 3190000.00, 3590000.00, 11, NULL, 15, 4.70, 287, 0, 0, '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(175, 8, 'Chuột SteelSeries Rival 5', 'mouse-steelseries-rival-5', 'MS-SS-RIVAL5', 'SteelSeries', 1690000.00, 1990000.00, 15, NULL, 30, 4.60, 204, 0, 0, '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(176, 8, 'Chuột Corsair Harpoon RGB Pro', 'mouse-corsair-harpoon-rgb-pro', 'MS-CSR-HARPOON', 'Corsair', 690000.00, 890000.00, 22, NULL, 55, 4.50, 311, 1, 0, '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', NULL, '[\"Freeship\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(177, 8, 'Chuột Glorious Model O Wireless', 'mouse-glorious-model-o-wireless', 'MS-GLR-MOW', 'Glorious', 2290000.00, 2690000.00, 15, NULL, 20, 4.60, 188, 0, 0, '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(178, 8, 'Chuột Logitech MX Master 3S', 'mouse-logitech-mx-master-3s', 'MS-LG-MXM3S', 'Logitech', 2390000.00, 2790000.00, 14, NULL, 26, 4.80, 640, 1, 0, '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', NULL, '[\"Văn phòng\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(179, 8, 'Chuột Pulsar X2 Wireless', 'mouse-pulsar-x2-wireless', 'MS-PLS-X2', 'Pulsar', 2590000.00, 2990000.00, 13, NULL, 14, 4.60, 97, 0, 0, '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(180, 8, 'Chuột Zowie EC2-C', 'mouse-zowie-ec2-c', 'MS-ZW-EC2C', 'Zowie', 1990000.00, 2290000.00, 13, NULL, 18, 4.70, 122, 0, 0, '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(181, 8, 'Chuột Roccat Kone Pro Air', 'mouse-roccat-kone-pro-air', 'MS-RCC-KPA', 'Roccat', 2490000.00, 2990000.00, 17, NULL, 13, 4.60, 88, 0, 0, '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', NULL, '[\"Gaming\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(182, 8, 'Chuột ASUS ROG Chakram X', 'mouse-asus-rog-chakram-x', 'MS-AS-CHAKX', 'Asus', 2990000.00, 3490000.00, 14, NULL, 9, 4.50, 66, 0, 0, '[\"https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(183, 9, 'Tai nghe Bose QuietComfort 45', 'audio-bose-qc45', 'AU-BOSE-QC45', 'Bose', 6990000.00, 7990000.00, 13, NULL, 14, 4.70, 402, 1, 0, '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', NULL, '[\"Freeship\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(184, 9, 'Tai nghe Apple AirPods Pro (Gen 2)', 'audio-airpods-pro-gen2', 'AU-APPLE-APP2', 'Apple', 5990000.00, 6990000.00, 14, NULL, 20, 4.80, 912, 1, 0, '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', NULL, '[\"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(185, 9, 'Tai nghe SteelSeries Arctis Nova 7', 'audio-steelseries-arctis-nova-7', 'AU-SS-NOVA7', 'SteelSeries', 4290000.00, 4990000.00, 14, NULL, 18, 4.60, 233, 0, 0, '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(186, 9, 'Tai nghe HyperX Cloud II', 'audio-hyperx-cloud-ii', 'AU-HX-CLOUD2', 'HyperX', 1990000.00, 2390000.00, 17, NULL, 30, 4.60, 521, 0, 0, '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', NULL, '[\"Gaming\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(187, 9, 'Tai nghe Razer BlackShark V2 Pro', 'audio-razer-blackshark-v2-pro', 'AU-RZ-BSV2P', 'Razer', 3990000.00, 4590000.00, 13, NULL, 13, 4.50, 178, 0, 0, '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(188, 9, 'Tai nghe Logitech G733 Lightspeed', 'audio-logitech-g733', 'AU-LG-G733', 'Logitech', 2990000.00, 3490000.00, 14, NULL, 21, 4.60, 205, 0, 0, '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(189, 9, 'Tai nghe JBL Quantum 810 Wireless', 'audio-jbl-quantum-810', 'AU-JBL-Q810', 'JBL', 3490000.00, 4090000.00, 15, NULL, 16, 4.50, 122, 0, 0, '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', NULL, '[\"Gaming\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(190, 9, 'Tai nghe Sennheiser HD 560S', 'audio-sennheiser-hd560s', 'AU-SENN-HD560S', 'Sennheiser', 4490000.00, 5190000.00, 13, NULL, 11, 4.70, 97, 0, 0, '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', NULL, '[\"Hi-Fi\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(191, 9, 'Tai nghe Audio-Technica ATH-M50x', 'audio-audiotechnica-ath-m50x', 'AU-AT-M50X', 'Audio-Technica', 3290000.00, 3790000.00, 13, NULL, 15, 4.70, 163, 0, 0, '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', NULL, '[\"Studio\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(192, 9, 'Tai nghe Beats Studio3 Wireless', 'audio-beats-studio3', 'AU-BEATS-ST3', 'Beats', 4990000.00, 5990000.00, 17, NULL, 9, 4.50, 141, 1, 0, '[\"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80\"]', NULL, '[\"Freeship\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(193, 10, 'SSD WD Black SN850X 1TB NVMe', 'storage-wd-sn850x-1tb', 'ST-WD-SN850X-1T', 'WesternDigital', 2390000.00, 2890000.00, 17, NULL, 28, 4.80, 311, 1, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Freeship\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(194, 10, 'SSD Crucial P3 Plus 1TB NVMe', 'storage-crucial-p3-plus-1tb', 'ST-CR-P3P-1T', 'Crucial', 1790000.00, 2190000.00, 18, NULL, 34, 4.60, 205, 1, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(195, 10, 'SSD Kingston NV2 1TB NVMe', 'storage-kingston-nv2-1tb', 'ST-KS-NV2-1T', 'Kingston', 1590000.00, 1990000.00, 20, NULL, 40, 4.50, 188, 1, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Giảm giá\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(196, 10, 'SSD Samsung 980 PRO 2TB NVMe', 'storage-samsung-980-pro-2tb', 'ST-SS-980P-2T', 'Samsung', 4490000.00, 5290000.00, 15, NULL, 18, 4.80, 274, 1, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(197, 10, 'HDD Seagate BarraCuda 2TB', 'storage-seagate-barracuda-2tb', 'ST-SG-BC-2T', 'Seagate', 1490000.00, 1790000.00, 17, NULL, 45, 4.50, 196, 0, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(198, 10, 'Ổ cứng gắn ngoài WD My Passport 2TB', 'storage-wd-my-passport-2tb', 'ST-WD-MP-2T', 'WesternDigital', 1890000.00, 2290000.00, 17, NULL, 25, 4.60, 233, 1, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(199, 10, 'SSD gắn ngoài SanDisk Extreme 1TB', 'storage-sandisk-extreme-1tb', 'ST-SD-EXT-1T', 'SanDisk', 2590000.00, 3090000.00, 16, NULL, 14, 4.70, 177, 1, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Freeship\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(200, 10, 'Thẻ nhớ microSD Samsung EVO Plus 256GB', 'storage-samsung-evo-plus-256gb', 'ST-SS-EVO-256', 'Samsung', 590000.00, 790000.00, 25, NULL, 60, 4.60, 521, 1, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Giảm giá\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(201, 10, 'USB Kingston DataTraveler 128GB', 'storage-kingston-datatraveler-128gb', 'ST-KS-DT-128', 'Kingston', 190000.00, 290000.00, 34, NULL, 80, 4.40, 301, 1, 0, '[\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80\"]', NULL, '[\"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(202, 10, 'Ổ cứng NAS Synology DS223j (2-bay)', 'storage-synology-ds223j', 'ST-SY-DS223J', 'Synology', 5990000.00, 6990000.00, 14, NULL, 9, 4.60, 84, 0, 0, '[\"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1200&q=80\"]', NULL, '[\"Lưu trữ\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(203, 11, 'Router TP-Link Archer AX55 WiFi 6', 'network-tplink-archer-ax55', 'NW-TPL-AX55', 'TP-Link', 1690000.00, 1990000.00, 15, NULL, 40, 4.60, 412, 1, 0, '[\"https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=80\"]', NULL, '[\"Freeship\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(204, 11, 'Router ASUS RT-AX58U WiFi 6', 'network-asus-rt-ax58u', 'NW-AS-AX58U', 'Asus', 2290000.00, 2690000.00, 15, NULL, 22, 4.60, 233, 0, 0, '[\"https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=80\"]', NULL, '[\"WiFi 6\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(205, 11, 'Mesh WiFi TP-Link Deco X20 (2-pack)', 'network-tplink-deco-x20-2pack', 'NW-TPL-DX20-2', 'TP-Link', 2690000.00, 3190000.00, 16, NULL, 15, 4.70, 198, 0, 0, '[\"https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=80\"]', NULL, '[\"Mesh\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(206, 11, 'Google Nest Wifi (Router)', 'network-google-nest-wifi', 'NW-GG-NEST', 'Google', 2890000.00, 3390000.00, 15, NULL, 10, 4.50, 144, 0, 0, '[\"https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=80\"]', NULL, '[\"Mesh\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(207, 11, 'Access Point Ubiquiti UniFi U6+', 'network-ubiquiti-unifi-u6-plus', 'NW-UB-U6P', 'Ubiquiti', 3290000.00, 3790000.00, 13, NULL, 12, 4.70, 77, 0, 0, '[\"https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=80\"]', NULL, '[\"Doanh nghiệp\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(208, 11, 'Switch Netgear 8-Port Gigabit', 'network-netgear-switch-8port', 'NW-NG-SW8', 'Netgear', 690000.00, 890000.00, 22, NULL, 35, 4.50, 209, 1, 0, '[\"https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=80\"]', NULL, '[\"Freeship\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(209, 11, 'Router Xiaomi AX3000', 'network-xiaomi-ax3000', 'NW-MI-AX3000', 'Xiaomi', 990000.00, 1290000.00, 23, NULL, 28, 4.40, 188, 1, 0, '[\"https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=80\"]', NULL, '[\"Giảm giá\", \"WiFi 6\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(210, 11, 'Router Mercusys MR80X WiFi 6', 'network-mercusys-mr80x', 'NW-MC-MR80X', 'Mercusys', 890000.00, 1190000.00, 25, NULL, 32, 4.40, 143, 1, 0, '[\"https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=80\"]', NULL, '[\"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(211, 11, 'Mesh WiFi Tenda Nova MW6 (3-pack)', 'network-tenda-nova-mw6-3pack', 'NW-TD-MW6-3', 'Tenda', 1990000.00, 2390000.00, 17, NULL, 14, 4.40, 121, 0, 0, '[\"https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=80\"]', NULL, '[\"Mesh\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(212, 11, 'Router D-Link DIR-X1860', 'network-dlink-dir-x1860', 'NW-DL-X1860', 'D-Link', 1090000.00, 1390000.00, 22, NULL, 26, 4.30, 97, 1, 0, '[\"https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=80\"]', NULL, '[\"Giảm giá\", \"Freeship\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(213, 12, 'Ghế gaming Secretlab TITAN Evo', 'chair-secretlab-titan-evo', 'CH-SE-TITAN', 'Secretlab', 12990000.00, 14990000.00, 13, NULL, 6, 4.80, 156, 0, 0, '[\"https://images.unsplash.com/photo-1598300053652-0b4f1d3f3d5e?w=1200&q=80\"]', NULL, '[\"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(214, 12, 'Ghế gaming DXRacer Formula', 'chair-dxracer-formula', 'CH-DX-FORM', 'DXRacer', 5990000.00, 6990000.00, 14, NULL, 12, 4.50, 201, 0, 0, '[\"https://images.unsplash.com/photo-1598300053652-0b4f1d3f3d5e?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(215, 12, 'Ghế công thái học IKEA MARKUS', 'chair-ikea-markus', 'CH-IK-MARKUS', 'IKEA', 3490000.00, 3990000.00, 13, NULL, 18, 4.60, 312, 0, 0, '[\"https://images.unsplash.com/photo-1598300053652-0b4f1d3f3d5e?w=1200&q=80\"]', NULL, '[\"Văn phòng\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(216, 12, 'Ghế công thái học Sihoo M57', 'chair-sihoo-m57', 'CH-SH-M57', 'Sihoo', 4290000.00, 4990000.00, 14, NULL, 15, 4.60, 224, 0, 0, '[\"https://images.unsplash.com/photo-1598300053652-0b4f1d3f3d5e?w=1200&q=80\"]', NULL, '[\"Văn phòng\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(217, 12, 'Ghế công thái học Ergonomic Pro Mesh', 'chair-ergonomic-pro-mesh', 'CH-ER-PROMESH', 'TechStore', 2990000.00, 3590000.00, 17, NULL, 20, 4.40, 133, 0, 0, '[\"https://images.unsplash.com/photo-1598300053652-0b4f1d3f3d5e?w=1200&q=80\"]', NULL, '[\"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(218, 12, 'Ghế gaming AndaSeat Kaiser 3', 'chair-andaseat-kaiser-3', 'CH-AS-K3', 'AndaSeat', 8990000.00, 10490000.00, 14, NULL, 8, 4.60, 97, 0, 0, '[\"https://images.unsplash.com/photo-1598300053652-0b4f1d3f3d5e?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(219, 12, 'Ghế gaming Cougar Armor One', 'chair-cougar-armor-one', 'CH-CG-ARM1', 'Cougar', 4990000.00, 5890000.00, 15, NULL, 10, 4.50, 121, 0, 0, '[\"https://images.unsplash.com/photo-1598300053652-0b4f1d3f3d5e?w=1200&q=80\"]', NULL, '[\"Gaming\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(220, 12, 'Ghế công thái học FlexiSpot OC3', 'chair-flexispot-oc3', 'CH-FS-OC3', 'FlexiSpot', 4590000.00, 5290000.00, 13, NULL, 14, 4.50, 89, 0, 0, '[\"https://images.unsplash.com/photo-1598300053652-0b4f1d3f3d5e?w=1200&q=80\"]', NULL, '[\"Văn phòng\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(221, 12, 'Ghế gaming Razer Iskur', 'chair-razer-iskur', 'CH-RZ-ISKUR', 'Razer', 10990000.00, 12990000.00, 15, NULL, 5, 4.60, 74, 0, 0, '[\"https://images.unsplash.com/photo-1598300053652-0b4f1d3f3d5e?w=1200&q=80\"]', NULL, '[\"Gaming\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441'),
(222, 12, 'Ghế gaming noblechairs HERO', 'chair-noblechairs-hero', 'CH-NC-HERO', 'noblechairs', 9990000.00, 11990000.00, 17, NULL, 6, 4.70, 58, 0, 0, '[\"https://images.unsplash.com/photo-1598300053652-0b4f1d3f3d5e?w=1200&q=80\"]', NULL, '[\"Gaming\", \"Giảm giá\"]', NULL, 'active', '2025-12-25 02:25:39.441', '2025-12-25 02:25:39.441');

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` enum('voucher','flash_sale') NOT NULL,
  `title` varchar(160) NOT NULL,
  `code` varchar(40) DEFAULT NULL,
  `discountType` enum('amount','percent') DEFAULT NULL,
  `discountValue` decimal(15,2) DEFAULT NULL,
  `minOrderAmount` decimal(15,2) DEFAULT 0.00,
  `startsAt` datetime(3) DEFAULT NULL,
  `endsAt` datetime(3) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promotions`
--

INSERT INTO `promotions` (`id`, `type`, `title`, `code`, `discountType`, `discountValue`, `minOrderAmount`, `startsAt`, `endsAt`, `isActive`, `data`, `createdAt`, `updatedAt`) VALUES
(1, 'voucher', 'Voucher Laptop 1', 'TECH500', 'amount', 500000.00, 30000000.00, '2025-12-24 17:00:00.000', '2025-12-31 16:59:00.000', 1, '{\"color\":\"#0B63F6\",\"tag\":\"Laptop\",\"meta\":\"Đơn từ 30 triệu\",\"expText\":\"HSD: 31/12/2024\",\"category\":\"laptop\"}', '2025-12-24 13:33:49.027', '2026-01-06 23:37:31.000'),
(2, 'voucher', 'Voucher PC', 'PC10', 'percent', 10.00, 5000000.00, '2025-12-25 00:00:00.000', '2025-12-25 23:59:59.000', 1, '{\"color\": \"#7C3AED\", \"tag\": \"PC\", \"meta\": \"Đơn từ 5 triệu\", \"expText\": \"HSD: 25/12/2024\", \"category\": \"pc\"}', '2025-12-24 13:33:49.027', '2025-12-25 18:56:19.810'),
(3, 'voucher', 'Voucher Phụ kiện', 'ACC200', 'amount', 200000.00, 2000000.00, '2025-12-25 00:00:00.000', '2025-12-20 23:59:59.000', 1, '{\"color\": \"#0EA5E9\", \"tag\": \"Phụ kiện\", \"meta\": \"Đơn từ 2 triệu\", \"expText\": \"HSD: 20/12/2024\", \"category\": \"accessory\"}', '2025-12-24 13:33:49.027', '2025-12-25 18:56:23.091'),
(4, 'flash_sale', 'FLASH SALE', NULL, NULL, NULL, NULL, '2025-12-25 00:00:00.000', '2025-12-31 23:59:59.000', 1, '{\"timer\": \"02:45:30\"}', '2025-12-24 13:33:49.027', '2025-12-25 18:56:27.594'),
(5, 'voucher', 'test', 'RMVRY', 'amount', 1000.00, 100000.00, '2026-01-06 23:48:00.000', '2026-01-11 23:48:00.000', 0, NULL, '2026-01-06 23:48:37.000', '2026-01-06 23:48:48.000');

-- --------------------------------------------------------

--
-- Table structure for table `promotion_items`
--

CREATE TABLE `promotion_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `promotionId` bigint(20) UNSIGNED NOT NULL,
  `productId` bigint(20) UNSIGNED NOT NULL,
  `discountPct` int(11) NOT NULL DEFAULT 0,
  `stockLimit` int(11) DEFAULT NULL,
  `soldCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promotion_items`
--

INSERT INTO `promotion_items` (`id`, `promotionId`, `productId`, `discountPct`, `stockLimit`, `soldCount`, `createdAt`, `updatedAt`) VALUES
(1, 4, 2, 35, 12, 8, '2025-12-24 13:33:49.046', '2025-12-24 13:33:49.046'),
(2, 4, 3, 40, 20, 17, '2025-12-24 13:33:49.046', '2025-12-24 13:33:49.046'),
(3, 4, 4, 30, 36, 19, '2025-12-24 13:33:49.046', '2025-12-24 13:33:49.046');

-- --------------------------------------------------------

--
-- Table structure for table `search_terms`
--

CREATE TABLE `search_terms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `userId` bigint(20) UNSIGNED DEFAULT NULL,
  `scope` enum('trend','recent') NOT NULL,
  `term` varchar(160) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `search_terms`
--

INSERT INTO `search_terms` (`id`, `userId`, `scope`, `term`, `createdAt`, `updatedAt`) VALUES
(1, NULL, 'trend', 'MacBook Air M2', '2025-12-24 13:33:49.068', '2025-12-24 13:33:49.068'),
(2, NULL, 'trend', 'RTX 4070 laptop', '2025-12-24 13:33:49.068', '2025-12-24 13:33:49.068'),
(3, NULL, 'trend', 'Gaming gear', '2025-12-24 13:33:49.068', '2025-12-24 13:33:49.068'),
(4, NULL, 'trend', 'Laptop văn phòng', '2025-12-24 13:33:49.068', '2025-12-24 13:33:49.068'),
(5, NULL, 'trend', 'PC build 2024', '2025-12-24 13:33:49.068', '2025-12-24 13:33:49.068'),
(6, 1, 'recent', 'laptop gaming', '2025-12-24 13:33:49.092', '2025-12-24 13:33:49.092'),
(7, 1, 'recent', 'chuột không dây', '2025-12-24 13:33:49.092', '2025-12-24 13:33:49.092'),
(8, 1, 'recent', 'bàn phím cơ', '2025-12-24 13:33:49.092', '2025-12-24 13:33:49.092'),
(13, 2, 'recent', 'laptop', '2025-12-25 12:09:16.000', '2025-12-25 12:09:16.000'),
(14, 2, 'recent', 'PC build 2024', '2025-12-25 12:21:32.000', '2025-12-25 12:21:32.000');

-- --------------------------------------------------------

--
-- Table structure for table `shipping_methods`
--

CREATE TABLE `shipping_methods` (
  `id` bigint(20) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('DELIVERY','PICKUP') NOT NULL,
  `base_fee` int(11) NOT NULL DEFAULT 0,
  `eta_text` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipping_methods`
--

INSERT INTO `shipping_methods` (`id`, `code`, `name`, `type`, `base_fee`, `eta_text`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'standard', 'Giao hàng tiêu chuẩn', 'DELIVERY', 30000, 'Giao trong vòng 3 ngày', 1, 1, '2026-01-09 08:14:16', '2026-01-09 08:39:05'),
(2, 'fast', 'Giao hàng nhanh (24h)', 'DELIVERY', 50000, 'Giao trong vòng 24h', 1, 2, '2026-01-09 08:14:16', '2026-01-09 08:39:19'),
(3, 'store', 'Nhận tại cửa hàng', 'PICKUP', 0, 'Sẵn sàng sau 2 giờ', 1, 3, '2026-01-09 08:14:16', '2026-01-09 08:39:22'),
(4, 'sieutochn', 'Siêu tốc promax Hà Nội', 'DELIVERY', 80000, 'Giao trong vòng 4h', 1, 4, '2026-01-09 08:35:37', '2026-01-09 08:39:24'),
(5, 'giao-hang-cham', 'Giao hàng chậm', 'DELIVERY', 0, 'Giao trong vòng 10 ngày', 1, 0, '2026-01-09 08:40:39', '2026-01-09 08:40:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fullName` varchar(120) DEFAULT NULL,
  `email` varchar(190) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `status` enum('active','inactive','blocked') NOT NULL DEFAULT 'active',
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer',
  `avatarUrl` varchar(512) DEFAULT NULL,
  `lastLoginAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `email`, `phone`, `passwordHash`, `status`, `role`, `avatarUrl`, `lastLoginAt`, `createdAt`, `updatedAt`) VALUES
(1, 'QTV', 'admin@admin.com', '0912345678', '$2b$10$us3uVT6y7erBPZpP6Fsbiuyfq/cDN1w953UuemuVdgSinKUR9I.2e', 'active', 'admin', NULL, NULL, '2025-12-24 13:33:48.900', '2026-01-06 22:08:27.486'),
(2, 'Nguyễn Văn An', 'nguyenvana@gmail.com', '0555666777', '$2b$10$us3uVT6y7erBPZpP6Fsbiuyfq/cDN1w953UuemuVdgSinKUR9I.2e', 'active', 'customer', NULL, '2026-01-09 15:22:35.929', '2025-12-24 15:57:17.000', '2026-01-09 15:22:35.000');

-- --------------------------------------------------------

--
-- Table structure for table `user_product_events`
--

CREATE TABLE `user_product_events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `productId` bigint(20) UNSIGNED NOT NULL,
  `type` enum('favorite','recent') NOT NULL,
  `lastSeenAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_addresses_user` (`userId`),
  ADD KEY `idx_addresses_default` (`userId`,`isDefault`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_cart_user_product` (`userId`,`productId`),
  ADD KEY `idx_cart_user` (`userId`),
  ADD KEY `idx_cart_product` (`productId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_categories_slug` (`slug`),
  ADD KEY `idx_categories_parent` (`parentId`),
  ADD KEY `idx_categories_active` (`isActive`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notif_user` (`userId`),
  ADD KEY `idx_notif_read` (`userId`,`isRead`),
  ADD KEY `idx_notif_created` (`createdAt`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_orders_code` (`code`),
  ADD KEY `idx_orders_user` (`userId`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_created` (`createdAt`),
  ADD KEY `fk_orders_address` (`addressId`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_items_order` (`orderId`),
  ADD KEY `idx_order_items_product` (`productId`);

--
-- Indexes for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_osh_order` (`orderId`),
  ADD KEY `idx_osh_time` (`happenedAt`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_products_sku` (`sku`),
  ADD UNIQUE KEY `uk_products_slug` (`slug`),
  ADD KEY `idx_products_category` (`categoryId`),
  ADD KEY `idx_products_status` (`status`),
  ADD KEY `idx_products_price` (`price`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_promotions_code` (`code`),
  ADD KEY `idx_promotions_type` (`type`),
  ADD KEY `idx_promotions_active` (`isActive`),
  ADD KEY `idx_promotions_time` (`startsAt`,`endsAt`);

--
-- Indexes for table `promotion_items`
--
ALTER TABLE `promotion_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_promo_product` (`promotionId`,`productId`),
  ADD KEY `idx_promo_items_promo` (`promotionId`),
  ADD KEY `idx_promo_items_product` (`productId`);

--
-- Indexes for table `search_terms`
--
ALTER TABLE `search_terms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_search_terms` (`userId`,`scope`,`term`),
  ADD KEY `idx_search_scope` (`scope`),
  ADD KEY `idx_search_user` (`userId`);

--
-- Indexes for table `shipping_methods`
--
ALTER TABLE `shipping_methods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_users_email` (`email`),
  ADD UNIQUE KEY `uk_users_phone` (`phone`),
  ADD KEY `idx_users_status` (`status`),
  ADD KEY `idx_users_role` (`role`);

--
-- Indexes for table `user_product_events`
--
ALTER TABLE `user_product_events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_upe` (`userId`,`productId`,`type`),
  ADD KEY `idx_upe_user` (`userId`),
  ADD KEY `idx_upe_type` (`type`),
  ADD KEY `idx_upe_seen` (`lastSeenAt`),
  ADD KEY `fk_upe_product` (`productId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `order_status_history`
--
ALTER TABLE `order_status_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=223;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `promotion_items`
--
ALTER TABLE `promotion_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `search_terms`
--
ALTER TABLE `search_terms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `shipping_methods`
--
ALTER TABLE `shipping_methods`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_product_events`
--
ALTER TABLE `user_product_events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `fk_addresses_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_cart_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parentId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notif_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_address` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_items_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `fk_osh_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `promotion_items`
--
ALTER TABLE `promotion_items`
  ADD CONSTRAINT `fk_promo_items_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_promo_items_promo` FOREIGN KEY (`promotionId`) REFERENCES `promotions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `search_terms`
--
ALTER TABLE `search_terms`
  ADD CONSTRAINT `fk_search_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_product_events`
--
ALTER TABLE `user_product_events`
  ADD CONSTRAINT `fk_upe_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_upe_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
