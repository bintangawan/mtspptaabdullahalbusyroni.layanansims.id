-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 30, 2026 at 10:16 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mtsppta_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `scope_type` enum('global','section','role') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'global',
  `scope_id` bigint UNSIGNED DEFAULT NULL,
  `role_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` bigint UNSIGNED NOT NULL,
  `section_id` bigint UNSIGNED NOT NULL,
  `judul` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipe` enum('file','teks','link','campuran') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'file',
  `deadline` datetime NOT NULL,
  `rubrik_json` json DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` bigint UNSIGNED NOT NULL,
  `section_id` bigint UNSIGNED NOT NULL,
  `pertemuan_ke` smallint UNSIGNED NOT NULL,
  `tanggal` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_details`
--

CREATE TABLE `attendance_details` (
  `id` bigint UNSIGNED NOT NULL,
  `attendance_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `status` enum('hadir','izin','sakit','alpha') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hadir',
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('mts_ppta_abdullah_al_busyroni_cache_spatie.permission.cache', 'a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:36:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:14:\"view-dashboard\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:18:\"manage-master-data\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:12:\"manage-terms\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:3;a:4:{s:1:\"a\";i:4;s:1:\"b\";s:15:\"manage-subjects\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:12:\"manage-users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:5;a:4:{s:1:\"a\";i:6;s:1:\"b\";s:12:\"assign-roles\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:6;a:4:{s:1:\"a\";i:7;s:1:\"b\";s:12:\"import-users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:7;a:4:{s:1:\"a\";i:8;s:1:\"b\";s:13:\"view-sections\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:8;a:4:{s:1:\"a\";i:9;s:1:\"b\";s:15:\"manage-sections\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:9;a:4:{s:1:\"a\";i:10;s:1:\"b\";s:21:\"view-section-students\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:10;a:4:{s:1:\"a\";i:11;s:1:\"b\";s:23:\"manage-section-students\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:11;a:4:{s:1:\"a\";i:12;s:1:\"b\";s:14:\"view-materials\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:12;a:4:{s:1:\"a\";i:13;s:1:\"b\";s:16:\"create-materials\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:13;a:4:{s:1:\"a\";i:14;s:1:\"b\";s:14:\"edit-materials\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:14;a:4:{s:1:\"a\";i:15;s:1:\"b\";s:16:\"delete-materials\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:15;a:4:{s:1:\"a\";i:16;s:1:\"b\";s:16:\"view-assignments\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:16;a:4:{s:1:\"a\";i:17;s:1:\"b\";s:18:\"create-assignments\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:17;a:4:{s:1:\"a\";i:18;s:1:\"b\";s:16:\"edit-assignments\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:18;a:4:{s:1:\"a\";i:19;s:1:\"b\";s:18:\"delete-assignments\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:19;a:4:{s:1:\"a\";i:20;s:1:\"b\";s:18:\"submit-assignments\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:20;a:4:{s:1:\"a\";i:21;s:1:\"b\";s:11:\"view-grades\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:21;a:4:{s:1:\"a\";i:22;s:1:\"b\";s:13:\"manage-grades\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:22;a:4:{s:1:\"a\";i:23;s:1:\"b\";s:15:\"view-own-grades\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:23;a:4:{s:1:\"a\";i:24;s:1:\"b\";s:15:\"view-attendance\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:24;a:4:{s:1:\"a\";i:25;s:1:\"b\";s:17:\"manage-attendance\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:25;a:4:{s:1:\"a\";i:26;s:1:\"b\";s:19:\"view-own-attendance\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:26;a:4:{s:1:\"a\";i:27;s:1:\"b\";s:18:\"view-announcements\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:27;a:4:{s:1:\"a\";i:28;s:1:\"b\";s:20:\"create-announcements\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:28;a:4:{s:1:\"a\";i:29;s:1:\"b\";s:18:\"edit-announcements\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:29;a:4:{s:1:\"a\";i:30;s:1:\"b\";s:20:\"delete-announcements\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:30;a:4:{s:1:\"a\";i:31;s:1:\"b\";s:12:\"view-reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:31;a:4:{s:1:\"a\";i:32;s:1:\"b\";s:14:\"export-reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:32;a:4:{s:1:\"a\";i:33;s:1:\"b\";s:11:\"use-chatbot\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:33;a:4:{s:1:\"a\";i:34;s:1:\"b\";s:21:\"manage-chatbot-config\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:34;a:4:{s:1:\"a\";i:35;s:1:\"b\";s:13:\"view-schedule\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:35;a:4:{s:1:\"a\";i:36;s:1:\"b\";s:15:\"manage-schedule\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}}s:5:\"roles\";a:3:{i:0;a:3:{s:1:\"a\";i:1;s:1:\"b\";s:5:\"admin\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:4:\"guru\";s:1:\"c\";s:3:\"web\";}i:2;a:3:{s:1:\"a\";i:3;s:1:\"b\";s:5:\"siswa\";s:1:\"c\";s:3:\"web\";}}}', 1769854317);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_configs`
--

CREATE TABLE `chat_configs` (
  `id` bigint UNSIGNED NOT NULL,
  `key` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value_json` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` bigint UNSIGNED NOT NULL,
  `sender` enum('user','bot') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_json` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_sessions`
--

CREATE TABLE `chat_sessions` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source` enum('landing','siswa','guru','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'landing',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `id` bigint UNSIGNED NOT NULL,
  `section_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `komponen` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `skor` decimal(5,2) NOT NULL,
  `bobot` decimal(5,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `guru_profiles`
--

CREATE TABLE `guru_profiles` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `nidn` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nuptk` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mapel_keahlian` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telepon` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `guru_profiles`
--

INSERT INTO `guru_profiles` (`id`, `user_id`, `nidn`, `nuptk`, `mapel_keahlian`, `telepon`, `created_at`, `updated_at`) VALUES
(26, 132, '0001', '0001', 'Matematika', '0001', '2026-01-30 03:15:52', '2026-01-30 03:15:52');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

CREATE TABLE `materials` (
  `id` bigint UNSIGNED NOT NULL,
  `section_id` bigint UNSIGNED NOT NULL,
  `judul` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_09_08_100144_create_permission_tables', 1),
(5, '2025_09_08_100158_create_notifications_table', 1),
(6, '2025_09_08_125428_create_siswa_profiles_table', 1),
(7, '2025_09_08_125429_create_guru_profiles_table', 1),
(8, '2025_09_08_125430_create_terms_table', 1),
(9, '2025_09_08_125431_create_subjects_table', 1),
(10, '2025_09_08_125432_create_sections_table', 1),
(11, '2025_09_08_125433_create_section_students_table', 1),
(12, '2025_09_08_125434_create_materials_table', 1),
(13, '2025_09_08_125435_create_assignments_table', 1),
(14, '2025_09_08_125436_create_submissions_table', 1),
(15, '2025_09_08_125437_create_attendances_table', 1),
(16, '2025_09_08_125438_create_attendance_details_table', 1),
(17, '2025_09_08_125439_create_grades_table', 1),
(18, '2025_09_08_125440_create_announcements_table', 1),
(19, '2025_09_08_125441_create_chat_sessions_table', 1),
(20, '2025_09_08_125442_create_chat_messages_table', 1),
(21, '2025_09_08_125443_create_chat_configs_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(1, 'App\\Models\\User', 120),
(3, 'App\\Models\\User', 131),
(2, 'App\\Models\\User', 132);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'view-dashboard', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(2, 'manage-master-data', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(3, 'manage-terms', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(4, 'manage-subjects', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(5, 'manage-users', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(6, 'assign-roles', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(7, 'import-users', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(8, 'view-sections', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(9, 'manage-sections', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(10, 'view-section-students', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(11, 'manage-section-students', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(12, 'view-materials', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(13, 'create-materials', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(14, 'edit-materials', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(15, 'delete-materials', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(16, 'view-assignments', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(17, 'create-assignments', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(18, 'edit-assignments', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(19, 'delete-assignments', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(20, 'submit-assignments', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(21, 'view-grades', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(22, 'manage-grades', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(23, 'view-own-grades', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(24, 'view-attendance', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(25, 'manage-attendance', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(26, 'view-own-attendance', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(27, 'view-announcements', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(28, 'create-announcements', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(29, 'edit-announcements', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(30, 'delete-announcements', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(31, 'view-reports', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(32, 'export-reports', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(33, 'use-chatbot', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(34, 'manage-chatbot-config', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(35, 'view-schedule', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(36, 'manage-schedule', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `author_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `slug`, `content`, `tags`, `image`, `is_published`, `author_id`, `created_at`, `updated_at`) VALUES
(1, 'HARI SANTRI NASIONAL 2025', 'hari-santri-nasional-2025-C6gO8', '<p class=\"ql-align-center\">[HARI&nbsp;SANTRI&nbsp;NASIONAL&nbsp;2025]</p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\">“Mengawal&nbsp;Indonesia&nbsp;Merdeka&nbsp;Menuju&nbsp;Peradaban&nbsp;Dunia”</p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\">Selamat&nbsp;Hari&nbsp;Santri&nbsp;2025!</p><p class=\"ql-align-center\">Santri&nbsp;bukan&nbsp;hanya&nbsp;penjaga&nbsp;nilai-nilai&nbsp;agama,&nbsp;tapi&nbsp;juga&nbsp;garda&nbsp;terdepan&nbsp;dalam&nbsp;membangun&nbsp;bangsa&nbsp;dan&nbsp;peradaban&nbsp;dunia</p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\">Semoga&nbsp;semangat&nbsp;juang,&nbsp;keikhlasan,&nbsp;dan&nbsp;keteguhan&nbsp;para&nbsp;santri&nbsp;terus&nbsp;menjadi&nbsp;inspirasi&nbsp;untuk&nbsp;Indonesia&nbsp;yang&nbsp;lebih&nbsp;beradab&nbsp;dan&nbsp;bermartabat</p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\">Info&nbsp;terkait&nbsp;PPDB&nbsp;PPTA&nbsp;Abdullah&nbsp;Al&nbsp;Busyroni&nbsp;|&nbsp;WhatsApp&nbsp;:&nbsp;085275279289</p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\">—</p><p class=\"ql-align-center\">Jl.&nbsp;Bedagai&nbsp;Dusun&nbsp;VIII,&nbsp;Kec.&nbsp;Sei&nbsp;Rampah,&nbsp;Kab.&nbsp;Serdang&nbsp;Bedagai,&nbsp;Prov.&nbsp;Sumatera&nbsp;Utara.</p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\">Instagram&nbsp;:&nbsp;ponpes.abdullahalbusyroni</p><p class=\"ql-align-center\">Facebook&nbsp;:&nbsp;ponpes.abdullahalbusyroni</p><p class=\"ql-align-center\">Tiktok&nbsp;:&nbsp;ponpesabdullahalbusyroni</p><p class=\"ql-align-center\">Youtube&nbsp;:&nbsp;PPTA&nbsp;Abdullah&nbsp;Al&nbsp;Busyroni</p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\"></p>', '#PPDB2026, #PPTAAbdullahAlBusyroni, #SantriBerilmu, #SantriBerakhlak, #PesantrenDigital, #PesantrenSehat, #PesantrenRamahAnak, #sekolahpencetakhafizh', 'posts/YmS4DoGIqF1rspjwS8fzgg0a3QoFoV60o7VWDL5x.jpg', 1, 1, '2026-01-29 06:36:48', '2026-01-29 08:25:38'),
(2, 'PPTA Abdullah Al Busyroni : Prestasi PPTA Abdullah Al Busyroni dalam Kejuaraan Open Competition', 'ppta-abdullah-al-busyroni-prestasi-ppta-abdullah-al-busyroni-dalam-kejuaraan-open-competition-m2gna', '<p><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Barakallah&nbsp;kami&nbsp;ucapkan&nbsp;selamat&nbsp;kepada&nbsp;perwakilan&nbsp;PPTA&nbsp;Abdullah&nbsp;Al&nbsp;Busyroni&nbsp;dalam&nbsp;Kejuaraan&nbsp;Pencak&nbsp;Silat&nbsp;Riau&nbsp;Open&nbsp;Competition&nbsp;untuk&nbsp;memperebutkan&nbsp;Piala&nbsp;Kadispora&nbsp;Riau&nbsp;yang&nbsp;di&nbsp;selenggarakan&nbsp;pada&nbsp;tanggal&nbsp;25-27&nbsp;Januari&nbsp;2025.✨</span></p><p></p><p class=\"ql-align-justify\"><span style=\"color: rgb(0, 0, 0); background-color: white;\">Harapannya&nbsp;semoga&nbsp;ananda&nbsp;dapat&nbsp;terus&nbsp;meningkatkan&nbsp;prestasi&nbsp;untuk&nbsp;kedepannya,&nbsp;dapat&nbsp;membanggakan&nbsp;orang&nbsp;tua,&nbsp;sekolah&nbsp;dan&nbsp;masyarakat.</span></p><p class=\"ql-align-justify\"></p><p class=\"ql-align-justify\"><span style=\"color: rgb(0, 0, 0); background-color: white;\">Semoga&nbsp;ini&nbsp;juga&nbsp;dapat&nbsp;memotivasi&nbsp;seluruh&nbsp;siswa-siswi&nbsp;untuk&nbsp;dapat&nbsp;berprestasi&nbsp;di&nbsp;sekolah&nbsp;maupun&nbsp;di&nbsp;luar&nbsp;sekolah.&nbsp;Aamiinn.</span></p><p class=\"ql-align-justify\"></p><p class=\"ql-align-justify\"><span style=\"color: rgb(0, 0, 0); background-color: white;\">Terima&nbsp;kasih,</span></p><p class=\"ql-align-justify\"><span style=\"color: rgb(0, 0, 0); background-color: white;\">PPTA&nbsp;Abdullah&nbsp;Al&nbsp;Busyroni</span></p><p class=\"ql-align-justify\"></p><p class=\"ql-align-justify\"><span style=\"color: rgb(0, 0, 0); background-color: white;\">—</span></p><p class=\"ql-align-justify\"><span style=\"color: rgb(0, 0, 0); background-color: white;\">Jl.&nbsp;Bedagai&nbsp;Dusun&nbsp;VIII,&nbsp;Kec.&nbsp;Sei&nbsp;Rampah,&nbsp;Kab.&nbsp;Serdang&nbsp;Bedagai,&nbsp;Prov.&nbsp;Sumatera&nbsp;Utara.</span></p><p class=\"ql-align-justify\"></p><p class=\"ql-align-justify\"><span style=\"color: rgb(0, 0, 0); background-color: white;\">Instagram&nbsp;:&nbsp;ponpes.abdullahalbusyroni</span></p><p class=\"ql-align-justify\"><span style=\"color: rgb(0, 0, 0); background-color: white;\">Facebook&nbsp;:&nbsp;ponpes.abdullahalbusyroni</span></p><p class=\"ql-align-justify\"><span style=\"color: rgb(0, 0, 0); background-color: white;\">Tiktok&nbsp;:&nbsp;ponpesabdullahalbusyroni</span></p><p class=\"ql-align-justify\"><span style=\"color: rgb(0, 0, 0); background-color: white;\">Youtube&nbsp;:&nbsp;PPTA&nbsp;Abdullah&nbsp;Al&nbsp;Busyroni</span></p><p class=\"ql-align-justify\"><span style=\"background-color: white; color: rgb(0, 0, 0);\">&nbsp;&nbsp;&nbsp;</span></p><p><span style=\"color: rgb(0, 0, 0); background-color: white;\">Info&nbsp;terkait&nbsp;PPDB&nbsp;PPTA&nbsp;Abdullah&nbsp;Al&nbsp;Busyroni:</span></p><p class=\"ql-align-justify\"><span style=\"color: rgb(0, 0, 0); background-color: white;\">Muallimah&nbsp;Vitania&nbsp;Barantika&nbsp;Delly&nbsp;Yanti,&nbsp;S.Pd:&nbsp;085275279289</span></p><p></p>', '#pesantrensehat, #ponpessehat, #ponpesabdullahalbusyroni,  #pondokpesantren,  #yuksekolahdiabdullahalbusyroni,  #sekolahpencetakhafizh', 'posts/9kRUpoG34MktKNGzUpMyiDx5S9JROqJMPprE4ZSn.jpg', 1, 1, '2026-01-29 08:29:33', '2026-01-29 08:29:33'),
(3, 'Audiensi dan Sinergitas Program Pendidikan Bersama MAN 2 Model Medan', 'audiensi-dan-sinergitas-program-pendidikan-bersama-man-2-model-medan-xDY2Y', '<p class=\"ql-align-center\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">[Dokumentasi&nbsp;Audiensi&nbsp;dan&nbsp;Sinergitas&nbsp;Program&nbsp;Pendidikan&nbsp;Bersama&nbsp;MAN&nbsp;2&nbsp;Model&nbsp;Medan]</span></p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Alhamdulillah,&nbsp;PPTA&nbsp;Abdullah&nbsp;Al&nbsp;Busyroni&nbsp;berkesempatan&nbsp;menjalin&nbsp;silaturahmi&nbsp;dan&nbsp;berbagi&nbsp;gagasan&nbsp;bersama&nbsp;MAN&nbsp;2&nbsp;Model&nbsp;Medan</span></p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Kegiatan&nbsp;ini&nbsp;menjadi&nbsp;langkah&nbsp;nyata&nbsp;dalam&nbsp;memperkuat&nbsp;kolaborasi&nbsp;dan&nbsp;sinergi&nbsp;pendidikan&nbsp;antara&nbsp;pesantren&nbsp;dan&nbsp;sekolah&nbsp;formal&nbsp;demi&nbsp;mencetak&nbsp;generasi&nbsp;yang&nbsp;unggul&nbsp;dan&nbsp;berakhlak&nbsp;mulia</span></p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Info&nbsp;terkait&nbsp;PPDB&nbsp;PPTA&nbsp;Abdullah&nbsp;Al&nbsp;Busyroni&nbsp;|&nbsp;WhatsApp&nbsp;:&nbsp;085275279289</span></p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">PESANTREN&nbsp;SEHAT&nbsp;PERTAMA&nbsp;|&nbsp;PESANTREN&nbsp;RAMAH&nbsp;ANAK&nbsp;|&nbsp;PESANTREN&nbsp;DIGITAL</span></p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">—</span></p><p class=\"ql-align-center\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Jl.&nbsp;Bedagai&nbsp;Dusun&nbsp;VIII,&nbsp;Kec.&nbsp;Sei&nbsp;Rampah,&nbsp;Kab.&nbsp;Serdang&nbsp;Bedagai,&nbsp;Prov.&nbsp;Sumatera&nbsp;Utara.</span></p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Instagram&nbsp;:&nbsp;ponpes.abdullahalbusyroni</span></p><p class=\"ql-align-center\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Facebook&nbsp;:&nbsp;ponpes.abdullahalbusyroni</span></p><p class=\"ql-align-center\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Tiktok&nbsp;:&nbsp;ponpesabdullahalbusyroni</span></p><p class=\"ql-align-center\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Youtube&nbsp;:&nbsp;PPTA&nbsp;Abdullah&nbsp;Al&nbsp;Busyroni</span></p><p class=\"ql-align-center\"></p><p class=\"ql-align-center\"></p><p></p>', '#PPDB2026 #PPTAAbdullahAlBusyroni #SantriBerilmu #SantriBerakhlak #PesantrenDigital, #PesantrenSehat, #PesantrenRamahAnak, #sekolahpencetakhafizh', 'posts/H40YEdmXqwRutxDcOb4nN2s9ewq25evtVJqvkLJK.jpg', 1, 1, '2026-01-29 08:31:12', '2026-01-29 08:31:12');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(2, 'guru', 'web', '2025-09-10 19:23:58', '2025-09-10 19:23:58'),
(3, 'siswa', 'web', '2025-09-10 19:23:59', '2025-09-10 19:23:59');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(32, 1),
(33, 1),
(34, 1),
(35, 1),
(36, 1),
(1, 2),
(8, 2),
(9, 2),
(10, 2),
(11, 2),
(12, 2),
(13, 2),
(14, 2),
(15, 2),
(16, 2),
(17, 2),
(18, 2),
(19, 2),
(21, 2),
(22, 2),
(24, 2),
(25, 2),
(27, 2),
(28, 2),
(29, 2),
(30, 2),
(33, 2),
(35, 2),
(1, 3),
(8, 3),
(10, 3),
(12, 3),
(16, 3),
(20, 3),
(23, 3),
(26, 3),
(27, 3),
(33, 3),
(35, 3);

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` bigint UNSIGNED NOT NULL,
  `subject_id` bigint UNSIGNED NOT NULL,
  `guru_id` bigint UNSIGNED NOT NULL,
  `term_id` bigint UNSIGNED NOT NULL,
  `kapasitas` smallint UNSIGNED DEFAULT NULL,
  `jadwal_json` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `section_students`
--

CREATE TABLE `section_students` (
  `id` bigint UNSIGNED NOT NULL,
  `section_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('84buMqtISbyKXvbqQvJYmxZFtV7AEYvi6TQkHStW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZk1obE5FRVM5Vm9yWlB0UTRjOHRaQUVCSTBuczBpazdDaHE5ODd6MCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZGluZy1uZXdzIjt9fQ==', 1769768194);

-- --------------------------------------------------------

--
-- Table structure for table `siswa_profiles`
--

CREATE TABLE `siswa_profiles` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `nis` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `angkatan` smallint UNSIGNED NOT NULL,
  `kelas` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wali_kelas_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `siswa_profiles`
--

INSERT INTO `siswa_profiles` (`id`, `user_id`, `nis`, `angkatan`, `kelas`, `wali_kelas_id`, `created_at`, `updated_at`) VALUES
(107, 131, '000', 2022, 'X - IPA 1', NULL, '2026-01-30 03:10:46', '2026-01-30 03:10:46');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` bigint UNSIGNED NOT NULL,
  `kode` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `kode`, `nama`, `deskripsi`, `created_at`, `updated_at`) VALUES
(100, 'KODE', 'nama', 'deskripsi', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(101, 'IPA01', 'IPA VII-1', 'Imu Pengetahuan Alam', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(102, 'IPA02', 'IPA VIII-1', 'Ilmu Pengetahuan Alam', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(103, 'IPA03', 'IPA IX-1', 'Ilmu Pengetahuan Alam', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(104, 'MM01', 'MM VII-1', 'Matematika', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(105, 'MM02', 'MM VIII-1', 'Matematika', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(106, 'MM03', 'MM IX-1', 'Matematika', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(107, 'BA01', 'BA VII-1', 'Bahasa Arab', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(108, 'BA02', 'BA VIII-1', 'Bahasa Arab', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(109, 'BA03', 'BA IX-1', 'Bahasa Arab', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(110, 'IPS01', 'IPS VII-1', 'Ilmu Pengetahuan Sosial', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(111, 'IPS02', 'IPS VIII-1', 'ILmu Pengetahuan Sosial', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(112, 'IPS03', 'IPS IX-1', 'Ilmu Pengetahuan Sosial', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(113, 'BI01', 'BI VII-1', 'Bahasa Indonesia', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(114, 'BI02', 'BI VIII-1', 'Bahasa Indonesia', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(115, 'BI03', 'BI IX-1 ', 'Bahasa Indonesia', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(116, 'BING01', 'BING VII-1', 'Bahasa Inggris', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(117, 'BING02', 'BING VIII-1', 'Bahasa Inggris', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(118, 'BING03', 'BING IX-1', 'Bahasa Inggris', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(119, 'SKI01', 'SKI VII-1', 'Sejarah Kebudayaan Islam', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(120, 'SKI02', 'SKI VIII-1', 'Sejarah Kebudayaan Islam', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(121, 'SKI03', 'SKI IX-1', 'Sejarah Kebudayaan Islam', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(122, 'FQH01', 'FQH VII-1', 'Fiqih', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(123, 'FQH02', 'FQH VIII-1', 'Fiqih', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(124, 'FQH03', 'FQH IX-1', 'Fiqih', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(125, 'AA01', 'AA VII-1', 'Akidah Akhlak', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(126, 'AA02', 'AA VIII-1', 'Akidah Akhlak', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(127, 'AA03', 'AA IX-1', 'Akidah Akhlak', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(128, 'QH01', 'QH VII-1', 'Qur\'an Hadist', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(129, 'QH02', 'QH VIII-1', 'Qur\'an Hadist', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(130, 'QH03', 'QH IX-1', 'Qur\'an Hadist', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(131, 'SP01', 'SP VII-1', 'Seni dan Prakarya', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(132, 'SP02', 'SP VIII-1', 'Seni dan Prakarya', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(133, 'SP03', 'SP IX-1', 'Seni dan Prakarya', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(134, 'TIK01', 'TIK VII-1', 'Teknologi Informatika', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(135, 'TIK02', 'TIK VIII-1', 'Teknologi Informatika', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(136, 'TIK03', 'TIK IX-1', 'Teknologi Informatika', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(137, 'PJOK01', 'PJOK VII-1', 'Pendidikan Jasmani dan Olahraga', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(138, 'PJOK02', 'PJOK VIII-1', 'Pendidikan Jasmani dan Olahraga', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(139, 'PJOK03', 'PJOK IX-1', 'Pendidikan Jasmani dan Olahraga', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(140, 'AW01', 'AW VII-1', 'Ke Al Washliyahan', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(141, 'AW02', 'AW VIII-1', 'Ke Al Washliyahan', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(142, 'AW03', 'AW IX-1', 'Ke Al Washliyahan', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(143, 'KTB01', 'KTB VII-1', 'Kitab', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(144, 'KTB02', 'KTB VIII-1', 'Kitab', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(145, 'KTB03', 'KTB IX-1', 'Kitab', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(146, 'HDRH01', 'HDRH VII-1', 'Hadroh', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(147, 'HDRH02', 'HDRH VIII-1', 'Hadroh', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(148, 'HDRH03', 'HDRH IX-1', 'Hadroh', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(149, 'PKN01', 'PKN VII-1', 'Pendidikan Kewarganegaraan', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(150, 'PKN02', 'PKN VII-1', 'Pendidikan Kewarganegaraan', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(151, 'PKN03', 'PKN IX-1', 'Pendidikan Kewarganegaraan', '2026-01-29 05:55:51', '2026-01-29 05:55:51'),
(152, 'BK', 'BK', 'Bimbingan Konseling', '2026-01-29 05:55:51', '2026-01-29 05:55:51');

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` bigint UNSIGNED NOT NULL,
  `assignment_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `konten_teks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submitted_at` datetime NOT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `terms`
--

CREATE TABLE `terms` (
  `id` bigint UNSIGNED NOT NULL,
  `tahun` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `semester` enum('ganjil','genap') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `terms`
--

INSERT INTO `terms` (`id`, `tahun`, `semester`, `aktif`, `created_at`, `updated_at`) VALUES
(1, '2025/2026', 'genap', 1, '2025-09-10 19:23:59', '2025-12-26 19:18:52');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'admin@sims.com', '2025-09-10 19:23:59', '$2y$12$MHWciC2xq56ACHXLT5yTC.uub8KtHm.3Gwyk5xLfCzVPVLyPS5XTG', NULL, '2025-09-10 19:23:59', '2025-09-22 10:21:10'),
(120, 'Super Admin', 'mtsppta@admin.com', '2025-12-26 19:33:37', '$2y$12$5o8zA/C87dkDjJgXShcsMeX9/ZXluIy1UHftclwZjHH7zJBPTmYJG', NULL, '2025-12-26 19:33:37', '2025-12-26 19:33:37'),
(131, 'Budi Siswa', 'budisiswa@gmail.com', '2026-01-30 03:10:46', '$2y$12$KjQheROtKRbbkcYms33F3e6E26Vk1e744VvoCeEuX1.CuoCRRdW.C', NULL, '2026-01-30 03:10:46', '2026-01-30 03:10:46'),
(132, 'Budi', 'budi@gmail.com', '2026-01-30 03:15:52', '$2y$12$Dh/ScWGX5Nis/pFAQZVBruTw3JIrOUU.5cmM152PEMYW2erC/QOmC', NULL, '2026-01-30 03:15:52', '2026-01-30 03:15:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcements_created_by_foreign` (`created_by`),
  ADD KEY `announcements_scope_type_scope_id_index` (`scope_type`,`scope_id`),
  ADD KEY `announcements_role_name_index` (`role_name`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignments_section_id_deadline_index` (`section_id`,`deadline`);

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `attendances_section_id_pertemuan_ke_unique` (`section_id`,`pertemuan_ke`);

--
-- Indexes for table `attendance_details`
--
ALTER TABLE `attendance_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `attendance_details_attendance_id_user_id_unique` (`attendance_id`,`user_id`),
  ADD KEY `attendance_details_user_id_foreign` (`user_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `chat_configs`
--
ALTER TABLE `chat_configs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chat_configs_key_unique` (`key`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_messages_session_id_index` (`session_id`);

--
-- Indexes for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_sessions_user_id_source_index` (`user_id`,`source`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `grades_section_id_user_id_komponen_unique` (`section_id`,`user_id`,`komponen`),
  ADD KEY `grades_user_id_foreign` (`user_id`);

--
-- Indexes for table `guru_profiles`
--
ALTER TABLE `guru_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `guru_profiles_user_id_unique` (`user_id`),
  ADD UNIQUE KEY `guru_profiles_nidn_unique` (`nidn`),
  ADD UNIQUE KEY `guru_profiles_nuptk_unique` (`nuptk`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `materials_section_id_foreign` (`section_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `posts_slug_unique` (`slug`),
  ADD KEY `posts_author_id_foreign` (`author_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sections_term_id_foreign` (`term_id`),
  ADD KEY `sections_subject_id_term_id_index` (`subject_id`,`term_id`),
  ADD KEY `sections_guru_id_term_id_index` (`guru_id`,`term_id`);

--
-- Indexes for table `section_students`
--
ALTER TABLE `section_students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section_students_section_id_user_id_unique` (`section_id`,`user_id`),
  ADD KEY `section_students_user_id_foreign` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `siswa_profiles`
--
ALTER TABLE `siswa_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `siswa_profiles_user_id_unique` (`user_id`),
  ADD UNIQUE KEY `siswa_profiles_nis_unique` (`nis`),
  ADD KEY `siswa_profiles_wali_kelas_id_foreign` (`wali_kelas_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subjects_kode_unique` (`kode`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `submissions_assignment_id_user_id_unique` (`assignment_id`,`user_id`),
  ADD KEY `submissions_user_id_submitted_at_index` (`user_id`,`submitted_at`);

--
-- Indexes for table `terms`
--
ALTER TABLE `terms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `terms_tahun_semester_unique` (`tahun`,`semester`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `attendance_details`
--
ALTER TABLE `attendance_details`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `chat_configs`
--
ALTER TABLE `chat_configs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `guru_profiles`
--
ALTER TABLE `guru_profiles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `section_students`
--
ALTER TABLE `section_students`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=904;

--
-- AUTO_INCREMENT for table `siswa_profiles`
--
ALTER TABLE `siswa_profiles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=153;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `terms`
--
ALTER TABLE `terms`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `attendance_details`
--
ALTER TABLE `attendance_details`
  ADD CONSTRAINT `attendance_details_attendance_id_foreign` FOREIGN KEY (`attendance_id`) REFERENCES `attendances` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_session_id_foreign` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD CONSTRAINT `chat_sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grades_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `guru_profiles`
--
ALTER TABLE `guru_profiles`
  ADD CONSTRAINT `guru_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `materials`
--
ALTER TABLE `materials`
  ADD CONSTRAINT `materials_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `sections_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sections_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sections_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `section_students`
--
ALTER TABLE `section_students`
  ADD CONSTRAINT `section_students_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `section_students_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `siswa_profiles`
--
ALTER TABLE `siswa_profiles`
  ADD CONSTRAINT `siswa_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `siswa_profiles_wali_kelas_id_foreign` FOREIGN KEY (`wali_kelas_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_assignment_id_foreign` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
