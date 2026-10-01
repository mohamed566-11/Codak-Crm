-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 28, 2026 at 04:55 PM
-- Server version: 8.4.3
-- PHP Version: 8.5.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `espo`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(249) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `industry` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sic_code` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_address_street` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_address_city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_address_state` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_address_country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_address_postal_code` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address_street` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address_city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address_state` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address_country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address_postal_code` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_locked` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `stream_updated_at` datetime DEFAULT NULL,
  `campaign_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version_number` bigint DEFAULT '0',
  `c_pwqd_street` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_pwqd_city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_pwqd_state` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_pwqd_country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_pwqd_postal_code` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `account_contact`
--

CREATE TABLE `account_contact` (
  `id` bigint NOT NULL,
  `account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_inactive` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `account_document`
--

CREATE TABLE `account_document` (
  `id` bigint NOT NULL,
  `account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `account_portal_user`
--

CREATE TABLE `account_portal_user` (
  `id` bigint NOT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `account_target_list`
--

CREATE TABLE `account_target_list` (
  `id` bigint NOT NULL,
  `account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_list_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opted_out` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `action_history_record`
--

CREATE TABLE `action_history_record` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `number` bigint UNSIGNED NOT NULL,
  `target_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `ip_address` varchar(39) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auth_token_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auth_log_record_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `address_country`
--

CREATE TABLE `address_country` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_preferred` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_log_record`
--

CREATE TABLE `app_log_record` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `number` bigint UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `message` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `level` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` int DEFAULT NULL,
  `exception_class` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `line` int DEFAULT NULL,
  `request_method` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request_resource_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_secret`
--

CREATE TABLE `app_secret` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `delete_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `array_value`
--

CREATE TABLE `array_value` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `value` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attribute` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `array_value`
--

INSERT INTO `array_value` (`id`, `deleted`, `value`, `attribute`, `entity_id`, `entity_type`) VALUES
('6aaef1daa106b7706', 0, 'users', 'cAllowedAdminItems', '6aaef1d9eb8255583', 'User'),
('6aaef1daa2eded01d', 0, 'roles', 'cAllowedAdminItems', '6aaef1d9eb8255583', 'User'),
('6aaef1daa3763d81b', 0, 'clearCache', 'cAllowedAdminItems', '6aaef1d9eb8255583', 'User'),
('6aaef1f49a863b27d', 0, 'users', 'cAllowedAdminItems', '6aaef1f48f4e322ba', 'User'),
('6aaef1f49b1e11327', 0, 'roles', 'cAllowedAdminItems', '6aaef1f48f4e322ba', 'User'),
('6aaef1f49bcf75ed8', 0, 'clearCache', 'cAllowedAdminItems', '6aaef1f48f4e322ba', 'User'),
('6aaef2104c688fda1', 0, 'users', 'cAllowedAdminItems', '6aaef2103ee2e9edd', 'User'),
('6aaef2104d3c67272', 0, 'roles', 'cAllowedAdminItems', '6aaef2103ee2e9edd', 'User'),
('6aaef2104dd02e944', 0, 'clearCache', 'cAllowedAdminItems', '6aaef2103ee2e9edd', 'User'),
('6aaef22a446a797bc', 0, 'users', 'cAllowedAdminItems', '6aaef22a386138091', 'User'),
('6aaef22a4514aee58', 0, 'roles', 'cAllowedAdminItems', '6aaef22a386138091', 'User'),
('6aaef22a458db5e1a', 0, 'clearCache', 'cAllowedAdminItems', '6aaef22a386138091', 'User'),
('6aaef248001e625b9', 0, 'users', 'cAllowedAdminItems', '6aaef247e827b51c0', 'User'),
('6aaef24800bb81188', 0, 'roles', 'cAllowedAdminItems', '6aaef247e827b51c0', 'User'),
('6aaef248013bc58a9', 0, 'clearCache', 'cAllowedAdminItems', '6aaef247e827b51c0', 'User'),
('6aaeffe0065bda084', 0, 'settings', 'cAllowedAdminItems', '6aaeffdfea8916950', 'User'),
('6aaeffe0072389744', 0, 'users', 'cAllowedAdminItems', '6aaeffdfea8916950', 'User'),
('6aaf05f3f2969bad8', 0, 'settings', 'cAllowedAdminItems', '6aaf05f3e17bf3759', 'User'),
('6aaf061fe97450479', 0, 'settings', 'cAllowedAdminItems', '6aaf061fdedd59b36', 'User'),
('6aaf06568774d3654', 0, 'settings', 'cAllowedAdminItems', '6aaf06567c5c26cd3', 'User'),
('6aaf0656970f12d82', 0, 'currency', 'cAllowedAdminItems', '6aaf0656962ca0cb0', 'User'),
('6aaf06a67616f3ad2', 0, 'settings', 'cAllowedAdminItems', '6aaf06a66bb8c76a4', 'User'),
('6aaf06dacd35af485', 0, 'settings', 'cAllowedAdminItems', '6aaf06dab42796742', 'User'),
('6aaf06f01f5f8b36f', 0, 'settings', 'cAllowedAdminItems', '6aaf06f01482e5dba', 'User'),
('6aaf06fb2f80ad345', 0, 'settings', 'cAllowedAdminItems', '6aaf06fb1a35817f3', 'User'),
('6aaf06fb60c308c59', 0, 'currency', 'cAllowedAdminItems', '6aaf06fb5f5a0019d', 'User'),
('6aaf0725a5b4bb200', 0, 'settings', 'cAllowedAdminItems', '6aaf07257fde2c9fd', 'User'),
('6aaf0725d8ca7d914', 0, 'currency', 'cAllowedAdminItems', '6aaf0725d769d8d15', 'User'),
('6aaf073e282d20cb5', 0, 'settings', 'cAllowedAdminItems', '6aaf073e15c505866', 'User'),
('6aaf0757b067ba2d3', 0, 'settings', 'cAllowedAdminItems', '6aaf0757a59ff7317', 'User'),
('6aaf0757d6f632b80', 0, 'currency', 'cAllowedAdminItems', '6aaf0757d5ed424fe', 'User'),
('6aaf076d7bfc5ae4a', 0, 'settings', 'cAllowedAdminItems', '6aaf076d69f934ba5', 'User'),
('6aaf076d9494edeb6', 0, 'currency', 'cAllowedAdminItems', '6aaf076d93d759363', 'User'),
('6aaf0781351d85514', 0, 'settings', 'cAllowedAdminItems', '6aaf0781164d6fcb8', 'User'),
('6aaf07814720f258c', 0, 'currency', 'cAllowedAdminItems', '6aaf078146599e544', 'User'),
('6ab136f5191fc5cc1', 0, 'settings', 'cAllowedAdminItems', '6ab136f01b2f616a3', 'User'),
('6ab136f65810bc1f9', 0, 'currency', 'cAllowedAdminItems', '6ab136f656fae6542', 'User'),
('6ab1374ad14feb128', 0, 'users', 'cAllowedAdminItems', '6ab1374ac4023dcc3', 'User'),
('6ab1378fafd84f5b8', 0, 'users', 'cAllowedAdminItems', '6ab1378fa5c705769', 'User'),
('6ab137a5bea29bf58', 0, 'settings', 'cAllowedAdminItems', '6ab137a5b4acafbea', 'User'),
('6ab137a5e38987181', 0, 'currency', 'cAllowedAdminItems', '6ab137a5e2a1faf54', 'User');

-- --------------------------------------------------------

--
-- Table structure for table `attachment`
--

CREATE TABLE `attachment` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` bigint DEFAULT NULL,
  `field` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_being_uploaded` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `role` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storage` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storage_file_path` varchar(260) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `global` tinyint(1) NOT NULL DEFAULT '0',
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `authentication_provider`
--

CREATE TABLE `authentication_provider` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `method` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oidc_client_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oidc_client_secret` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oidc_authorization_endpoint` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oidc_user_info_endpoint` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oidc_token_endpoint` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oidc_jwks_endpoint` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oidc_jwt_signature_algorithm_list` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `oidc_scopes` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `oidc_create_user` tinyint(1) NOT NULL DEFAULT '0',
  `oidc_username_claim` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'sub',
  `oidc_sync` tinyint(1) NOT NULL DEFAULT '0',
  `oidc_logout_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oidc_authorization_prompt` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oidc_authorization_pkce` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_log_record`
--

CREATE TABLE `auth_log_record` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `is_denied` tinyint(1) NOT NULL DEFAULT '0',
  `denial_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request_time` double DEFAULT NULL,
  `request_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request_method` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authentication_method` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portal_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auth_token_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `auth_token`
--

CREATE TABLE `auth_token` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `token` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hash` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `secret` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `password_version` int NOT NULL DEFAULT '0',
  `last_access` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portal_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `autofollow`
--

CREATE TABLE `autofollow` (
  `id` int NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `call`
--

CREATE TABLE `call` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Planned',
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `direction` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Outbound',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `call_contact`
--

CREATE TABLE `call_contact` (
  `id` bigint NOT NULL,
  `call_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'None',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `call_lead`
--

CREATE TABLE `call_lead` (
  `id` bigint NOT NULL,
  `call_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lead_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'None',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `call_user`
--

CREATE TABLE `call_user` (
  `id` bigint NOT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `call_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'None',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `campaign`
--

CREATE TABLE `campaign` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Planning',
  `type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Email',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `budget` double DEFAULT NULL,
  `mail_merge_only_with_address` tinyint(1) NOT NULL DEFAULT '1',
  `budget_currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contacts_template_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leads_template_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accounts_template_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `users_template_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `campaign_log_record`
--

CREATE TABLE `campaign_log_record` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `action` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_date` datetime DEFAULT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `string_data` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `string_additional_data` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `application` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Espo',
  `created_at` datetime DEFAULT NULL,
  `is_test` tinyint(1) NOT NULL DEFAULT '0',
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campaign_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `object_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `object_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `queue_item_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaign_target_list`
--

CREATE TABLE `campaign_target_list` (
  `id` bigint NOT NULL,
  `campaign_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_list_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaign_target_list_excluding`
--

CREATE TABLE `campaign_target_list_excluding` (
  `id` bigint NOT NULL,
  `campaign_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_list_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaign_tracking_url`
--

CREATE TABLE `campaign_tracking_url` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Redirect',
  `message` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `modified_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `campaign_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case`
--

CREATE TABLE `case` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `number` int UNSIGNED NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'New',
  `priority` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Normal',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_internal` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `stream_updated_at` datetime DEFAULT NULL,
  `account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lead_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inbound_email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version_number` bigint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `case_contact`
--

CREATE TABLE `case_contact` (
  `id` bigint NOT NULL,
  `case_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case_knowledge_base_article`
--

CREATE TABLE `case_knowledge_base_article` (
  `id` bigint NOT NULL,
  `case_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `knowledge_base_article_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `salutation_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `do_not_call` tinyint(1) NOT NULL DEFAULT '0',
  `address_street` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_state` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_postal_code` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `middle_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stream_updated_at` datetime DEFAULT NULL,
  `account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campaign_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_substantia_adipiscor_taedium_street` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_substantia_adipiscor_taedium_city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_substantia_adipiscor_taedium_state` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_substantia_adipiscor_taedium_country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_substantia_adipiscor_taedium_postal_code` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_administratio_culpa_non_socius` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Deprecator amo tracto autem tyrannus.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `contact_document`
--

CREATE TABLE `contact_document` (
  `id` bigint NOT NULL,
  `contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_meeting`
--

CREATE TABLE `contact_meeting` (
  `id` bigint NOT NULL,
  `contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meeting_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'None',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_opportunity`
--

CREATE TABLE `contact_opportunity` (
  `id` bigint NOT NULL,
  `contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opportunity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_target_list`
--

CREATE TABLE `contact_target_list` (
  `id` bigint NOT NULL,
  `contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_list_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opted_out` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `currency`
--

CREATE TABLE `currency` (
  `id` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `currency`
--

INSERT INTO `currency` (`id`, `rate`) VALUES
('USD', 1);

-- --------------------------------------------------------

--
-- Table structure for table `currency_record`
--

CREATE TABLE `currency_record` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `code` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `delete_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `currency_record`
--

INSERT INTO `currency_record` (`id`, `deleted`, `code`, `status`, `delete_id`) VALUES
('6a4ec91a640e08f27', 0, 'USD', 'Active', '0');

-- --------------------------------------------------------

--
-- Table structure for table `currency_record_rate`
--

CREATE TABLE `currency_record_rate` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `base_code` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `delete_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `record_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rate` decimal(20,8) DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dashboard_template`
--

CREATE TABLE `dashboard_template` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `layout` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `dashlets_options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publish_date` date DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `file_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `folder_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `document_folder`
--

CREATE TABLE `document_folder` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document_folder_path`
--

CREATE TABLE `document_folder_path` (
  `id` int NOT NULL,
  `ascendor_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descendor_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document_lead`
--

CREATE TABLE `document_lead` (
  `id` bigint NOT NULL,
  `document_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lead_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document_opportunity`
--

CREATE TABLE `document_opportunity` (
  `id` bigint NOT NULL,
  `document_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opportunity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email`
--

CREATE TABLE `email` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `from_string` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reply_to_string` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_name_map` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_replied` tinyint(1) NOT NULL DEFAULT '0',
  `message_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message_id_internal` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body_plain` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `body` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_html` tinyint(1) NOT NULL DEFAULT '1',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Archived',
  `has_attachment` tinyint(1) NOT NULL DEFAULT '0',
  `date_sent` datetime DEFAULT NULL,
  `delivery_date` datetime DEFAULT NULL,
  `send_at` datetime DEFAULT NULL,
  `is_auto_reply` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT '0',
  `ics_contents` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ics_event_uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `group_status_folder` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_email_address_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sent_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `replied_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_event_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_event_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `group_folder_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `email_account`
--

CREATE TABLE `email_account` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `email_address` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `port` int DEFAULT '993',
  `security` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'SSL',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monitored_folders` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sent_folder` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `folder_map` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `store_sent_emails` tinyint(1) NOT NULL DEFAULT '0',
  `keep_fetched_emails_unread` tinyint(1) NOT NULL DEFAULT '0',
  `fetch_validity_number` int DEFAULT '0',
  `fetch_since` date DEFAULT NULL,
  `fetch_data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `connected_at` datetime DEFAULT NULL,
  `use_imap` tinyint(1) NOT NULL DEFAULT '1',
  `use_smtp` tinyint(1) NOT NULL DEFAULT '0',
  `smtp_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtp_port` int DEFAULT '587',
  `smtp_auth` tinyint(1) NOT NULL DEFAULT '1',
  `smtp_security` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'TLS',
  `smtp_username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtp_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtp_auth_mechanism` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'login',
  `imap_handler` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtp_handler` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_folder_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_address`
--

CREATE TABLE `email_address` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `lower` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invalid` tinyint(1) NOT NULL DEFAULT '0',
  `opt_out` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `email_email_account`
--

CREATE TABLE `email_email_account` (
  `id` bigint NOT NULL,
  `email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_email_address`
--

CREATE TABLE `email_email_address` (
  `id` bigint NOT NULL,
  `email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_address_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_type` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_filter`
--

CREATE TABLE `email_filter` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `from` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body_contains` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `body_contains_all` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_global` tinyint(1) NOT NULL DEFAULT '0',
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Skip',
  `mark_as_read` tinyint(1) NOT NULL DEFAULT '0',
  `skip_notification` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_folder_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `group_email_folder_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_folder`
--

CREATE TABLE `email_folder` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `order` int DEFAULT NULL,
  `skip_notifications` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_inbound_email`
--

CREATE TABLE `email_inbound_email` (
  `id` bigint NOT NULL,
  `email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inbound_email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_queue_item`
--

CREATE TABLE `email_queue_item` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attempt_count` int DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `email_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_test` tinyint(1) NOT NULL DEFAULT '0',
  `mass_email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_template`
--

CREATE TABLE `email_template` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_html` tinyint(1) NOT NULL DEFAULT '1',
  `status` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `one_off` tinyint(1) NOT NULL DEFAULT '0',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `category_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version_number` bigint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `email_template`
--

INSERT INTO `email_template` (`id`, `name`, `deleted`, `subject`, `body`, `is_html`, `status`, `one_off`, `description`, `created_at`, `modified_at`, `category_id`, `assigned_user_id`, `created_by_id`, `modified_by_id`, `version_number`) VALUES
('6a4ec9bd07f93c885', 'Case-to-Email auto-reply', 0, 'Case has been created', '<p>{Person.name},</p><p>Case \'{Case.name}\' has been created with number {Case.number} and assigned to {User.name}.</p>', 1, 'Active', 0, NULL, '2026-07-08 22:05:49', '2026-07-08 22:05:49', NULL, NULL, 'system', NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `email_template_category`
--

CREATE TABLE `email_template_category` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `order` int DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_template_category_path`
--

CREATE TABLE `email_template_category_path` (
  `id` int NOT NULL,
  `ascendor_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descendor_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_user`
--

CREATE TABLE `email_user` (
  `id` bigint NOT NULL,
  `email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `is_important` tinyint(1) DEFAULT '0',
  `in_trash` tinyint(1) DEFAULT '0',
  `in_archive` tinyint(1) DEFAULT '0',
  `folder_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `entity_collaborator`
--

CREATE TABLE `entity_collaborator` (
  `id` bigint NOT NULL,
  `entity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `entity_collaborator`
--

INSERT INTO `entity_collaborator` (`id`, `entity_id`, `user_id`, `entity_type`, `deleted`) VALUES
(1, '6aa97178c23b1a088', '6a4ec9b12dae98deb', 'Task', 0),
(2, '6aa971a2a52b03812', '6a4ec9b12dae98deb', 'Task', 0),
(3, '6aa971dfb5112e369', '6a4ec9b12dae98deb', 'Task', 0),
(4, '6aa972083729547af', '6a4ec9b12dae98deb', 'Task', 0),
(5, '6aa9721e0cc73e5d9', '6a4ec9b12dae98deb', 'Task', 0),
(6, '6aa9726353461ccbf', '6a4ec9b12dae98deb', 'Task', 0),
(7, '6aa972841ed0deef3', '6a4ec9b12dae98deb', 'Task', 0),
(8, '6aa972b06f09f4589', '6a4ec9b12dae98deb', 'Task', 0),
(9, '6aac0c848326b8e4f', '6a4ec9b12dae98deb', 'Task', 0),
(10, '6aac21b072abd2bf4', '6a4ec9b12dae98deb', 'Task', 0),
(11, '6aac2bb984b9e3a75', '6a4ec9b12dae98deb', 'Task', 0),
(12, '6aaef257caddd5a91', '6a4ec9b12dae98deb', 'Task', 0),
(13, '6aaef3a28cad39971', '6a4ec9b12dae98deb', 'Task', 0),
(14, '6aaef4ad2b8f2c8ee', '6a4ec9b12dae98deb', 'Task', 0),
(15, '6aaefbef42be2a23f', '6a4ec9b12dae98deb', 'Task', 0),
(16, '6aaefe54e00a6408e', '6a4ec9b12dae98deb', 'Task', 0),
(17, '6aaefee68e2661189', '6a4ec9b12dae98deb', 'Task', 0),
(18, '6aaefff05389947a4', '6a4ec9b12dae98deb', 'Task', 0),
(19, '6aaf02a8c7d074afc', '6a4ec9b12dae98deb', 'Task', 0),
(20, '6aaf078dccb69357c', '6a4ec9b12dae98deb', 'Task', 0),
(21, '6ab30c23918e5563d', '6a4ec9b12dae98deb', 'Task', 0),
(22, '6ab312ab90674d34f', '6a4ec9b12dae98deb', 'Task', 0),
(23, '6ab468f702bd91e39', '6a4ec9b12dae98deb', 'Task', 0),
(24, '6ab46c7971a3fa81d', '6a4ec9b12dae98deb', 'Task', 0),
(25, '6ab46eb312717cf27', '6a4ec9b12dae98deb', 'Task', 0),
(26, '6ab4700e6ab865ff6', '6a4ec9b12dae98deb', 'Task', 0),
(27, '6ab470cf42b4bf606', '6a4ec9b12dae98deb', 'Task', 0),
(28, '6ab56b16a88156827', '6a4ec9b12dae98deb', 'Task', 0),
(29, '6ab56bfc031139a71', '6a4ec9b12dae98deb', 'Task', 0),
(30, '6ab950b14e71749fd', '6a4ec9b12dae98deb', 'Task', 0),
(31, '6ab951a04805e6e75', '6a4ec9b12dae98deb', 'Task', 0),
(32, '6ab953511db3a941a', '6a4ec9b12dae98deb', 'Task', 0),
(33, '6ab9575c0405366ee', '6a4ec9b12dae98deb', 'Task', 0);

-- --------------------------------------------------------

--
-- Table structure for table `entity_email_address`
--

CREATE TABLE `entity_email_address` (
  `id` bigint NOT NULL,
  `entity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_address_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primary` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `entity_email_address`
--

INSERT INTO `entity_email_address` (`id`, `entity_id`, `email_address_id`, `entity_type`, `primary`, `deleted`) VALUES
(1, '6a75c20957b18cd36', '6a75c20fd17e2cef7', 'Lead', 1, 0),
(2, '6a75c3589c9310ab8', '6a75c358c4b4087f6', 'Lead', 1, 0),
(3, '6a75dffa76f9b89ab', '6a75e0004186c35ea', 'Lead', 1, 0),
(4, '6a75e19810b0d48e3', '6a75e19856d8ad9fc', 'Lead', 1, 0),
(5, '6a846deff3235112b', '6a846df60b0cf8c61', 'Lead', 1, 0),
(6, '6a846f6678ebbc0d6', '6a846f669c7f22151', 'Contact', 1, 0),
(7, '6aa97027e44cccaed', '6aa97027e574dba54', 'Contact', 1, 0),
(8, '6aa970280cd350035', '6aa9702810f51f9c0', 'Lead', 1, 0),
(9, '6aa9707c81e10ed11', '6aa9707c83864661d', 'Contact', 1, 0),
(10, '6aa9707c9de7fd09b', '6aa9707c9fb41a719', 'Lead', 1, 0),
(11, '6aa970c9c9ceceee6', '6aa970c9cbb8191ff', 'Contact', 1, 0),
(12, '6aa970c9e5c3ff387', '6aa970c9e7bb31060', 'Lead', 1, 0),
(13, '6aa9711b124defb62', '6aa9711b139ab9797', 'Contact', 1, 0),
(14, '6aa9711b2db3666c3', '6aa9711b30dfb7552', 'Lead', 1, 0),
(15, '6aa97161d9736f477', '6aa97161db1e5da31', 'Contact', 1, 0),
(16, '6aa9716206c3b8b4e', '6aa9716208b6fdcd2', 'Lead', 1, 0),
(17, '6aa971781a36265e0', '6aa971781bacdcc85', 'Contact', 1, 0),
(18, '6aa9717834d5d88a8', '6aa971783660d71de', 'Lead', 1, 0),
(19, '6aa971a0359061564', '6aa971a03c8b2d0df', 'Contact', 1, 0),
(20, '6aa971a08fee70445', '6aa971a095bbadcd0', 'Lead', 1, 0),
(21, '6aa971df035b5a7de', '6aa971df0491e7f3c', 'Contact', 1, 0),
(22, '6aa971df211dd11c1', '6aa971df2461e38cc', 'Lead', 1, 0),
(23, '6aa9720786fec6827', '6aa97207882fae3f3', 'Contact', 1, 0),
(24, '6aa97207a348f2abe', '6aa97207a668dd0d2', 'Lead', 1, 0),
(25, '6aa9721d5cfb78189', '6aa9721d5dde69070', 'Contact', 1, 0),
(26, '6aa9721d768ff71cb', '6aa9721d7a322f37a', 'Lead', 1, 0),
(27, '6aa972626e647d509', '6aa97262702e5e745', 'Contact', 1, 0),
(28, '6aa9726294c2b91c4', '6aa9726299e342ad0', 'Lead', 1, 0),
(29, '6aa97283242d0f14c', '6aa9728325c7bceb8', 'Contact', 1, 0),
(30, '6aa972834d17c2c46', '6aa9728351e7baee9', 'Lead', 1, 0),
(31, '6aa972afa05bb1962', '6aa972afa1d9efd70', 'Contact', 1, 0),
(32, '6aa972afc09b3cbe6', '6aa972afc5f34027f', 'Lead', 1, 0),
(33, '6aac067ecb576c3be', '6aac068422941f5c6', 'Lead', 1, 0),
(34, '6aac1fd308e28a575', '6aac1fd6468eb6119', 'Account', 1, 0),
(35, '6aac21ab8d4b745e3', '6aac21ab8e4b7a6dc', 'Contact', 1, 0),
(36, '6aac21abb08799b58', '6aac21abb486d2144', 'Lead', 1, 0),
(37, '6aac22cb40f7c2b6d', '6aac22cb630d20bed', 'Account', 1, 0),
(38, '6aac2331b180c1760', '6aac2331b509f4f92', 'Account', 1, 0),
(39, '6aac23770c4917f70', '6aac23771f2a77ea5', 'Account', 1, 0),
(40, '6aac26d8353dbe803', '6aac26d83bfe69fb7', 'User', 1, 0),
(41, '6aac2bb906f516467', '6aac2bb9083838599', 'Contact', 1, 0),
(42, '6aac2bb91d983d40b', '6aac2bb91f2a5abb1', 'Lead', 1, 0),
(43, '6aac3e5a099cb5ce5', '6aac3e5a114ee32de', 'Lead', 1, 0),
(44, '6aac3ea194c1a6ae5', '6aac3ea19ca25accd', 'Lead', 1, 0),
(45, '6aac3f4fee6b1abf8', '6aac3f4ff22961592', 'Lead', 1, 0),
(46, '6aaedc7a391c5ade9', '6aaedc7a5f0c1854a', 'Contact', 1, 0),
(47, '6aaeddc8998a80aea', '6aaeddc89f241ee07', 'Account', 1, 0),
(48, '6aaedddaad2d61b42', '6aaedddab157bfd1b', 'Account', 1, 0),
(49, '6aaede1f5155e6337', '6aaede1f58afea44d', 'Contact', 1, 0),
(50, '6aaede2d93c2695e3', '6aaede2d9a4c7c562', 'Contact', 1, 0),
(51, '6aaef2562d4629c72', '6aaef2562ec291fd5', 'Contact', 1, 0),
(52, '6aaef25642e907781', '6aaef25645c4f6f65', 'Lead', 1, 0),
(53, '6aaef3a218e090724', '6aaef3a219f98e1de', 'Contact', 1, 0),
(54, '6aaef3a22b83fe604', '6aaef3a22e213c584', 'Lead', 1, 0),
(55, '6aaef4ac945d5cbcb', '6aaef4ac9581f8014', 'Contact', 1, 0),
(56, '6aaef4aca947a61a2', '6aaef4acac871e4d0', 'Lead', 1, 0),
(57, '6aaefbeea4014e85e', '6aaefbeea5a4b45c8', 'Contact', 1, 0),
(58, '6aaefbeeb892faae3', '6aaefbeebc838f29e', 'Lead', 1, 0),
(59, '6aaefe54541e33d7a', '6aaefe54553663109', 'Contact', 1, 0),
(60, '6aaefe546a3126ceb', '6aaefe546d9fb6878', 'Lead', 1, 0),
(61, '6aaefee603bad7bb7', '6aaefee6055c508f5', 'Contact', 1, 0),
(62, '6aaefee62003cedc4', '6aaefee622450aaf9', 'Lead', 1, 0),
(63, '6aaeffef92a17fa2a', '6aaeffef94557fc1c', 'Contact', 1, 0),
(64, '6aaeffefad61f021a', '6aaeffefb07bc1026', 'Lead', 1, 0),
(65, '6aaf02a84dc2bb9b9', '6aaf02a84ee956a01', 'Contact', 1, 0),
(66, '6aaf02a861dc43020', '6aaf02a864931c3e1', 'Lead', 1, 0),
(67, '6aaf078d4953ab7f2', '6aaf078d4aada11bc', 'Contact', 1, 0),
(68, '6aaf078d5c703f00b', '6aaf078d5f2e8e301', 'Lead', 1, 0),
(69, '6ab1357fc31de97a4', '6ab135808d25e0e33', 'User', 1, 0),
(70, '6ab137247c7e89e95', '6ab1372482b9b804a', 'User', 1, 0),
(71, '6ab13761ec5d5ba6c', '6ab13761f3951157c', 'User', 1, 0),
(72, '6ab1378d32fd51548', '6ab1378d362ff1262', 'User', 1, 0),
(73, '6ab1378ff1d2cd425', '6ab1379003fb864ee', 'User', 1, 0),
(74, '6ab1382d95735e377', '6ab1382d9b3480d51', 'Account', 1, 0),
(75, '6ab2dd8794e32da38', '6ab2dd879c0072fa3', 'User', 1, 0),
(76, '6ab30c2126ccf9451', '6ab30c212916264b3', 'Contact', 1, 0),
(77, '6ab30c2141a381dea', '6ab30c2143ca719d9', 'Lead', 1, 0),
(78, '6a4ec9b12dae98deb', '6ab31205bb84ac048', 'User', 1, 0),
(79, '6ab312a91f95b1d28', '6ab312a921581a6f1', 'Contact', 1, 0),
(80, '6ab312a9465d4c204', '6ab312a94b5186fc2', 'Lead', 1, 0),
(81, '6ab468f51105aa4c5', '6ab468f512cc6cfca', 'Contact', 1, 0),
(82, '6ab468f52eade5b01', '6ab468f53390394fb', 'Lead', 1, 0),
(83, '6ab46c78983751c28', '6ab46c7899d27d64e', 'Contact', 1, 0),
(84, '6ab46c78b4052729e', '6ab46c78b75dbc138', 'Lead', 1, 0),
(85, '6ab46eb266265e142', '6ab46eb2680a0347f', 'Contact', 1, 0),
(86, '6ab46eb2804e31655', '6ab46eb2834bdd94d', 'Lead', 1, 0),
(87, '6ab46f6e8f866e4ca', '6ab46f6e94d8c93cf', 'User', 1, 0),
(88, '6ab4700d54c6f88e5', '6ab4700d55f914bfe', 'Contact', 1, 0),
(89, '6ab4700d852c3feb3', '6ab4700d8a8646b16', 'Lead', 1, 0),
(90, '6ab470ce812384983', '6ab470ce8299bc7e1', 'Contact', 1, 0),
(91, '6ab470ce9fec1f3f5', '6ab470cea4459948d', 'Lead', 1, 0),
(92, '6ab56b1004272d4d4', '6ab56b10066abe501', 'Contact', 1, 0),
(93, '6ab56b10545c7d495', '6ab56b105efbb9932', 'Lead', 1, 0),
(94, '6ab56bfb38259d755', '6ab56bfb39e7411f0', 'Contact', 1, 0),
(95, '6ab56bfb57847ca58', '6ab56bfb594b2a57a', 'Lead', 1, 0),
(96, '6ab947ec84b373ea6', '6ab947ec8f6228b15', 'User', 1, 0),
(97, '6ab950abe4e2b7d93', '6ab950abe778e7b50', 'Contact', 1, 0),
(98, '6ab950ac2851a857d', '6ab950ac305fd0deb', 'Lead', 1, 0),
(99, '6ab9519f56d068dc2', '6ab9519f589a52776', 'Contact', 1, 0),
(100, '6ab9519f7826b1928', '6ab9519f7b37f78a1', 'Lead', 1, 0),
(101, '6ab9534ae4b547b41', '6ab9534aedb3e4b07', 'Contact', 1, 0),
(102, '6ab9534c9f4d694ac', '6ab9534cc333c49a6', 'Lead', 1, 0),
(103, '6ab957567904f3196', '6ab9575681bd8d530', 'Contact', 1, 0),
(104, '6ab957574f385c31c', '6ab9575769e0479d2', 'Lead', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `entity_phone_number`
--

CREATE TABLE `entity_phone_number` (
  `id` bigint NOT NULL,
  `entity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primary` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `entity_phone_number`
--

INSERT INTO `entity_phone_number` (`id`, `entity_id`, `phone_number_id`, `entity_type`, `primary`, `deleted`) VALUES
(1, '6a75c20957b18cd36', '6a75c20fd8fbaec69', 'Lead', 1, 0),
(2, '6a75c3589c9310ab8', '6a75c358c92a386b8', 'Lead', 1, 0),
(3, '6a75dffa76f9b89ab', '6a75e00047cc1ca56', 'Lead', 1, 0),
(4, '6a75e19810b0d48e3', '6a75e00047cc1ca56', 'Lead', 1, 0),
(5, '6a846deff3235112b', '6a75c358c92a386b8', 'Lead', 1, 0),
(6, '6a846f6678ebbc0d6', '6a75e00047cc1ca56', 'Contact', 1, 0),
(7, '6aa97027e44cccaed', '6aa97027e94952c22', 'Contact', 1, 0),
(8, '6aa9707c81e10ed11', '6aa97027e94952c22', 'Contact', 1, 0),
(9, '6aa970c9c9ceceee6', '6aa97027e94952c22', 'Contact', 1, 0),
(10, '6aa9711b124defb62', '6aa97027e94952c22', 'Contact', 1, 0),
(11, '6aa97161d9736f477', '6aa97027e94952c22', 'Contact', 1, 0),
(12, '6aa971781a36265e0', '6aa97027e94952c22', 'Contact', 1, 0),
(13, '6aa971a0359061564', '6aa97027e94952c22', 'Contact', 1, 0),
(14, '6aa971df035b5a7de', '6aa97027e94952c22', 'Contact', 1, 0),
(15, '6aa9720786fec6827', '6aa97027e94952c22', 'Contact', 1, 0),
(16, '6aa9721d5cfb78189', '6aa97027e94952c22', 'Contact', 1, 0),
(17, '6aa972626e647d509', '6aa97027e94952c22', 'Contact', 1, 0),
(18, '6aa97283242d0f14c', '6aa97027e94952c22', 'Contact', 1, 0),
(19, '6aa972afa05bb1962', '6aa97027e94952c22', 'Contact', 1, 0),
(20, '6aac067ecb576c3be', '6aac06842ac61ed43', 'Lead', 1, 0),
(21, '6aac1fd308e28a575', '6aac1fd649c88dc14', 'Account', 1, 0),
(22, '6aac21ab8d4b745e3', '6aa97027e94952c22', 'Contact', 1, 0),
(23, '6aac22cb40f7c2b6d', '6aac1fd649c88dc14', 'Account', 1, 0),
(24, '6aac2331b180c1760', '6aac2331b818ebbf7', 'Account', 1, 0),
(25, '6aac23770c4917f70', '6aac2377227054106', 'Account', 1, 0),
(26, '6aac26d8353dbe803', '6a75e00047cc1ca56', 'User', 1, 0),
(27, '6aac2bb906f516467', '6aa97027e94952c22', 'Contact', 1, 0),
(28, '6aac3e5a099cb5ce5', '6aac06842ac61ed43', 'Lead', 1, 0),
(29, '6aac3ea194c1a6ae5', '6a75e00047cc1ca56', 'Lead', 1, 0),
(30, '6aac3f4fee6b1abf8', '6a75e00047cc1ca56', 'Lead', 1, 0),
(31, '6aaedc7a391c5ade9', '6a75e00047cc1ca56', 'Contact', 1, 0),
(32, '6aaeddc8998a80aea', '6a75e00047cc1ca56', 'Account', 1, 0),
(33, '6aaedddaad2d61b42', '6a75e00047cc1ca56', 'Account', 1, 0),
(34, '6aaede1f5155e6337', '6a75e00047cc1ca56', 'Contact', 1, 0),
(35, '6aaede2d93c2695e3', '6a75e00047cc1ca56', 'Contact', 1, 0),
(36, '6aaef2562d4629c72', '6aa97027e94952c22', 'Contact', 1, 0),
(37, '6aaef3a218e090724', '6aa97027e94952c22', 'Contact', 1, 0),
(38, '6aaef4ac945d5cbcb', '6aa97027e94952c22', 'Contact', 1, 0),
(39, '6aaefbeea4014e85e', '6aa97027e94952c22', 'Contact', 1, 0),
(40, '6aaefe54541e33d7a', '6aa97027e94952c22', 'Contact', 1, 0),
(41, '6aaefee603bad7bb7', '6aa97027e94952c22', 'Contact', 1, 0),
(42, '6aaeffef92a17fa2a', '6aa97027e94952c22', 'Contact', 1, 0),
(43, '6aaf02a84dc2bb9b9', '6aa97027e94952c22', 'Contact', 1, 0),
(44, '6aaf078d4953ab7f2', '6aa97027e94952c22', 'Contact', 1, 0),
(45, '6ab1357fc31de97a4', '6a75e00047cc1ca56', 'User', 1, 0),
(46, '6ab137247c7e89e95', '6aac1fd649c88dc14', 'User', 1, 0),
(47, '6ab13761ec5d5ba6c', '6aac1fd649c88dc14', 'User', 1, 0),
(48, '6ab1378d32fd51548', '6aac1fd649c88dc14', 'User', 1, 0),
(49, '6ab1382d95735e377', '6aac1fd649c88dc14', 'Account', 1, 0),
(50, '6ab2dd8794e32da38', '6a75e00047cc1ca56', 'User', 1, 0),
(51, '6ab30c2126ccf9451', '6aa97027e94952c22', 'Contact', 1, 0),
(52, '6ab312a91f95b1d28', '6aa97027e94952c22', 'Contact', 1, 0),
(53, '6ab468f51105aa4c5', '6aa97027e94952c22', 'Contact', 1, 0),
(54, '6ab46c78983751c28', '6aa97027e94952c22', 'Contact', 1, 0),
(55, '6ab46eb266265e142', '6aa97027e94952c22', 'Contact', 1, 0),
(56, '6ab46f6e8f866e4ca', '6aac1fd649c88dc14', 'User', 1, 0),
(57, '6ab4700d54c6f88e5', '6aa97027e94952c22', 'Contact', 1, 0),
(58, '6ab470ce812384983', '6aa97027e94952c22', 'Contact', 1, 0),
(59, '6ab56b1004272d4d4', '6aa97027e94952c22', 'Contact', 1, 0),
(60, '6ab56bfb38259d755', '6aa97027e94952c22', 'Contact', 1, 0),
(61, '6ab947ec84b373ea6', '6a75e00047cc1ca56', 'User', 1, 0),
(62, '6ab950abe4e2b7d93', '6aa97027e94952c22', 'Contact', 1, 0),
(63, '6ab9519f56d068dc2', '6aa97027e94952c22', 'Contact', 1, 0),
(64, '6ab9534ae4b547b41', '6aa97027e94952c22', 'Contact', 1, 0),
(65, '6ab957567904f3196', '6aa97027e94952c22', 'Contact', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `entity_team`
--

CREATE TABLE `entity_team` (
  `id` bigint NOT NULL,
  `entity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `team_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `entity_user`
--

CREATE TABLE `entity_user` (
  `id` bigint NOT NULL,
  `entity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `export`
--

CREATE TABLE `export` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `params` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `notify_on_finish` tinyint(1) NOT NULL DEFAULT '0',
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachment_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `extension`
--

CREATE TABLE `extension` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `version` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_list` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `license_status` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `license_status_message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_installed` tinyint(1) NOT NULL DEFAULT '0',
  `check_version_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `external_account`
--

CREATE TABLE `external_account` (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `is_locked` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `group_email_folder`
--

CREATE TABLE `group_email_folder` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `order` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `group_email_folder_team`
--

CREATE TABLE `group_email_folder_team` (
  `id` bigint NOT NULL,
  `group_email_folder_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `team_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `import`
--

CREATE TABLE `import` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `entity_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_index` int DEFAULT NULL,
  `params` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `attribute_list` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `file_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `import_entity`
--

CREATE TABLE `import_entity` (
  `id` bigint NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `is_imported` tinyint(1) NOT NULL DEFAULT '0',
  `is_updated` tinyint(1) NOT NULL DEFAULT '0',
  `is_duplicate` tinyint(1) NOT NULL DEFAULT '0',
  `entity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `import_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `import_error`
--

CREATE TABLE `import_error` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `row_index` int DEFAULT NULL,
  `export_row_index` int DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `validation_failures` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `row` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `import_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inbound_email`
--

CREATE TABLE `inbound_email` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `email_address` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `port` int DEFAULT '993',
  `security` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'SSL',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monitored_folders` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fetch_validity_number` int DEFAULT '0',
  `fetch_since` date DEFAULT NULL,
  `fetch_data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `add_all_team_users` tinyint(1) NOT NULL DEFAULT '1',
  `sent_folder` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_sent_emails` tinyint(1) NOT NULL DEFAULT '0',
  `keep_fetched_emails_unread` tinyint(1) NOT NULL DEFAULT '0',
  `connected_at` datetime DEFAULT NULL,
  `exclude_from_reply` tinyint(1) NOT NULL DEFAULT '0',
  `use_imap` tinyint(1) NOT NULL DEFAULT '1',
  `use_smtp` tinyint(1) NOT NULL DEFAULT '0',
  `smtp_is_shared` tinyint(1) NOT NULL DEFAULT '0',
  `smtp_is_for_mass_email` tinyint(1) NOT NULL DEFAULT '0',
  `smtp_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtp_port` int DEFAULT '587',
  `smtp_auth` tinyint(1) NOT NULL DEFAULT '1',
  `smtp_security` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'TLS',
  `smtp_username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtp_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtp_auth_mechanism` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'login',
  `create_case` tinyint(1) NOT NULL DEFAULT '0',
  `case_distribution` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Direct-Assignment',
  `target_user_position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reply` tinyint(1) NOT NULL DEFAULT '0',
  `reply_from_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reply_to_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reply_from_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imap_handler` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtp_handler` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `assign_to_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `team_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reply_email_template_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `group_email_folder_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inbound_email_team`
--

CREATE TABLE `inbound_email_team` (
  `id` bigint NOT NULL,
  `inbound_email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `team_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `integration`
--

CREATE TABLE `integration` (
  `id` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `enabled` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job`
--

CREATE TABLE `job` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `execute_time` datetime DEFAULT NULL,
  `number` bigint UNSIGNED NOT NULL,
  `class_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `queue` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `group` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_group` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `started_at` datetime DEFAULT NULL,
  `executed_at` datetime DEFAULT NULL,
  `pid` int DEFAULT NULL,
  `attempts` int DEFAULT NULL,
  `target_id` varchar(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `failed_attempts` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `scheduled_job_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `job`
--

INSERT INTO `job` (`id`, `name`, `deleted`, `status`, `execute_time`, `number`, `class_name`, `job`, `data`, `queue`, `group`, `target_group`, `started_at`, `executed_at`, `pid`, `attempts`, `target_id`, `target_type`, `failed_attempts`, `created_at`, `modified_at`, `scheduled_job_id`) VALUES
('6a4ec9bd324da9e3b', 'Dummy', 0, 'Pending', '2026-07-08 22:05:49', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2026-07-08 22:05:49', '2026-07-08 22:05:49', '6a4ec91a3cc8b29b5'),
('6a5fbf4732a7dc72d', 'Dummy', 0, 'Pending', '2026-07-21 18:49:43', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2026-07-21 18:49:43', '2026-07-21 18:49:43', '6a4ec91a3cc8b29b5'),
('6ab2d42c073a3f5c6', 'Espo\\Tools\\Stream\\Jobs\\ControlFollowers', 0, 'Pending', '2026-09-22 19:16:59', 3, 'Espo\\Tools\\Stream\\Jobs\\ControlFollowers', NULL, '{\"entityType\":\"Contact\",\"entityId\":\"6aaede2d93c2695e3\"}', 'q1', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2026-09-22 19:17:00', '2026-09-22 19:17:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kanban_order`
--

CREATE TABLE `kanban_order` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `order` smallint DEFAULT NULL,
  `group` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `knowledge_base_article`
--

CREATE TABLE `knowledge_base_article` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Draft',
  `language` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Article',
  `publish_date` date DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `order` int DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `body` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `body_plain` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version_number` bigint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `knowledge_base_article_knowledge_base_category`
--

CREATE TABLE `knowledge_base_article_knowledge_base_category` (
  `id` bigint NOT NULL,
  `knowledge_base_article_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `knowledge_base_category_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `knowledge_base_article_portal`
--

CREATE TABLE `knowledge_base_article_portal` (
  `id` bigint NOT NULL,
  `portal_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `knowledge_base_article_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `knowledge_base_category`
--

CREATE TABLE `knowledge_base_category` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `order` int DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `knowledge_base_category_path`
--

CREATE TABLE `knowledge_base_category_path` (
  `id` int NOT NULL,
  `ascendor_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descendor_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `layout_record`
--

CREATE TABLE `layout_record` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `layout_set_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `layout_set`
--

CREATE TABLE `layout_set` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `layout_list` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lead`
--

CREATE TABLE `lead` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `salutation_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'New',
  `source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `industry` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opportunity_amount` double DEFAULT NULL,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_street` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_state` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_postal_code` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `do_not_call` tinyint(1) NOT NULL DEFAULT '0',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `converted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `account_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `middle_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opportunity_amount_currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stream_updated_at` datetime DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campaign_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_opportunity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `lead_capture`
--

CREATE TABLE `lead_capture` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `subscribe_to_target_list` tinyint(1) NOT NULL DEFAULT '1',
  `subscribe_contact_to_target_list` tinyint(1) NOT NULL DEFAULT '1',
  `field_list` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `field_params` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `duplicate_check` tinyint(1) NOT NULL DEFAULT '1',
  `opt_in_confirmation` tinyint(1) NOT NULL DEFAULT '0',
  `opt_in_confirmation_lifetime` int DEFAULT '48',
  `opt_in_confirmation_success_message` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `create_lead_before_opt_in_confirmation` tinyint(1) NOT NULL DEFAULT '0',
  `skip_opt_in_confirmation_if_subscribed` tinyint(1) NOT NULL DEFAULT '0',
  `lead_source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Web Site',
  `api_key` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `form_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `form_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `form_title` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `form_theme` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `form_text` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `form_success_text` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `form_success_redirect_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `form_language` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `form_frame_ancestors` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `form_captcha` tinyint(1) NOT NULL DEFAULT '0',
  `phone_number_country` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `campaign_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_list_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opt_in_confirmation_email_template_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pipeline_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_team_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inbound_email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lead_capture_log_record`
--

CREATE TABLE `lead_capture_log_record` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `number` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_created` tinyint(1) NOT NULL DEFAULT '0',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `lead_capture_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lead_meeting`
--

CREATE TABLE `lead_meeting` (
  `id` bigint NOT NULL,
  `lead_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meeting_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'None',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lead_target_list`
--

CREATE TABLE `lead_target_list` (
  `id` bigint NOT NULL,
  `lead_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_list_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opted_out` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mass_action`
--

CREATE TABLE `mass_action` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `entity_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `params` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `processed_count` int DEFAULT NULL,
  `notify_on_finish` tinyint(1) NOT NULL DEFAULT '0',
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mass_email`
--

CREATE TABLE `mass_email` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `store_sent_emails` tinyint(1) NOT NULL DEFAULT '0',
  `opt_out_entirely` tinyint(1) NOT NULL DEFAULT '0',
  `from_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reply_to_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reply_to_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `email_template_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campaign_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inbound_email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mass_email_target_list`
--

CREATE TABLE `mass_email_target_list` (
  `id` bigint NOT NULL,
  `mass_email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_list_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mass_email_target_list_excluding`
--

CREATE TABLE `mass_email_target_list_excluding` (
  `id` bigint NOT NULL,
  `mass_email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_list_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meeting`
--

CREATE TABLE `meeting` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Planned',
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `is_all_day` tinyint(1) NOT NULL DEFAULT '0',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `join_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `external_service` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `date_start_date` date DEFAULT NULL,
  `date_end_date` date DEFAULT NULL,
  `stream_updated_at` datetime DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `meeting_user`
--

CREATE TABLE `meeting_user` (
  `id` bigint NOT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meeting_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'None',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `next_number`
--

CREATE TABLE `next_number` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `field_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE `note` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `post` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Post',
  `target_type` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number` bigint UNSIGNED NOT NULL,
  `is_global` tinyint(1) NOT NULL DEFAULT '0',
  `is_internal` tinyint(1) NOT NULL DEFAULT '0',
  `is_pinned` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `super_parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `super_parent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `note_portal`
--

CREATE TABLE `note_portal` (
  `id` bigint NOT NULL,
  `note_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portal_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `note_team`
--

CREATE TABLE `note_team` (
  `id` bigint NOT NULL,
  `note_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `team_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `note_user`
--

CREATE TABLE `note_user` (
  `id` bigint NOT NULL,
  `note_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `note_user`
--

INSERT INTO `note_user` (`id`, `note_id`, `user_id`, `deleted`) VALUES
(1, '6aa9716266b98329d', '6a4ec9b12dae98deb', 0),
(2, '6aa9716273fc36c13', '6a4ec9b12dae98deb', 0),
(3, '6aa9717888a3a9141', '6a4ec9b12dae98deb', 0),
(4, '6aa971788e5b2f1c0', '6a4ec9b12dae98deb', 0),
(5, '6aa97178a69531772', '6a4ec9b12dae98deb', 0),
(6, '6aa971a1e02740bc9', '6a4ec9b12dae98deb', 0),
(7, '6aa971a1ed899b0b0', '6a4ec9b12dae98deb', 0),
(8, '6aa971a26ce4aafa7', '6a4ec9b12dae98deb', 0),
(9, '6aa971df886622d76', '6a4ec9b12dae98deb', 0),
(10, '6aa971df8d657fd7a', '6a4ec9b12dae98deb', 0),
(11, '6aa971dfa3f8079a8', '6a4ec9b12dae98deb', 0),
(12, '6aa97208061b01630', '6a4ec9b12dae98deb', 0),
(13, '6aa972080b676b777', '6a4ec9b12dae98deb', 0),
(14, '6aa97208284aa46df', '6a4ec9b12dae98deb', 0),
(15, '6aa9721dd050fc71b', '6a4ec9b12dae98deb', 0),
(16, '6aa9721dd5dc314f3', '6a4ec9b12dae98deb', 0),
(17, '6aa9721def4efcdc0', '6a4ec9b12dae98deb', 0),
(18, '6aa9726317b20da19', '6a4ec9b12dae98deb', 0),
(19, '6aa972631ddf5a385', '6a4ec9b12dae98deb', 0),
(20, '6aa972633bcc3a7ad', '6a4ec9b12dae98deb', 0),
(21, '6aa97283cda12561d', '6a4ec9b12dae98deb', 0),
(22, '6aa97283d3bb91064', '6a4ec9b12dae98deb', 0),
(23, '6aa9728403c65e987', '6a4ec9b12dae98deb', 0),
(24, '6aa972b02ea465740', '6a4ec9b12dae98deb', 0),
(25, '6aa972b03644cc866', '6a4ec9b12dae98deb', 0),
(26, '6aa972b05b36d115e', '6a4ec9b12dae98deb', 0),
(27, '6aac21afe35dff34b', '6a4ec9b12dae98deb', 0),
(28, '6aac21afef611f3ca', '6a4ec9b12dae98deb', 0),
(29, '6aac21b044865e030', '6a4ec9b12dae98deb', 0),
(30, '6aac2bb9609749900', '6a4ec9b12dae98deb', 0),
(31, '6aac2bb9639b86d6d', '6a4ec9b12dae98deb', 0),
(32, '6aac2bb975e120e2a', '6a4ec9b12dae98deb', 0),
(33, '6aaef257a5d4494a4', '6a4ec9b12dae98deb', 0),
(34, '6aaef257a988cc3d9', '6a4ec9b12dae98deb', 0),
(35, '6aaef257bc12115fd', '6a4ec9b12dae98deb', 0),
(36, '6aaef3a26a645b8cb', '6a4ec9b12dae98deb', 0),
(37, '6aaef3a26e52c2059', '6a4ec9b12dae98deb', 0),
(38, '6aaef3a27ea1a58da', '6a4ec9b12dae98deb', 0),
(39, '6aaef4ad01ef43ce9', '6a4ec9b12dae98deb', 0),
(40, '6aaef4ad06b72e792', '6a4ec9b12dae98deb', 0),
(41, '6aaef4ad1b5c6b7ba', '6a4ec9b12dae98deb', 0),
(42, '6aaefbef0cf221b7e', '6a4ec9b12dae98deb', 0),
(43, '6aaefbef1196b7e9c', '6a4ec9b12dae98deb', 0),
(44, '6aaefbef34505dadd', '6a4ec9b12dae98deb', 0),
(45, '6aaefe54bd905bc1c', '6a4ec9b12dae98deb', 0),
(46, '6aaefe54c12e93f4a', '6a4ec9b12dae98deb', 0),
(47, '6aaefe54d249a5a2a', '6a4ec9b12dae98deb', 0),
(48, '6aaefee6638ea89bf', '6a4ec9b12dae98deb', 0),
(49, '6aaefee66755aba2f', '6a4ec9b12dae98deb', 0),
(50, '6aaefee67c8482cb6', '6a4ec9b12dae98deb', 0),
(51, '6aaefff012dfe0eba', '6a4ec9b12dae98deb', 0),
(52, '6aaefff01f10229a0', '6a4ec9b12dae98deb', 0),
(53, '6aaefff03b6f28cc7', '6a4ec9b12dae98deb', 0),
(54, '6aaf02a8a4da8f2be', '6a4ec9b12dae98deb', 0),
(55, '6aaf02a8a86a79bab', '6a4ec9b12dae98deb', 0),
(56, '6aaf02a8bb2dbf087', '6a4ec9b12dae98deb', 0),
(57, '6aaf078da451c9cf2', '6a4ec9b12dae98deb', 0),
(58, '6aaf078da8d63d153', '6a4ec9b12dae98deb', 0),
(59, '6aaf078dbdfb8b44c', '6a4ec9b12dae98deb', 0),
(60, '6ab30c2322f951a95', '6a4ec9b12dae98deb', 0),
(61, '6ab30c232ed2e9fdf', '6a4ec9b12dae98deb', 0),
(62, '6ab30c23604ce78de', '6a4ec9b12dae98deb', 0),
(63, '6ab312ab214cf3d7b', '6a4ec9b12dae98deb', 0),
(64, '6ab312ab2b1598a82', '6a4ec9b12dae98deb', 0),
(65, '6ab312ab65fee96cc', '6a4ec9b12dae98deb', 0),
(66, '6ab468f6aa801b4d6', '6a4ec9b12dae98deb', 0),
(67, '6ab468f6afdd7c80d', '6a4ec9b12dae98deb', 0),
(68, '6ab468f6d3e828041', '6a4ec9b12dae98deb', 0),
(69, '6ab46c79301d1738a', '6a4ec9b12dae98deb', 0),
(70, '6ab46c79367e79acc', '6a4ec9b12dae98deb', 0),
(71, '6ab46c795687216eb', '6a4ec9b12dae98deb', 0),
(72, '6ab46eb2d5f7e606a', '6a4ec9b12dae98deb', 0),
(73, '6ab46eb2db02cfb78', '6a4ec9b12dae98deb', 0),
(74, '6ab46eb2f39aa06ac', '6a4ec9b12dae98deb', 0),
(75, '6ab4700e23dd5823c', '6a4ec9b12dae98deb', 0),
(76, '6ab4700e2c2e524a9', '6a4ec9b12dae98deb', 0),
(77, '6ab4700e5637e35c4', '6a4ec9b12dae98deb', 0),
(78, '6ab470cf0eb62df2b', '6a4ec9b12dae98deb', 0),
(79, '6ab470cf149cb3fbf', '6a4ec9b12dae98deb', 0),
(80, '6ab470cf2d4f88c8f', '6a4ec9b12dae98deb', 0),
(81, '6ab56b1611e2ba065', '6a4ec9b12dae98deb', 0),
(82, '6ab56b161fbf3ec75', '6a4ec9b12dae98deb', 0),
(83, '6ab56b166b929fcd1', '6a4ec9b12dae98deb', 0),
(84, '6ab56bfbbfbf408a5', '6a4ec9b12dae98deb', 0),
(85, '6ab56bfbc4a446548', '6a4ec9b12dae98deb', 0),
(86, '6ab56bfbe0f79195d', '6a4ec9b12dae98deb', 0),
(87, '6ab950b0adf4db19f', '6a4ec9b12dae98deb', 0),
(88, '6ab950b0bd1844384', '6a4ec9b12dae98deb', 0),
(89, '6ab950b117ade2d2a', '6a4ec9b12dae98deb', 0),
(90, '6ab9519fe996d219e', '6a4ec9b12dae98deb', 0),
(91, '6ab9519ff359f557a', '6a4ec9b12dae98deb', 0),
(92, '6ab951a036b96fe08', '6a4ec9b12dae98deb', 0),
(93, '6ab9534fbafeda205', '6a4ec9b12dae98deb', 0),
(94, '6ab9534fd90d9d47c', '6a4ec9b12dae98deb', 0),
(95, '6ab953509088bfb1f', '6a4ec9b12dae98deb', 0),
(96, '6ab9575a763c223b8', '6a4ec9b12dae98deb', 0),
(97, '6ab9575a967223f2f', '6a4ec9b12dae98deb', 0),
(98, '6ab9575b55569caa7', '6a4ec9b12dae98deb', 0);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `number` bigint UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `email_is_processed` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `message` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `action_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_parent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `deleted`, `number`, `data`, `type`, `read`, `email_is_processed`, `created_at`, `message`, `action_id`, `is_featured`, `user_id`, `related_id`, `related_type`, `related_parent_id`, `related_parent_type`, `created_by_id`) VALUES
('6aa971629dbf37691', 0, 3, '{\"entityType\":\"Meeting\",\"entityId\":\"6aa971625f7f5c854\",\"entityName\":\"Executive Q3 BI Review 6aa971625c520\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:25:06', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa971795cf519547', 0, 9, '{\"entityType\":\"Meeting\",\"entityId\":\"6aa97178839f23595\",\"entityName\":\"Executive Q3 BI Review 6aa9717880722\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:25:29', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa971796706da481', 0, 10, '{\"entityType\":\"Task\",\"entityId\":\"6aa97178c23b1a088\",\"entityName\":\"Deploy Codak Custom Modules 6aa97178c069c\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:25:29', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa971a454f5be9c2', 0, 16, '{\"entityType\":\"Meeting\",\"entityId\":\"6aa971a1cee9eb085\",\"entityName\":\"Executive Q3 BI Review 6aa971a1bcf40\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:26:12', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa971a4882ee62cf', 0, 17, '{\"entityType\":\"Task\",\"entityId\":\"6aa971a2a52b03812\",\"entityName\":\"Deploy Codak Custom Modules 6aa971a29e8be\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:26:12', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa971e0428f6259b', 0, 23, '{\"entityType\":\"Meeting\",\"entityId\":\"6aa971df818a9fca6\",\"entityName\":\"Executive Q3 BI Review 6aa971df7b362\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:27:12', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa971e05a6099e32', 0, 24, '{\"entityType\":\"Task\",\"entityId\":\"6aa971dfb5112e369\",\"entityName\":\"Deploy Codak Custom Modules 6aa971dfb3882\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:27:12', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa97208b4a8b8bb1', 0, 30, '{\"entityType\":\"Meeting\",\"entityId\":\"6aa97208016964057\",\"entityName\":\"Executive Q3 BI Review 6aa97207f2295\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:27:52', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa97208c85ac2411', 0, 31, '{\"entityType\":\"Task\",\"entityId\":\"6aa972083729547af\",\"entityName\":\"Deploy Codak Custom Modules 6aa9720835a93\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:27:52', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa9721e8e9979b01', 0, 37, '{\"entityType\":\"Meeting\",\"entityId\":\"6aa9721dc9edf834e\",\"entityName\":\"Executive Q3 BI Review 6aa9721dc5d09\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:28:14', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa9721ea20b28dd6', 0, 38, '{\"entityType\":\"Task\",\"entityId\":\"6aa9721e0cc73e5d9\",\"entityName\":\"Deploy Codak Custom Modules 6aa9721e0b239\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:28:14', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa972640c62f7960', 0, 44, '{\"entityType\":\"Meeting\",\"entityId\":\"6aa972631153840ca\",\"entityName\":\"Executive Q3 BI Review 6aa972630cb00\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:29:24', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa97264275ff9df6', 0, 45, '{\"entityType\":\"Task\",\"entityId\":\"6aa9726353461ccbf\",\"entityName\":\"Deploy Codak Custom Modules 6aa9726350e65\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:29:24', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa9728504b0ce3e4', 0, 51, '{\"entityType\":\"Meeting\",\"entityId\":\"6aa97283c64d33e31\",\"entityName\":\"Executive Q3 BI Review 6aa97283c067b\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:29:57', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa9728524ef8c9c3', 0, 52, '{\"entityType\":\"Task\",\"entityId\":\"6aa972841ed0deef3\",\"entityName\":\"Deploy Codak Custom Modules 6aa972841c636\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:29:57', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa972b10e1dd8e78', 0, 58, '{\"entityType\":\"Meeting\",\"entityId\":\"6aa972b0276632940\",\"entityName\":\"Executive Q3 BI Review 6aa972b022cca\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:30:41', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aa972b127b17a758', 0, 59, '{\"entityType\":\"Task\",\"entityId\":\"6aa972b06f09f4589\",\"entityName\":\"Deploy Codak Custom Modules 6aa972b06cab6\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-15 16:30:41', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aac21b1df2df30c4', 0, 65, '{\"entityType\":\"Meeting\",\"entityId\":\"6aac21afb95480159\",\"entityName\":\"Executive Q3 BI Review 6aac21af4c728\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-17 17:21:53', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aac21b2022244b7f', 0, 66, '{\"entityType\":\"Task\",\"entityId\":\"6aac21b072abd2bf4\",\"entityName\":\"Deploy Codak Custom Modules 6aac21b06beb5\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-17 17:21:54', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aac2bb9e869ac8cf', 0, 72, '{\"entityType\":\"Meeting\",\"entityId\":\"6aac2bb95b25f9d27\",\"entityName\":\"Executive Q3 BI Review 6aac2bb957e66\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-17 18:04:41', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aac2bba017b31cbe', 0, 73, '{\"entityType\":\"Task\",\"entityId\":\"6aac2bb984b9e3a75\",\"entityName\":\"Deploy Codak Custom Modules 6aac2bb983812\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-17 18:04:42', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaef2583f1e6bc13', 0, 79, '{\"entityType\":\"Meeting\",\"entityId\":\"6aaef2579f108f583\",\"entityName\":\"Executive Q3 BI Review 6aaef2579bbbc\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 20:36:40', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaef2584d416a681', 0, 80, '{\"entityType\":\"Task\",\"entityId\":\"6aaef257caddd5a91\",\"entityName\":\"Deploy Codak Custom Modules 6aaef257c98cb\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 20:36:40', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaef3a2ea2d6ac15', 0, 86, '{\"entityType\":\"Meeting\",\"entityId\":\"6aaef3a2663aac681\",\"entityName\":\"Executive Q3 BI Review 6aaef3a2634e6\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 20:42:10', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaef3a303894e312', 0, 87, '{\"entityType\":\"Task\",\"entityId\":\"6aaef3a28cad39971\",\"entityName\":\"Deploy Codak Custom Modules 6aaef3a28b8e3\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 20:42:11', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaef4ad942c6fbfc', 0, 93, '{\"entityType\":\"Meeting\",\"entityId\":\"6aaef4acf0a2e04ae\",\"entityName\":\"Executive Q3 BI Review 6aaef4aced866\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 20:46:37', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaef4ada43acb393', 0, 94, '{\"entityType\":\"Task\",\"entityId\":\"6aaef4ad2b8f2c8ee\",\"entityName\":\"Deploy Codak Custom Modules 6aaef4ad2a51f\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 20:46:37', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaefbef9e6c9d028', 0, 100, '{\"entityType\":\"Meeting\",\"entityId\":\"6aaefbef074e58a61\",\"entityName\":\"Executive Q3 BI Review 6aaefbef044aa\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 21:17:35', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaefbefaa0dfc077', 0, 101, '{\"entityType\":\"Task\",\"entityId\":\"6aaefbef42be2a23f\",\"entityName\":\"Deploy Codak Custom Modules 6aaefbef41335\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 21:17:35', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaefe554b4e8a290', 0, 107, '{\"entityType\":\"Meeting\",\"entityId\":\"6aaefe54b922bd16f\",\"entityName\":\"Executive Q3 BI Review 6aaefe54b613f\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 21:27:49', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaefe555941efbc2', 0, 108, '{\"entityType\":\"Task\",\"entityId\":\"6aaefe54e00a6408e\",\"entityName\":\"Deploy Codak Custom Modules 6aaefe54dea04\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 21:27:49', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaefee6efb4be7e6', 0, 114, '{\"entityType\":\"Meeting\",\"entityId\":\"6aaefee65ea9136f0\",\"entityName\":\"Executive Q3 BI Review 6aaefee65b9da\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 21:30:14', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaefee708578ca52', 0, 115, '{\"entityType\":\"Task\",\"entityId\":\"6aaefee68e2661189\",\"entityName\":\"Deploy Codak Custom Modules 6aaefee68cc16\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 21:30:15', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaefff0dba8f7a77', 0, 121, '{\"entityType\":\"Meeting\",\"entityId\":\"6aaefff0098d94456\",\"entityName\":\"Executive Q3 BI Review 6aaefff001ce4\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 21:34:40', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaefff0e902826b0', 0, 122, '{\"entityType\":\"Task\",\"entityId\":\"6aaefff05389947a4\",\"entityName\":\"Deploy Codak Custom Modules 6aaefff051421\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 21:34:40', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaf02a9305d63e36', 0, 128, '{\"entityType\":\"Meeting\",\"entityId\":\"6aaf02a89efdcc83c\",\"entityName\":\"Executive Q3 BI Review 6aaf02a89c5bb\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 21:46:17', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaf02a93dbc97243', 0, 129, '{\"entityType\":\"Task\",\"entityId\":\"6aaf02a8c7d074afc\",\"entityName\":\"Deploy Codak Custom Modules 6aaf02a8c6778\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 21:46:17', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaf078e409ad8a02', 0, 135, '{\"entityType\":\"Meeting\",\"entityId\":\"6aaf078d9ee7e4661\",\"entityName\":\"Executive Q3 BI Review 6aaf078d9b77f\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 22:07:10', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6aaf078e4f13a7663', 0, 136, '{\"entityType\":\"Task\",\"entityId\":\"6aaf078dccb69357c\",\"entityName\":\"Deploy Codak Custom Modules 6aaf078dcb669\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-19 22:07:10', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab137fb0095f54e6', 0, 137, '{\"entityType\":\"Account\",\"entityId\":\"6aaeddc8998a80aea\",\"entityName\":\"Sopor temptatio tres circumvenio deprimo cura defessus uberrime derideo.\",\"userId\":\"6a4ec9b12dae98deb\",\"userName\":\"Admin\"}', 'EntityRemoved', 0, 0, '2026-09-21 13:58:19', NULL, NULL, 0, '6aac26d8353dbe803', NULL, NULL, NULL, NULL, '6a4ec9b12dae98deb'),
('6ab137fb0a28ddd9b', 0, 138, '{\"entityType\":\"Account\",\"entityId\":\"6aaedddaad2d61b42\",\"entityName\":\"Earum usus mollitia solus.\",\"userId\":\"6a4ec9b12dae98deb\",\"userName\":\"Admin\"}', 'EntityRemoved', 0, 0, '2026-09-21 13:58:19', NULL, NULL, 0, '6aac26d8353dbe803', NULL, NULL, NULL, NULL, '6a4ec9b12dae98deb'),
('6ab2d42b9f6e8923c', 0, 139, '{\"noteId\":\"6ab2d42b886b8a75d\"}', 'Note', 0, 0, '2026-09-22 19:16:59', NULL, '6ab2d42b57acdb146', 0, '6aac26d8353dbe803', '6ab2d42b886b8a75d', 'Note', '6aaede2d93c2695e3', 'Contact', NULL),
('6ab30c24d8f7fee0c', 0, 145, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab30c23061f2b105\",\"entityName\":\"Executive Q3 BI Review 6ab30c22d6b52\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-22 23:15:48', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab30c24f03246c96', 0, 146, '{\"entityType\":\"Task\",\"entityId\":\"6ab30c23918e5563d\",\"entityName\":\"Deploy Codak Custom Modules 6ab30c2383b4a\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-22 23:15:48', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab312ae2e297a3c5', 0, 152, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab312ab099eb99e1\",\"entityName\":\"Executive Q3 BI Review 6ab312aaf389e\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-22 23:43:42', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab312ae5fc17b572', 0, 153, '{\"entityType\":\"Task\",\"entityId\":\"6ab312ab90674d34f\",\"entityName\":\"Deploy Codak Custom Modules 6ab312ab8b16d\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-22 23:43:42', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab468f82fd48f3a5', 0, 159, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab468f6a3f2bdec1\",\"entityName\":\"Executive Q3 BI Review 6ab468f69f963\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-24 00:04:08', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab468f852bd48ec6', 0, 160, '{\"entityType\":\"Task\",\"entityId\":\"6ab468f702bd91e39\",\"entityName\":\"Deploy Codak Custom Modules 6ab468f6f28b5\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-24 00:04:08', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab46c7a090961e34', 0, 166, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab46c792a6d6fee5\",\"entityName\":\"Executive Q3 BI Review 6ab46c7926f72\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-24 00:19:06', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab46c7a18338b706', 0, 167, '{\"entityType\":\"Task\",\"entityId\":\"6ab46c7971a3fa81d\",\"entityName\":\"Deploy Codak Custom Modules 6ab46c796f50c\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-24 00:19:06', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab46eb3996d3cd4a', 0, 173, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab46eb2cfaf470a1\",\"entityName\":\"Executive Q3 BI Review 6ab46eb2cbf44\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-24 00:28:35', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab46eb3aa8f11b2c', 0, 174, '{\"entityType\":\"Task\",\"entityId\":\"6ab46eb312717cf27\",\"entityName\":\"Deploy Codak Custom Modules 6ab46eb310be6\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-24 00:28:35', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab4700f2b5594543', 0, 180, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab4700e1c002d68a\",\"entityName\":\"Executive Q3 BI Review 6ab4700e17659\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-24 00:34:23', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab4700f42c548d4c', 0, 181, '{\"entityType\":\"Task\",\"entityId\":\"6ab4700e6ab865ff6\",\"entityName\":\"Deploy Codak Custom Modules 6ab4700e68a1e\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-24 00:34:23', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab470cfc0db6896a', 0, 187, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab470cf078b51811\",\"entityName\":\"Executive Q3 BI Review 6ab470cf03690\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-24 00:37:35', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab470cfd13886393', 0, 188, '{\"entityType\":\"Task\",\"entityId\":\"6ab470cf42b4bf606\",\"entityName\":\"Deploy Codak Custom Modules 6ab470cf408e7\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-24 00:37:35', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab56b18659bc7760', 0, 194, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab56b15eab1da8b9\",\"entityName\":\"Executive Q3 BI Review 6ab56b15c0526\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-24 18:25:28', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab56b187f3dfd342', 0, 195, '{\"entityType\":\"Task\",\"entityId\":\"6ab56b16a88156827\",\"entityName\":\"Deploy Codak Custom Modules 6ab56b169da5b\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-24 18:25:28', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab56bfc9a46b039d', 0, 201, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab56bfbb94e544bf\",\"entityName\":\"Executive Q3 BI Review 6ab56bfbb4973\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-24 18:29:16', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab56bfcacacd22ff', 0, 202, '{\"entityType\":\"Task\",\"entityId\":\"6ab56bfc031139a71\",\"entityName\":\"Deploy Codak Custom Modules 6ab56bfc0117f\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 1, 0, '2026-09-24 18:29:16', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab950b332bfb9fac', 0, 208, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab950b07674401d7\",\"entityName\":\"Executive Q3 BI Review 6ab950b014a43\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-27 17:21:55', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab950b3479e65595', 0, 209, '{\"entityType\":\"Task\",\"entityId\":\"6ab950b14e71749fd\",\"entityName\":\"Deploy Codak Custom Modules 6ab950b13e2a6\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-27 17:21:55', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab951a0dc548e1d9', 0, 215, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab9519fe0b0712e9\",\"entityName\":\"Executive Q3 BI Review 6ab9519fdc997\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-27 17:25:52', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab951a0eb46995a6', 0, 216, '{\"entityType\":\"Task\",\"entityId\":\"6ab951a04805e6e75\",\"entityName\":\"Deploy Codak Custom Modules 6ab951a046515\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-27 17:25:52', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab95355cfad3a3d5', 0, 222, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab9534f9908fcf44\",\"entityName\":\"Executive Q3 BI Review 6ab9534f71ed0\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-27 17:33:09', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab95356515e183a6', 0, 223, '{\"entityType\":\"Task\",\"entityId\":\"6ab953511db3a941a\",\"entityName\":\"Deploy Codak Custom Modules 6ab953510d9e0\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-27 17:33:10', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab95761107d6a7c4', 0, 229, '{\"entityType\":\"Meeting\",\"entityId\":\"6ab9575a4f8302ff3\",\"entityName\":\"Executive Q3 BI Review 6ab9575a1daa3\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-27 17:50:25', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system'),
('6ab95761903061a96', 0, 230, '{\"entityType\":\"Task\",\"entityId\":\"6ab9575c0405366ee\",\"entityName\":\"Deploy Codak Custom Modules 6ab9575be1111\",\"userId\":\"system\",\"userName\":\"System\"}', 'EntityRemoved', 0, 0, '2026-09-27 17:50:25', NULL, NULL, 0, '6a4ec9b12dae98deb', NULL, NULL, NULL, NULL, 'system');

-- --------------------------------------------------------

--
-- Table structure for table `opportunity`
--

CREATE TABLE `opportunity` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `amount` double DEFAULT NULL,
  `stage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Prospecting',
  `last_stage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `probability` int DEFAULT NULL,
  `lead_source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `close_date` date DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `amount_currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stream_updated_at` datetime DEFAULT NULL,
  `account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campaign_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version_number` bigint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `o_auth_account`
--

CREATE TABLE `o_auth_account` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `access_token` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `refresh_token` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `provider_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `o_auth_provider`
--

CREATE TABLE `o_auth_provider` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `client_id` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_secret` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `authorization_endpoint` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `token_endpoint` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `authorization_prompt` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'none',
  `scopes` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `authorization_params` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `scope_separator` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_change_request`
--

CREATE TABLE `password_change_request` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `request_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phone_number`
--

CREATE TABLE `phone_number` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numeric` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invalid` tinyint(1) NOT NULL DEFAULT '0',
  `opt_out` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `phone_number`
--

INSERT INTO `phone_number` (`id`, `name`, `deleted`, `type`, `numeric`, `invalid`, `opt_out`) VALUES
('6a75c20fd8fbaec69', '+15661613554', 0, 'Mobile', '15661613554', 0, 0),
('6a75c358c92a386b8', '+11566161355', 0, 'Mobile', '11566161355', 0, 0),
('6a75e00047cc1ca56', '+11156616135', 0, 'Mobile', '11156616135', 0, 0),
('6aa97027e94952c22', '+15550199', 0, 'Mobile', '15550199', 0, 0),
('6aac06842ac61ed43', '+201156616135', 0, 'Mobile', '201156616135', 0, 0),
('6aac1fd649c88dc14', '+10115661613', 0, 'Mobile', '10115661613', 0, 0),
('6aac2331b818ebbf7', '+11156616134', 0, 'Office', '11156616134', 0, 0),
('6aac2377227054106', '+11156661613', 0, 'Office', '11156661613', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `pipeline`
--

CREATE TABLE `pipeline` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `order` int DEFAULT NULL,
  `status` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `field` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` int DEFAULT NULL,
  `is_available_for_all` tinyint(1) NOT NULL DEFAULT '1',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pipeline_stage`
--

CREATE TABLE `pipeline_stage` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `order` int DEFAULT NULL,
  `mapped_status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `pipeline_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `portal`
--

CREATE TABLE `portal` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `custom_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `tab_list` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `quick_create_list` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `application_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theme` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theme_params` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `language` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time_zone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_format` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time_format` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `week_start` int DEFAULT '-1',
  `default_currency` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dashboard_layout` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `dashlets_options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `custom_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auth_token_lifetime` double DEFAULT NULL,
  `auth_token_max_idle_time` double DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `modified_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `logo_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_logo_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layout_set_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authentication_provider_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `portal_portal_role`
--

CREATE TABLE `portal_portal_role` (
  `id` bigint NOT NULL,
  `portal_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portal_role_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `portal_role`
--

CREATE TABLE `portal_role` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `field_data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `export_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `mass_update_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `portal_role_user`
--

CREATE TABLE `portal_role_user` (
  `id` bigint NOT NULL,
  `portal_role_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `portal_user`
--

CREATE TABLE `portal_user` (
  `id` bigint NOT NULL,
  `portal_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `preferences`
--

CREATE TABLE `preferences` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `reminder`
--

CREATE TABLE `reminder` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `remind_at` datetime DEFAULT NULL,
  `start_at` datetime DEFAULT NULL,
  `type` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Popup',
  `seconds` int DEFAULT '0',
  `is_submitted` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `assignment_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `user_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `message_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `portal_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `group_email_account_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `export_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `mass_update_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `data_privacy_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `follower_management_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `audit_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `mention_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `user_calendar_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `lock_permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not-set',
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `field_data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `role_team`
--

CREATE TABLE `role_team` (
  `id` bigint NOT NULL,
  `role_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `team_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_user`
--

CREATE TABLE `role_user` (
  `id` bigint NOT NULL,
  `role_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `scheduled_job`
--

CREATE TABLE `scheduled_job` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `job` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `scheduling` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_run` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `is_internal` tinyint(1) NOT NULL DEFAULT '0',
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `scheduled_job`
--

INSERT INTO `scheduled_job` (`id`, `name`, `deleted`, `job`, `status`, `scheduling`, `last_run`, `created_at`, `modified_at`, `is_internal`, `created_by_id`, `modified_by_id`) VALUES
('6a4ec91a277494e40', 'Submit Popup Reminders', 0, 'SubmitPopupReminders', 'Active', '* * * * *', NULL, '2026-07-08 22:03:06', '2026-07-08 22:03:06', 1, NULL, NULL),
('6a4ec91a34891a6bb', 'Process Job Group', 0, 'ProcessJobGroup', 'Active', '* * * * *', NULL, '2026-07-08 22:03:06', '2026-07-08 22:03:06', 1, NULL, NULL),
('6a4ec91a3668a5958', 'Process Job Queue q0', 0, 'ProcessJobQueueQ0', 'Active', '* * * * *', NULL, '2026-07-08 22:03:06', '2026-07-08 22:03:06', 1, NULL, NULL),
('6a4ec91a3843537d1', 'Process Job Queue q1', 0, 'ProcessJobQueueQ1', 'Active', '*/1 * * * *', NULL, '2026-07-08 22:03:06', '2026-07-08 22:03:06', 1, NULL, NULL),
('6a4ec91a3a6c0d983', 'Process Job Queue e0', 0, 'ProcessJobQueueE0', 'Active', '* * * * *', NULL, '2026-07-08 22:03:06', '2026-07-08 22:03:06', 1, NULL, NULL),
('6a4ec91a3cc8b29b5', 'Dummy', 0, 'Dummy', 'Active', '1 */12 * * *', NULL, '2026-07-08 22:03:06', '2026-07-08 22:03:06', 1, NULL, NULL),
('6a4ec91a3f229fd9c', 'Check for New Version', 0, 'CheckNewVersion', 'Active', '15 5 * * *', NULL, '2026-07-08 22:03:06', '2026-07-08 22:03:06', 1, NULL, NULL),
('6a4ec91a41812a7e9', 'Check for New Versions of Installed Extensions', 0, 'CheckNewExtensionVersion', 'Active', '25 5 * * *', NULL, '2026-07-08 22:03:06', '2026-07-08 22:03:06', 1, NULL, NULL),
('6a4ec91a437bbefcb', 'Sync Currency Rates', 0, 'SyncCurrencyRates', 'Active', '2 0 * * *', NULL, '2026-07-08 22:03:06', '2026-07-08 22:03:06', 1, NULL, NULL),
('6a4ec9bd2007da31c', 'Clean-up', 0, 'Cleanup', 'Active', '1 1 * * 0', NULL, '2026-07-08 22:05:49', '2026-07-08 22:05:49', 0, 'system', NULL),
('6a4ec9bd224e3af35', 'Auth Token Control', 0, 'AuthTokenControl', 'Active', '*/6 * * * *', NULL, '2026-07-08 22:05:49', '2026-07-08 22:05:49', 0, 'system', NULL),
('6a4ec9bd24108d9eb', 'Send Email Notifications', 0, 'SendEmailNotifications', 'Active', '*/2 * * * *', NULL, '2026-07-08 22:05:49', '2026-07-08 22:05:49', 0, 'system', NULL),
('6a4ec9bd25df09a4a', 'Process Webhook Queue', 0, 'ProcessWebhookQueue', 'Active', '*/2 * * * *', NULL, '2026-07-08 22:05:49', '2026-07-08 22:05:49', 0, 'system', NULL),
('6a4ec9bd278935988', 'Check Personal Email Accounts', 0, 'CheckEmailAccounts', 'Active', '*/1 * * * *', NULL, '2026-07-08 22:05:49', '2026-07-08 22:05:49', 0, 'system', NULL),
('6a4ec9bd297df3f8f', 'Check Group Email Accounts', 0, 'CheckInboundEmails', 'Active', '*/1 * * * *', NULL, '2026-07-08 22:05:49', '2026-07-08 22:05:49', 0, 'system', NULL),
('6a4ec9bd2b4e43c9a', 'Send Scheduled Emails', 0, 'SendScheduledEmails', 'Active', '*/10 * * * *', NULL, '2026-07-08 22:05:49', '2026-07-08 22:05:49', 0, 'system', NULL),
('6a4ec9bd2d192a885', 'Control Knowledge Base Article Status', 0, 'ControlKnowledgeBaseArticleStatus', 'Active', '10 1 * * *', NULL, '2026-07-08 22:05:49', '2026-07-08 22:05:49', 0, 'system', NULL),
('6a4ec9bd2ecb929ba', 'Send Email Reminders', 0, 'SendEmailReminders', 'Active', '*/2 * * * *', NULL, '2026-07-08 22:05:49', '2026-07-08 22:05:49', 0, 'system', NULL),
('6a4ec9bd309b761c1', 'Send Mass Emails', 0, 'ProcessMassEmail', 'Active', '10,30,50 * * * *', NULL, '2026-07-08 22:05:49', '2026-07-08 22:05:49', 0, 'system', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `scheduled_job_log_record`
--

CREATE TABLE `scheduled_job_log_record` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `execution_time` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `scheduled_job_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sms`
--

CREATE TABLE `sms` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `from_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Archived',
  `date_sent` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `from_phone_number_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `replied_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sms_phone_number`
--

CREATE TABLE `sms_phone_number` (
  `id` bigint NOT NULL,
  `sms_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_type` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `star_subscription`
--

CREATE TABLE `star_subscription` (
  `id` bigint NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `entity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stream_subscription`
--

CREATE TABLE `stream_subscription` (
  `id` bigint NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `entity_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `stream_subscription`
--

INSERT INTO `stream_subscription` (`id`, `deleted`, `entity_id`, `entity_type`, `user_id`) VALUES
(1, 0, '6aa060e3037fe2e9f', 'Meeting', '6a4ec9b12dae98deb'),
(28, 0, '6aac0c848326b8e4f', 'Task', '6a4ec9b12dae98deb'),
(38, 0, '6aac426e843bf005b', 'Opportunity', '6aac26d8353dbe803'),
(39, 0, '6aac4280778049cac', 'Opportunity', '6aac26d8353dbe803'),
(42, 0, '6aaede1f5155e6337', 'Contact', '6aac26d8353dbe803'),
(43, 0, '6aaede2d93c2695e3', 'Contact', '6aac26d8353dbe803'),
(71, 0, '6ab1382d95735e377', 'Account', '6aac26d8353dbe803');

-- --------------------------------------------------------

--
-- Table structure for table `system_data`
--

CREATE TABLE `system_data` (
  `id` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `last_password_recovery_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `system_data`
--

INSERT INTO `system_data` (`id`, `deleted`, `last_password_recovery_date`) VALUES
('1', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `target`
--

CREATE TABLE `target` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `salutation_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '',
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_street` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_state` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_postal_code` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `do_not_call` tinyint(1) NOT NULL DEFAULT '0',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `middle_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `target_list`
--

CREATE TABLE `target_list` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `category_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `target_list_category`
--

CREATE TABLE `target_list_category` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `order` int DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `target_list_category_path`
--

CREATE TABLE `target_list_category_path` (
  `id` int NOT NULL,
  `ascendor_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descendor_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `target_list_user`
--

CREATE TABLE `target_list_user` (
  `id` bigint NOT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_list_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opted_out` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Not Started',
  `priority` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Normal',
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `date_start_date` date DEFAULT NULL,
  `date_end_date` date DEFAULT NULL,
  `date_completed` datetime DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `stream_updated_at` datetime DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version_number` bigint DEFAULT '0',
  `email_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `name`, `deleted`, `status`, `priority`, `date_start`, `date_end`, `date_start_date`, `date_end_date`, `date_completed`, `description`, `created_at`, `modified_at`, `stream_updated_at`, `parent_id`, `parent_type`, `account_id`, `contact_id`, `created_by_id`, `modified_by_id`, `assigned_user_id`, `version_number`, `email_id`) VALUES
('6a6cffba2f90f9907', 'Complete Security Audit', 1, 'Completed', 'Normal', NULL, NULL, NULL, NULL, '2026-07-31 20:04:10', NULL, '2026-07-31 20:04:10', '2026-07-31 20:04:10', '2026-07-31 20:04:10', NULL, NULL, NULL, NULL, 'system', 'system', NULL, 1, NULL),
('6a6df70d6a93af8de', 'Audit Security Protocols', 1, 'Started', 'Normal', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-01 13:39:25', '2026-08-01 13:39:25', '2026-08-01 13:39:25', NULL, NULL, NULL, NULL, 'system', 'system', NULL, 1, NULL),
('6a6df70db51885e88', 'Database Migration Checklist', 1, 'Completed', 'Normal', NULL, NULL, NULL, NULL, '2026-08-01 13:39:25', NULL, '2026-08-01 13:39:25', '2026-08-01 13:39:25', '2026-08-01 13:39:25', NULL, NULL, NULL, NULL, 'system', 'system', NULL, 1, NULL),
('6aa97178c23b1a088', 'Deploy Codak Custom Modules 6aa97178c069c', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-15 16:25:28', NULL, '2026-09-15 16:25:28', '2026-09-15 16:25:29', '2026-09-15 16:25:28', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aa971a2a52b03812', 'Deploy Codak Custom Modules 6aa971a29e8be', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-15 16:26:10', NULL, '2026-09-15 16:26:10', '2026-09-15 16:26:12', '2026-09-15 16:26:10', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aa971dfb5112e369', 'Deploy Codak Custom Modules 6aa971dfb3882', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-15 16:27:11', NULL, '2026-09-15 16:27:11', '2026-09-15 16:27:12', '2026-09-15 16:27:11', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aa972083729547af', 'Deploy Codak Custom Modules 6aa9720835a93', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-15 16:27:52', NULL, '2026-09-15 16:27:52', '2026-09-15 16:27:52', '2026-09-15 16:27:52', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aa9721e0cc73e5d9', 'Deploy Codak Custom Modules 6aa9721e0b239', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-15 16:28:14', NULL, '2026-09-15 16:28:14', '2026-09-15 16:28:14', '2026-09-15 16:28:14', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aa9726353461ccbf', 'Deploy Codak Custom Modules 6aa9726350e65', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-15 16:29:23', NULL, '2026-09-15 16:29:23', '2026-09-15 16:29:24', '2026-09-15 16:29:23', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aa972841ed0deef3', 'Deploy Codak Custom Modules 6aa972841c636', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-15 16:29:56', NULL, '2026-09-15 16:29:56', '2026-09-15 16:29:57', '2026-09-15 16:29:56', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aa972b06f09f4589', 'Deploy Codak Custom Modules 6aa972b06cab6', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-15 16:30:40', NULL, '2026-09-15 16:30:40', '2026-09-15 16:30:41', '2026-09-15 16:30:40', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aac0c848326b8e4f', 'Degenero dens carbo.', 0, 'Not Started', 'Normal', '2026-09-02 00:00:00', '2026-09-04 00:00:00', '2026-09-02', '2026-09-03', NULL, 'Clibanus solutio curtus cedo vobis sophismata debeo.', '2026-09-17 15:51:32', '2026-09-17 15:51:32', '2026-09-17 15:51:32', NULL, NULL, NULL, NULL, '6a4ec9b12dae98deb', NULL, '6a4ec9b12dae98deb', 1, NULL),
('6aac21b072abd2bf4', 'Deploy Codak Custom Modules 6aac21b06beb5', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-17 17:21:52', NULL, '2026-09-17 17:21:52', '2026-09-17 17:21:54', '2026-09-17 17:21:52', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aac2bb984b9e3a75', 'Deploy Codak Custom Modules 6aac2bb983812', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-17 18:04:41', NULL, '2026-09-17 18:04:41', '2026-09-17 18:04:42', '2026-09-17 18:04:41', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aaef257caddd5a91', 'Deploy Codak Custom Modules 6aaef257c98cb', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-19 20:36:39', NULL, '2026-09-19 20:36:39', '2026-09-19 20:36:40', '2026-09-19 20:36:39', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aaef3a28cad39971', 'Deploy Codak Custom Modules 6aaef3a28b8e3', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-19 20:42:10', NULL, '2026-09-19 20:42:10', '2026-09-19 20:42:11', '2026-09-19 20:42:10', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aaef4ad2b8f2c8ee', 'Deploy Codak Custom Modules 6aaef4ad2a51f', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-19 20:46:37', NULL, '2026-09-19 20:46:37', '2026-09-19 20:46:37', '2026-09-19 20:46:37', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aaefbef42be2a23f', 'Deploy Codak Custom Modules 6aaefbef41335', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-19 21:17:35', NULL, '2026-09-19 21:17:35', '2026-09-19 21:17:35', '2026-09-19 21:17:35', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aaefe54e00a6408e', 'Deploy Codak Custom Modules 6aaefe54dea04', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-19 21:27:48', NULL, '2026-09-19 21:27:48', '2026-09-19 21:27:49', '2026-09-19 21:27:48', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aaefee68e2661189', 'Deploy Codak Custom Modules 6aaefee68cc16', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-19 21:30:14', NULL, '2026-09-19 21:30:14', '2026-09-19 21:30:15', '2026-09-19 21:30:14', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aaefff05389947a4', 'Deploy Codak Custom Modules 6aaefff051421', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-19 21:34:40', NULL, '2026-09-19 21:34:40', '2026-09-19 21:34:40', '2026-09-19 21:34:40', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aaf02a8c7d074afc', 'Deploy Codak Custom Modules 6aaf02a8c6778', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-19 21:46:16', NULL, '2026-09-19 21:46:16', '2026-09-19 21:46:17', '2026-09-19 21:46:16', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6aaf078dccb69357c', 'Deploy Codak Custom Modules 6aaf078dcb669', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-19 22:07:09', NULL, '2026-09-19 22:07:09', '2026-09-19 22:07:10', '2026-09-19 22:07:09', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab30c23918e5563d', 'Deploy Codak Custom Modules 6ab30c2383b4a', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-22 23:15:47', NULL, '2026-09-22 23:15:47', '2026-09-22 23:15:48', '2026-09-22 23:15:47', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab312ab90674d34f', 'Deploy Codak Custom Modules 6ab312ab8b16d', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-22 23:43:39', NULL, '2026-09-22 23:43:39', '2026-09-22 23:43:42', '2026-09-22 23:43:39', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab468f702bd91e39', 'Deploy Codak Custom Modules 6ab468f6f28b5', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-24 00:04:07', NULL, '2026-09-24 00:04:07', '2026-09-24 00:04:08', '2026-09-24 00:04:07', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab46c7971a3fa81d', 'Deploy Codak Custom Modules 6ab46c796f50c', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-24 00:19:05', NULL, '2026-09-24 00:19:05', '2026-09-24 00:19:06', '2026-09-24 00:19:05', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab46eb312717cf27', 'Deploy Codak Custom Modules 6ab46eb310be6', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-24 00:28:35', NULL, '2026-09-24 00:28:35', '2026-09-24 00:28:35', '2026-09-24 00:28:35', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab4700e6ab865ff6', 'Deploy Codak Custom Modules 6ab4700e68a1e', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-24 00:34:22', NULL, '2026-09-24 00:34:22', '2026-09-24 00:34:23', '2026-09-24 00:34:22', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab470cf42b4bf606', 'Deploy Codak Custom Modules 6ab470cf408e7', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-24 00:37:35', NULL, '2026-09-24 00:37:35', '2026-09-24 00:37:35', '2026-09-24 00:37:35', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab56b16a88156827', 'Deploy Codak Custom Modules 6ab56b169da5b', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-24 18:25:26', NULL, '2026-09-24 18:25:26', '2026-09-24 18:25:28', '2026-09-24 18:25:26', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab56bfc031139a71', 'Deploy Codak Custom Modules 6ab56bfc0117f', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-24 18:29:16', NULL, '2026-09-24 18:29:16', '2026-09-24 18:29:16', '2026-09-24 18:29:16', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab950b14e71749fd', 'Deploy Codak Custom Modules 6ab950b13e2a6', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-27 17:21:53', NULL, '2026-09-27 17:21:53', '2026-09-27 17:21:55', '2026-09-27 17:21:53', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab951a04805e6e75', 'Deploy Codak Custom Modules 6ab951a046515', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-27 17:25:52', NULL, '2026-09-27 17:25:52', '2026-09-27 17:25:52', '2026-09-27 17:25:52', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab953511db3a941a', 'Deploy Codak Custom Modules 6ab953510d9e0', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-27 17:33:05', NULL, '2026-09-27 17:33:05', '2026-09-27 17:33:10', '2026-09-27 17:33:05', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL),
('6ab9575c0405366ee', 'Deploy Codak Custom Modules 6ab9575be1111', 1, 'Completed', 'High', NULL, NULL, NULL, NULL, '2026-09-27 17:50:20', NULL, '2026-09-27 17:50:20', '2026-09-27 17:50:25', '2026-09-27 17:50:20', NULL, NULL, NULL, NULL, 'system', 'system', '6a4ec9b12dae98deb', 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `position_list` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `layout_set_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `working_time_calendar_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team_user`
--

CREATE TABLE `team_user` (
  `id` bigint NOT NULL,
  `team_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `template`
--

CREATE TABLE `template` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `body` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `header` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `footer` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `entity_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `left_margin` double DEFAULT '10',
  `right_margin` double DEFAULT '10',
  `top_margin` double DEFAULT '10',
  `bottom_margin` double DEFAULT '20',
  `print_footer` tinyint(1) NOT NULL DEFAULT '0',
  `print_header` tinyint(1) NOT NULL DEFAULT '0',
  `footer_position` double DEFAULT '10',
  `header_position` double DEFAULT '0',
  `style` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `page_orientation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Portrait',
  `page_format` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'A4',
  `page_width` double DEFAULT NULL,
  `page_height` double DEFAULT NULL,
  `font_face` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version_number` bigint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `two_factor_code`
--

CREATE TABLE `two_factor_code` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `method` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attempts_left` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `unique_id`
--

CREATE TABLE `unique_id` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `terminate_at` datetime DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `user_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'regular',
  `password` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_version` int NOT NULL DEFAULT '0',
  `auth_method` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `api_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salutation_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_color` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `middle_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delete_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `default_team_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dashboard_template_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `working_time_calendar_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layout_set_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_max_accounts_quota` int DEFAULT '5',
  `c_max_leads_quota` int DEFAULT '5',
  `c_max_contacts_quota` int DEFAULT '5',
  `c_max_opportunities_quota` int DEFAULT '5',
  `c_max_users_quota` int DEFAULT '5',
  `c_enable_admin_access` tinyint(1) NOT NULL DEFAULT '0',
  `c_allowed_admin_items` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `stream_updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `deleted`, `user_name`, `type`, `password`, `password_version`, `auth_method`, `api_key`, `salutation_name`, `first_name`, `last_name`, `is_active`, `title`, `avatar_color`, `gender`, `created_at`, `modified_at`, `middle_name`, `delete_id`, `default_team_id`, `contact_id`, `avatar_id`, `created_by_id`, `dashboard_template_id`, `working_time_calendar_id`, `layout_set_id`, `c_max_accounts_quota`, `c_max_leads_quota`, `c_max_contacts_quota`, `c_max_opportunities_quota`, `c_max_users_quota`, `c_enable_admin_access`, `c_allowed_admin_items`, `stream_updated_at`) VALUES
('6a4ec9b12dae98deb', 0, 'admin', 'admin', '$2y$12$JH/0b1b5UnjJC/0X5NXaYu9zCWRP4bL/adxXd6NbIl0UqMI5tea1q', 5, NULL, NULL, NULL, NULL, 'Admin', 1, NULL, NULL, NULL, '2026-07-08 22:05:37', '2026-09-27 17:27:24', NULL, '0', NULL, NULL, NULL, 'system', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '[]', NULL),
('system', 0, 'system', 'system', NULL, 0, NULL, NULL, NULL, NULL, 'System', 1, NULL, NULL, NULL, '2026-07-08 22:03:06', '2026-07-08 22:03:06', NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE `user_data` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `auth2_f_a` tinyint(1) NOT NULL DEFAULT '0',
  `auth2_f_a_method` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auth2_f_a_totp_secret` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auth2_f_a_email_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_reaction`
--

CREATE TABLE `user_reaction` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_working_time_range`
--

CREATE TABLE `user_working_time_range` (
  `id` bigint NOT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `working_time_range_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `webhook`
--

CREATE TABLE `webhook` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `event` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `entity_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `field` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `secret_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skip_own` tinyint(1) NOT NULL DEFAULT '0',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `webhook_event_queue_item`
--

CREATE TABLE `webhook_event_queue_item` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `number` bigint UNSIGNED NOT NULL,
  `event` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `is_processed` tinyint(1) NOT NULL DEFAULT '0',
  `target_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `webhook_queue_item`
--

CREATE TABLE `webhook_queue_item` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `number` bigint UNSIGNED NOT NULL,
  `event` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `status` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `processed_at` datetime DEFAULT NULL,
  `attempts` int DEFAULT '0',
  `process_at` datetime DEFAULT NULL,
  `webhook_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `working_time_calendar`
--

CREATE TABLE `working_time_calendar` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `time_zone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time_ranges` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `weekday0` tinyint(1) NOT NULL DEFAULT '0',
  `weekday1` tinyint(1) NOT NULL DEFAULT '1',
  `weekday2` tinyint(1) NOT NULL DEFAULT '1',
  `weekday3` tinyint(1) NOT NULL DEFAULT '1',
  `weekday4` tinyint(1) NOT NULL DEFAULT '1',
  `weekday5` tinyint(1) NOT NULL DEFAULT '1',
  `weekday6` tinyint(1) NOT NULL DEFAULT '0',
  `weekday0_time_ranges` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `weekday1_time_ranges` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `weekday2_time_ranges` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `weekday3_time_ranges` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `weekday4_time_ranges` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `weekday5_time_ranges` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `weekday6_time_ranges` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `working_time_calendar_working_time_range`
--

CREATE TABLE `working_time_calendar_working_time_range` (
  `id` bigint NOT NULL,
  `working_time_calendar_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `working_time_range_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `working_time_range`
--

CREATE TABLE `working_time_range` (
  `id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `time_ranges` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `date_start` date DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `type` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Non-working',
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `created_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_by_id` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CREATED_AT_ID` (`created_at`,`id`),
  ADD KEY `IDX_CREATED_AT` (`created_at`,`deleted`),
  ADD KEY `IDX_NAME` (`name`,`deleted`),
  ADD KEY `IDX_ASSIGNED_USER` (`assigned_user_id`,`deleted`),
  ADD KEY `IDX_CAMPAIGN_ID` (`campaign_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`);

--
-- Indexes for table `account_contact`
--
ALTER TABLE `account_contact`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_ACCOUNT_ID_CONTACT_ID` (`account_id`,`contact_id`),
  ADD KEY `IDX_ACCOUNT_ID` (`account_id`),
  ADD KEY `IDX_CONTACT_ID` (`contact_id`);

--
-- Indexes for table `account_document`
--
ALTER TABLE `account_document`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_ACCOUNT_ID_DOCUMENT_ID` (`account_id`,`document_id`),
  ADD KEY `IDX_ACCOUNT_ID` (`account_id`),
  ADD KEY `IDX_DOCUMENT_ID` (`document_id`);

--
-- Indexes for table `account_portal_user`
--
ALTER TABLE `account_portal_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_USER_ID_ACCOUNT_ID` (`user_id`,`account_id`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_ACCOUNT_ID` (`account_id`);

--
-- Indexes for table `account_target_list`
--
ALTER TABLE `account_target_list`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_ACCOUNT_ID_TARGET_LIST_ID` (`account_id`,`target_list_id`),
  ADD KEY `IDX_ACCOUNT_ID` (`account_id`),
  ADD KEY `IDX_TARGET_LIST_ID` (`target_list_id`);

--
-- Indexes for table `action_history_record`
--
ALTER TABLE `action_history_record`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NUMBER` (`number`),
  ADD KEY `IDX_TARGET` (`target_type`,`target_id`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_AUTH_TOKEN_ID` (`auth_token_id`),
  ADD KEY `IDX_AUTH_LOG_RECORD_ID` (`auth_log_record_id`);

--
-- Indexes for table `address_country`
--
ALTER TABLE `address_country`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NAME` (`name`);

--
-- Indexes for table `app_log_record`
--
ALTER TABLE `app_log_record`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NUMBER` (`number`),
  ADD KEY `IDX_LEVEL` (`level`);

--
-- Indexes for table `app_secret`
--
ALTER TABLE `app_secret`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NAME_DELETE_ID` (`name`,`delete_id`),
  ADD KEY `IDX_NAME` (`name`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `array_value`
--
ALTER TABLE `array_value`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ENTITY_TYPE_VALUE` (`entity_type`,`value`),
  ADD KEY `IDX_ENTITY_VALUE` (`entity_type`,`entity_id`,`value`),
  ADD KEY `IDX_ENTITY` (`entity_id`,`entity_type`);

--
-- Indexes for table `attachment`
--
ALTER TABLE `attachment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_PARENT` (`parent_type`,`parent_id`),
  ADD KEY `IDX_RELATED` (`related_id`,`related_type`),
  ADD KEY `IDX_SOURCE` (`source_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`);

--
-- Indexes for table `authentication_provider`
--
ALTER TABLE `authentication_provider`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `auth_log_record`
--
ALTER TABLE `auth_log_record`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_IP_ADDRESS` (`ip_address`),
  ADD KEY `IDX_IP_ADDRESS_REQUEST_TIME` (`ip_address`,`request_time`),
  ADD KEY `IDX_REQUEST_TIME` (`request_time`),
  ADD KEY `IDX_USERNAME_IP_ADDRESS` (`username`,`ip_address`),
  ADD KEY `IDX_PORTAL_ID` (`portal_id`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_AUTH_TOKEN_ID` (`auth_token_id`);

--
-- Indexes for table `auth_token`
--
ALTER TABLE `auth_token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_TOKEN` (`token`,`deleted`),
  ADD KEY `IDX_HASH` (`hash`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_PORTAL_ID` (`portal_id`);

--
-- Indexes for table `autofollow`
--
ALTER TABLE `autofollow`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ENTITY_TYPE` (`entity_type`),
  ADD KEY `IDX_USER` (`user_id`);

--
-- Indexes for table `call`
--
ALTER TABLE `call`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_DATE_START_STATUS` (`date_start`,`status`),
  ADD KEY `IDX_DATE_START` (`date_start`,`deleted`),
  ADD KEY `IDX_STATUS` (`status`,`deleted`),
  ADD KEY `IDX_ASSIGNED_USER` (`assigned_user_id`,`deleted`),
  ADD KEY `IDX_ASSIGNED_USER_STATUS` (`assigned_user_id`,`status`),
  ADD KEY `IDX_UID` (`uid`),
  ADD KEY `IDX_PARENT` (`parent_id`,`parent_type`),
  ADD KEY `IDX_ACCOUNT_ID` (`account_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`),
  ADD KEY `IDX_C_CONTACT_ID` (`c_contact_id`);

--
-- Indexes for table `call_contact`
--
ALTER TABLE `call_contact`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CALL_ID_CONTACT_ID` (`call_id`,`contact_id`),
  ADD KEY `IDX_CALL_ID` (`call_id`),
  ADD KEY `IDX_CONTACT_ID` (`contact_id`);

--
-- Indexes for table `call_lead`
--
ALTER TABLE `call_lead`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CALL_ID_LEAD_ID` (`call_id`,`lead_id`),
  ADD KEY `IDX_CALL_ID` (`call_id`),
  ADD KEY `IDX_LEAD_ID` (`lead_id`);

--
-- Indexes for table `call_user`
--
ALTER TABLE `call_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_USER_ID_CALL_ID` (`user_id`,`call_id`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_CALL_ID` (`call_id`);

--
-- Indexes for table `campaign`
--
ALTER TABLE `campaign`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_AT` (`created_at`,`deleted`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`),
  ADD KEY `IDX_CONTACTS_TEMPLATE_ID` (`contacts_template_id`),
  ADD KEY `IDX_LEADS_TEMPLATE_ID` (`leads_template_id`),
  ADD KEY `IDX_ACCOUNTS_TEMPLATE_ID` (`accounts_template_id`),
  ADD KEY `IDX_USERS_TEMPLATE_ID` (`users_template_id`);

--
-- Indexes for table `campaign_log_record`
--
ALTER TABLE `campaign_log_record`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ACTION_DATE` (`action_date`,`deleted`),
  ADD KEY `IDX_ACTION` (`action`,`deleted`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_CAMPAIGN_ID` (`campaign_id`),
  ADD KEY `IDX_PARENT` (`parent_id`,`parent_type`),
  ADD KEY `IDX_OBJECT` (`object_id`,`object_type`),
  ADD KEY `IDX_QUEUE_ITEM_ID` (`queue_item_id`);

--
-- Indexes for table `campaign_target_list`
--
ALTER TABLE `campaign_target_list`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CAMPAIGN_ID_TARGET_LIST_ID` (`campaign_id`,`target_list_id`),
  ADD KEY `IDX_CAMPAIGN_ID` (`campaign_id`),
  ADD KEY `IDX_TARGET_LIST_ID` (`target_list_id`);

--
-- Indexes for table `campaign_target_list_excluding`
--
ALTER TABLE `campaign_target_list_excluding`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CAMPAIGN_ID_TARGET_LIST_ID` (`campaign_id`,`target_list_id`),
  ADD KEY `IDX_CAMPAIGN_ID` (`campaign_id`),
  ADD KEY `IDX_TARGET_LIST_ID` (`target_list_id`);

--
-- Indexes for table `campaign_tracking_url`
--
ALTER TABLE `campaign_tracking_url`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CAMPAIGN_ID` (`campaign_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`);

--
-- Indexes for table `case`
--
ALTER TABLE `case`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NUMBER` (`number`),
  ADD KEY `IDX_STATUS` (`status`,`deleted`),
  ADD KEY `IDX_ASSIGNED_USER` (`assigned_user_id`,`deleted`),
  ADD KEY `IDX_ASSIGNED_USER_STATUS` (`assigned_user_id`,`status`),
  ADD KEY `IDX_ACCOUNT_ID` (`account_id`),
  ADD KEY `IDX_LEAD_ID` (`lead_id`),
  ADD KEY `IDX_CONTACT_ID` (`contact_id`),
  ADD KEY `IDX_INBOUND_EMAIL_ID` (`inbound_email_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`);
ALTER TABLE `case` ADD FULLTEXT KEY `IDX_SYSTEM_FULL_TEXT_SEARCH` (`name`,`description`);

--
-- Indexes for table `case_contact`
--
ALTER TABLE `case_contact`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CASE_ID_CONTACT_ID` (`case_id`,`contact_id`),
  ADD KEY `IDX_CASE_ID` (`case_id`),
  ADD KEY `IDX_CONTACT_ID` (`contact_id`);

--
-- Indexes for table `case_knowledge_base_article`
--
ALTER TABLE `case_knowledge_base_article`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CASE_ID_KNOWLEDGE_BASE_ARTICLE_ID` (`case_id`,`knowledge_base_article_id`),
  ADD KEY `IDX_CASE_ID` (`case_id`),
  ADD KEY `IDX_KNOWLEDGE_BASE_ARTICLE_ID` (`knowledge_base_article_id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CREATED_AT_ID` (`created_at`,`id`),
  ADD KEY `IDX_CREATED_AT` (`created_at`,`deleted`),
  ADD KEY `IDX_FIRST_NAME` (`first_name`,`deleted`),
  ADD KEY `IDX_NAME` (`first_name`,`last_name`),
  ADD KEY `IDX_ASSIGNED_USER` (`assigned_user_id`,`deleted`),
  ADD KEY `IDX_ACCOUNT_ID` (`account_id`),
  ADD KEY `IDX_CAMPAIGN_ID` (`campaign_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`);

--
-- Indexes for table `contact_document`
--
ALTER TABLE `contact_document`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CONTACT_ID_DOCUMENT_ID` (`contact_id`,`document_id`),
  ADD KEY `IDX_CONTACT_ID` (`contact_id`),
  ADD KEY `IDX_DOCUMENT_ID` (`document_id`);

--
-- Indexes for table `contact_meeting`
--
ALTER TABLE `contact_meeting`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CONTACT_ID_MEETING_ID` (`contact_id`,`meeting_id`),
  ADD KEY `IDX_CONTACT_ID` (`contact_id`),
  ADD KEY `IDX_MEETING_ID` (`meeting_id`);

--
-- Indexes for table `contact_opportunity`
--
ALTER TABLE `contact_opportunity`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CONTACT_ID_OPPORTUNITY_ID` (`contact_id`,`opportunity_id`),
  ADD KEY `IDX_CONTACT_ID` (`contact_id`),
  ADD KEY `IDX_OPPORTUNITY_ID` (`opportunity_id`);

--
-- Indexes for table `contact_target_list`
--
ALTER TABLE `contact_target_list`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CONTACT_ID_TARGET_LIST_ID` (`contact_id`,`target_list_id`),
  ADD KEY `IDX_CONTACT_ID` (`contact_id`),
  ADD KEY `IDX_TARGET_LIST_ID` (`target_list_id`);

--
-- Indexes for table `currency`
--
ALTER TABLE `currency`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `currency_record`
--
ALTER TABLE `currency_record`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CODE_DELETE_ID` (`code`,`delete_id`),
  ADD KEY `IDX_CODE` (`code`);

--
-- Indexes for table `currency_record_rate`
--
ALTER TABLE `currency_record_rate`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_RECORD_ID_BASE_CODE_DATE` (`record_id`,`base_code`,`date`,`delete_id`),
  ADD KEY `IDX_RECORD_ID` (`record_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `dashboard_template`
--
ALTER TABLE `dashboard_template`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`),
  ADD KEY `IDX_FOLDER_ID` (`folder_id`);

--
-- Indexes for table `document_folder`
--
ALTER TABLE `document_folder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_PARENT_ID` (`parent_id`);

--
-- Indexes for table `document_folder_path`
--
ALTER TABLE `document_folder_path`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ASCENDOR_ID` (`ascendor_id`),
  ADD KEY `IDX_DESCENDOR_ID` (`descendor_id`);

--
-- Indexes for table `document_lead`
--
ALTER TABLE `document_lead`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_DOCUMENT_ID_LEAD_ID` (`document_id`,`lead_id`),
  ADD KEY `IDX_DOCUMENT_ID` (`document_id`),
  ADD KEY `IDX_LEAD_ID` (`lead_id`);

--
-- Indexes for table `document_opportunity`
--
ALTER TABLE `document_opportunity`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_DOCUMENT_ID_OPPORTUNITY_ID` (`document_id`,`opportunity_id`),
  ADD KEY `IDX_DOCUMENT_ID` (`document_id`),
  ADD KEY `IDX_OPPORTUNITY_ID` (`opportunity_id`);

--
-- Indexes for table `email`
--
ALTER TABLE `email`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_DATE_SENT` (`date_sent`,`deleted`),
  ADD KEY `IDX_DATE_SENT_STATUS` (`date_sent`,`status`,`deleted`),
  ADD KEY `IDX_MESSAGE_ID` (`message_id`),
  ADD KEY `IDX_ICS_EVENT_UID` (`ics_event_uid`),
  ADD KEY `IDX_GROUP_STATUS_FOLDER` (`group_status_folder`),
  ADD KEY `IDX_FROM_EMAIL_ADDRESS_ID` (`from_email_address_id`),
  ADD KEY `IDX_PARENT` (`parent_id`,`parent_type`),
  ADD KEY `IDX_SENT_BY_ID` (`sent_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`),
  ADD KEY `IDX_REPLIED_ID` (`replied_id`),
  ADD KEY `IDX_CREATED_EVENT` (`created_event_id`,`created_event_type`),
  ADD KEY `IDX_GROUP_FOLDER_ID` (`group_folder_id`),
  ADD KEY `IDX_ACCOUNT_ID` (`account_id`);
ALTER TABLE `email` ADD FULLTEXT KEY `IDX_SYSTEM_FULL_TEXT_SEARCH` (`name`,`body_plain`,`body`);

--
-- Indexes for table `email_account`
--
ALTER TABLE `email_account`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_EMAIL_FOLDER_ID` (`email_folder_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `email_address`
--
ALTER TABLE `email_address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_LOWER` (`lower`);

--
-- Indexes for table `email_email_account`
--
ALTER TABLE `email_email_account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_EMAIL_ID_EMAIL_ACCOUNT_ID` (`email_id`,`email_account_id`),
  ADD KEY `IDX_EMAIL_ID` (`email_id`),
  ADD KEY `IDX_EMAIL_ACCOUNT_ID` (`email_account_id`);

--
-- Indexes for table `email_email_address`
--
ALTER TABLE `email_email_address`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_EMAIL_ID_EMAIL_ADDRESS_ID_ADDRESS_TYPE` (`email_id`,`email_address_id`,`address_type`),
  ADD KEY `IDX_EMAIL_ID` (`email_id`),
  ADD KEY `IDX_EMAIL_ADDRESS_ID` (`email_address_id`);

--
-- Indexes for table `email_filter`
--
ALTER TABLE `email_filter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_PARENT` (`parent_id`,`parent_type`),
  ADD KEY `IDX_EMAIL_FOLDER_ID` (`email_folder_id`),
  ADD KEY `IDX_GROUP_EMAIL_FOLDER_ID` (`group_email_folder_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `email_folder`
--
ALTER TABLE `email_folder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `email_inbound_email`
--
ALTER TABLE `email_inbound_email`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_EMAIL_ID_INBOUND_EMAIL_ID` (`email_id`,`inbound_email_id`),
  ADD KEY `IDX_EMAIL_ID` (`email_id`),
  ADD KEY `IDX_INBOUND_EMAIL_ID` (`inbound_email_id`);

--
-- Indexes for table `email_queue_item`
--
ALTER TABLE `email_queue_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_SENT_AT` (`sent_at`),
  ADD KEY `IDX_MASS_EMAIL_ID` (`mass_email_id`),
  ADD KEY `IDX_TARGET` (`target_id`,`target_type`);

--
-- Indexes for table `email_template`
--
ALTER TABLE `email_template`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CATEGORY_ID` (`category_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `email_template_category`
--
ALTER TABLE `email_template_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_PARENT_ID` (`parent_id`);

--
-- Indexes for table `email_template_category_path`
--
ALTER TABLE `email_template_category_path`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ASCENDOR_ID` (`ascendor_id`),
  ADD KEY `IDX_DESCENDOR_ID` (`descendor_id`);

--
-- Indexes for table `email_user`
--
ALTER TABLE `email_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_EMAIL_ID_USER_ID` (`email_id`,`user_id`),
  ADD KEY `IDX_EMAIL_ID` (`email_id`),
  ADD KEY `IDX_USER_ID` (`user_id`);

--
-- Indexes for table `entity_collaborator`
--
ALTER TABLE `entity_collaborator`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_ENTITY_ID_USER_ID_ENTITY_TYPE` (`entity_id`,`user_id`,`entity_type`),
  ADD KEY `IDX_ENTITY_ID` (`entity_id`),
  ADD KEY `IDX_USER_ID` (`user_id`);

--
-- Indexes for table `entity_email_address`
--
ALTER TABLE `entity_email_address`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_ENTITY_ID_EMAIL_ADDRESS_ID_ENTITY_TYPE` (`entity_id`,`email_address_id`,`entity_type`),
  ADD KEY `IDX_ENTITY_ID` (`entity_id`),
  ADD KEY `IDX_EMAIL_ADDRESS_ID` (`email_address_id`);

--
-- Indexes for table `entity_phone_number`
--
ALTER TABLE `entity_phone_number`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_ENTITY_ID_PHONE_NUMBER_ID_ENTITY_TYPE` (`entity_id`,`phone_number_id`,`entity_type`),
  ADD KEY `IDX_ENTITY_ID` (`entity_id`),
  ADD KEY `IDX_PHONE_NUMBER_ID` (`phone_number_id`);

--
-- Indexes for table `entity_team`
--
ALTER TABLE `entity_team`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_ENTITY_ID_TEAM_ID_ENTITY_TYPE` (`entity_id`,`team_id`,`entity_type`),
  ADD KEY `IDX_ENTITY_ID` (`entity_id`),
  ADD KEY `IDX_TEAM_ID` (`team_id`);

--
-- Indexes for table `entity_user`
--
ALTER TABLE `entity_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_ENTITY_ID_USER_ID_ENTITY_TYPE` (`entity_id`,`user_id`,`entity_type`),
  ADD KEY `IDX_ENTITY_ID` (`entity_id`),
  ADD KEY `IDX_USER_ID` (`user_id`);

--
-- Indexes for table `export`
--
ALTER TABLE `export`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_ATTACHMENT` (`attachment_id`);

--
-- Indexes for table `extension`
--
ALTER TABLE `extension`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_LICENSE_STATUS` (`license_status`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`);

--
-- Indexes for table `external_account`
--
ALTER TABLE `external_account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `group_email_folder`
--
ALTER TABLE `group_email_folder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `group_email_folder_team`
--
ALTER TABLE `group_email_folder_team`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_GROUP_EMAIL_FOLDER_ID_TEAM_ID` (`group_email_folder_id`,`team_id`),
  ADD KEY `IDX_GROUP_EMAIL_FOLDER_ID` (`group_email_folder_id`),
  ADD KEY `IDX_TEAM_ID` (`team_id`);

--
-- Indexes for table `import`
--
ALTER TABLE `import`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`);

--
-- Indexes for table `import_entity`
--
ALTER TABLE `import_entity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ENTITY_IMPORT` (`import_id`,`entity_type`),
  ADD KEY `IDX_ENTITY` (`entity_id`,`entity_type`),
  ADD KEY `IDX_IMPORT` (`import_id`);

--
-- Indexes for table `import_error`
--
ALTER TABLE `import_error`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ROW_INDEX` (`row_index`),
  ADD KEY `IDX_IMPORT_ROW_INDEX` (`import_id`,`row_index`),
  ADD KEY `IDX_IMPORT_ID` (`import_id`);

--
-- Indexes for table `inbound_email`
--
ALTER TABLE `inbound_email`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ASSIGN_TO_USER_ID` (`assign_to_user_id`),
  ADD KEY `IDX_TEAM_ID` (`team_id`),
  ADD KEY `IDX_REPLY_EMAIL_TEMPLATE_ID` (`reply_email_template_id`),
  ADD KEY `IDX_GROUP_EMAIL_FOLDER_ID` (`group_email_folder_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `inbound_email_team`
--
ALTER TABLE `inbound_email_team`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_INBOUND_EMAIL_ID_TEAM_ID` (`inbound_email_id`,`team_id`),
  ADD KEY `IDX_INBOUND_EMAIL_ID` (`inbound_email_id`),
  ADD KEY `IDX_TEAM_ID` (`team_id`);

--
-- Indexes for table `integration`
--
ALTER TABLE `integration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job`
--
ALTER TABLE `job`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NUMBER` (`number`),
  ADD KEY `IDX_EXECUTE_TIME` (`status`,`execute_time`),
  ADD KEY `IDX_STATUS` (`status`,`deleted`),
  ADD KEY `IDX_STATUS_SCHEDULED_JOB_ID` (`status`,`scheduled_job_id`),
  ADD KEY `IDX_SCHEDULED_JOB_ID` (`scheduled_job_id`);

--
-- Indexes for table `kanban_order`
--
ALTER TABLE `kanban_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ENTITY_USER_ID` (`entity_type`,`entity_id`,`user_id`),
  ADD KEY `IDX_ENTITY_TYPE` (`entity_type`),
  ADD KEY `IDX_ENTITY_TYPE_USER_ID` (`entity_type`,`user_id`),
  ADD KEY `IDX_ENTITY` (`entity_id`,`entity_type`),
  ADD KEY `IDX_USER` (`user_id`);

--
-- Indexes for table `knowledge_base_article`
--
ALTER TABLE `knowledge_base_article`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`);
ALTER TABLE `knowledge_base_article` ADD FULLTEXT KEY `IDX_SYSTEM_FULL_TEXT_SEARCH` (`name`,`body_plain`);

--
-- Indexes for table `knowledge_base_article_knowledge_base_category`
--
ALTER TABLE `knowledge_base_article_knowledge_base_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_KNOWLEDGE_BASE_ARTICLE_ID_KNOWLEDGE_BASE_CATEGORY_ID` (`knowledge_base_article_id`,`knowledge_base_category_id`),
  ADD KEY `IDX_KNOWLEDGE_BASE_ARTICLE_ID` (`knowledge_base_article_id`),
  ADD KEY `IDX_KNOWLEDGE_BASE_CATEGORY_ID` (`knowledge_base_category_id`);

--
-- Indexes for table `knowledge_base_article_portal`
--
ALTER TABLE `knowledge_base_article_portal`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_PORTAL_ID_KNOWLEDGE_BASE_ARTICLE_ID` (`portal_id`,`knowledge_base_article_id`),
  ADD KEY `IDX_PORTAL_ID` (`portal_id`),
  ADD KEY `IDX_KNOWLEDGE_BASE_ARTICLE_ID` (`knowledge_base_article_id`);

--
-- Indexes for table `knowledge_base_category`
--
ALTER TABLE `knowledge_base_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_PARENT_ID` (`parent_id`);

--
-- Indexes for table `knowledge_base_category_path`
--
ALTER TABLE `knowledge_base_category_path`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ASCENDOR_ID` (`ascendor_id`),
  ADD KEY `IDX_DESCENDOR_ID` (`descendor_id`);

--
-- Indexes for table `layout_record`
--
ALTER TABLE `layout_record`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_NAME_LAYOUT_SET_ID` (`name`,`layout_set_id`),
  ADD KEY `IDX_LAYOUT_SET_ID` (`layout_set_id`);

--
-- Indexes for table `layout_set`
--
ALTER TABLE `layout_set`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lead`
--
ALTER TABLE `lead`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CREATED_AT_ID` (`created_at`,`id`),
  ADD KEY `IDX_FIRST_NAME` (`first_name`,`deleted`),
  ADD KEY `IDX_NAME` (`first_name`,`last_name`),
  ADD KEY `IDX_STATUS` (`status`,`deleted`),
  ADD KEY `IDX_CREATED_AT` (`created_at`,`deleted`),
  ADD KEY `IDX_CREATED_AT_STATUS` (`created_at`,`status`),
  ADD KEY `IDX_ASSIGNED_USER` (`assigned_user_id`,`deleted`),
  ADD KEY `IDX_ASSIGNED_USER_STATUS` (`assigned_user_id`,`status`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`),
  ADD KEY `IDX_CAMPAIGN_ID` (`campaign_id`),
  ADD KEY `IDX_CREATED_ACCOUNT_ID` (`created_account_id`),
  ADD KEY `IDX_CREATED_CONTACT_ID` (`created_contact_id`),
  ADD KEY `IDX_CREATED_OPPORTUNITY_ID` (`created_opportunity_id`),
  ADD KEY `IDX_C_ACCOUNT_ID` (`c_account_id`);

--
-- Indexes for table `lead_capture`
--
ALTER TABLE `lead_capture`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CAMPAIGN_ID` (`campaign_id`),
  ADD KEY `IDX_TARGET_LIST_ID` (`target_list_id`),
  ADD KEY `IDX_OPT_IN_CONFIRMATION_EMAIL_TEMPLATE_ID` (`opt_in_confirmation_email_template_id`),
  ADD KEY `IDX_PIPELINE_ID` (`pipeline_id`),
  ADD KEY `IDX_TARGET_TEAM_ID` (`target_team_id`),
  ADD KEY `IDX_INBOUND_EMAIL_ID` (`inbound_email_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `lead_capture_log_record`
--
ALTER TABLE `lead_capture_log_record`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NUMBER` (`number`),
  ADD KEY `IDX_LEAD_CAPTURE_ID` (`lead_capture_id`),
  ADD KEY `IDX_TARGET` (`target_id`,`target_type`);

--
-- Indexes for table `lead_meeting`
--
ALTER TABLE `lead_meeting`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_LEAD_ID_MEETING_ID` (`lead_id`,`meeting_id`),
  ADD KEY `IDX_LEAD_ID` (`lead_id`),
  ADD KEY `IDX_MEETING_ID` (`meeting_id`);

--
-- Indexes for table `lead_target_list`
--
ALTER TABLE `lead_target_list`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_LEAD_ID_TARGET_LIST_ID` (`lead_id`,`target_list_id`),
  ADD KEY `IDX_LEAD_ID` (`lead_id`),
  ADD KEY `IDX_TARGET_LIST_ID` (`target_list_id`);

--
-- Indexes for table `mass_action`
--
ALTER TABLE `mass_action`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`);

--
-- Indexes for table `mass_email`
--
ALTER TABLE `mass_email`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_EMAIL_TEMPLATE_ID` (`email_template_id`),
  ADD KEY `IDX_CAMPAIGN_ID` (`campaign_id`),
  ADD KEY `IDX_INBOUND_EMAIL_ID` (`inbound_email_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `mass_email_target_list`
--
ALTER TABLE `mass_email_target_list`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_MASS_EMAIL_ID_TARGET_LIST_ID` (`mass_email_id`,`target_list_id`),
  ADD KEY `IDX_MASS_EMAIL_ID` (`mass_email_id`),
  ADD KEY `IDX_TARGET_LIST_ID` (`target_list_id`);

--
-- Indexes for table `mass_email_target_list_excluding`
--
ALTER TABLE `mass_email_target_list_excluding`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_MASS_EMAIL_ID_TARGET_LIST_ID` (`mass_email_id`,`target_list_id`),
  ADD KEY `IDX_MASS_EMAIL_ID` (`mass_email_id`),
  ADD KEY `IDX_TARGET_LIST_ID` (`target_list_id`);

--
-- Indexes for table `meeting`
--
ALTER TABLE `meeting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_DATE_START_STATUS` (`date_start`,`status`),
  ADD KEY `IDX_DATE_START` (`date_start`,`deleted`),
  ADD KEY `IDX_STATUS` (`status`,`deleted`),
  ADD KEY `IDX_ASSIGNED_USER` (`assigned_user_id`,`deleted`),
  ADD KEY `IDX_ASSIGNED_USER_STATUS` (`assigned_user_id`,`status`),
  ADD KEY `IDX_UID` (`uid`),
  ADD KEY `IDX_PARENT` (`parent_id`,`parent_type`),
  ADD KEY `IDX_ACCOUNT_ID` (`account_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`);

--
-- Indexes for table `meeting_user`
--
ALTER TABLE `meeting_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_USER_ID_MEETING_ID` (`user_id`,`meeting_id`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_MEETING_ID` (`meeting_id`);

--
-- Indexes for table `next_number`
--
ALTER TABLE `next_number`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ENTITY_TYPE_FIELD_NAME` (`entity_type`,`field_name`),
  ADD KEY `IDX_ENTITY_TYPE` (`entity_type`);

--
-- Indexes for table `note`
--
ALTER TABLE `note`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NUMBER` (`number`),
  ADD KEY `IDX_CREATED_AT` (`created_at`),
  ADD KEY `IDX_CREATED_BY_NUMBER` (`created_by_id`,`number`),
  ADD KEY `IDX_TYPE` (`type`),
  ADD KEY `IDX_TARGET_TYPE` (`target_type`),
  ADD KEY `IDX_PARENT_ID` (`parent_id`),
  ADD KEY `IDX_PARENT_TYPE` (`parent_type`),
  ADD KEY `IDX_RELATED_ID` (`related_id`),
  ADD KEY `IDX_RELATED_TYPE` (`related_type`),
  ADD KEY `IDX_SUPER_PARENT_TYPE` (`super_parent_type`),
  ADD KEY `IDX_SUPER_PARENT_ID` (`super_parent_id`),
  ADD KEY `IDX_PARENT` (`parent_id`,`parent_type`),
  ADD KEY `IDX_RELATED` (`related_id`,`related_type`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_SUPER_PARENT` (`super_parent_id`,`super_parent_type`);
ALTER TABLE `note` ADD FULLTEXT KEY `IDX_SYSTEM_FULL_TEXT_SEARCH` (`post`);

--
-- Indexes for table `note_portal`
--
ALTER TABLE `note_portal`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NOTE_ID_PORTAL_ID` (`note_id`,`portal_id`),
  ADD KEY `IDX_NOTE_ID` (`note_id`),
  ADD KEY `IDX_PORTAL_ID` (`portal_id`);

--
-- Indexes for table `note_team`
--
ALTER TABLE `note_team`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NOTE_ID_TEAM_ID` (`note_id`,`team_id`),
  ADD KEY `IDX_NOTE_ID` (`note_id`),
  ADD KEY `IDX_TEAM_ID` (`team_id`);

--
-- Indexes for table `note_user`
--
ALTER TABLE `note_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NOTE_ID_USER_ID` (`note_id`,`user_id`),
  ADD KEY `IDX_NOTE_ID` (`note_id`),
  ADD KEY `IDX_USER_ID` (`user_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NUMBER` (`number`),
  ADD KEY `IDX_CREATED_AT` (`created_at`),
  ADD KEY `IDX_USER` (`user_id`,`number`),
  ADD KEY `IDX_USER_ID_READ_RELATED_PARENT_TYPE` (`user_id`,`deleted`,`read`,`related_parent_type`),
  ADD KEY `IDX_ACTION_ID` (`action_id`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_RELATED` (`related_id`,`related_type`),
  ADD KEY `IDX_RELATED_PARENT` (`related_parent_id`,`related_parent_type`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`);

--
-- Indexes for table `opportunity`
--
ALTER TABLE `opportunity`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CREATED_AT_ID` (`created_at`,`id`),
  ADD KEY `IDX_STAGE` (`stage`,`deleted`),
  ADD KEY `IDX_LAST_STAGE` (`last_stage`),
  ADD KEY `IDX_ASSIGNED_USER` (`assigned_user_id`,`deleted`),
  ADD KEY `IDX_CREATED_AT` (`created_at`,`deleted`),
  ADD KEY `IDX_CREATED_AT_STAGE` (`created_at`,`stage`),
  ADD KEY `IDX_ASSIGNED_USER_STAGE` (`assigned_user_id`,`stage`),
  ADD KEY `IDX_ACCOUNT_ID` (`account_id`),
  ADD KEY `IDX_CONTACT_ID` (`contact_id`),
  ADD KEY `IDX_CAMPAIGN_ID` (`campaign_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`);

--
-- Indexes for table `o_auth_account`
--
ALTER TABLE `o_auth_account`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_PROVIDER_ID` (`provider_id`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `o_auth_provider`
--
ALTER TABLE `o_auth_provider`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `password_change_request`
--
ALTER TABLE `password_change_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_REQUEST_ID` (`request_id`),
  ADD KEY `IDX_USER_ID` (`user_id`);

--
-- Indexes for table `phone_number`
--
ALTER TABLE `phone_number`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_NAME` (`name`),
  ADD KEY `IDX_NUMERIC` (`numeric`);

--
-- Indexes for table `pipeline`
--
ALTER TABLE `pipeline`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ENTITY_TYPE_STATUS` (`entity_type`,`status`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `pipeline_stage`
--
ALTER TABLE `pipeline_stage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_PIPELINE_ID` (`pipeline_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `portal`
--
ALTER TABLE `portal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CUSTOM_ID` (`custom_id`),
  ADD KEY `IDX_LAYOUT_SET_ID` (`layout_set_id`),
  ADD KEY `IDX_AUTHENTICATION_PROVIDER_ID` (`authentication_provider_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`);

--
-- Indexes for table `portal_portal_role`
--
ALTER TABLE `portal_portal_role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_PORTAL_ID_PORTAL_ROLE_ID` (`portal_id`,`portal_role_id`),
  ADD KEY `IDX_PORTAL_ID` (`portal_id`),
  ADD KEY `IDX_PORTAL_ROLE_ID` (`portal_role_id`);

--
-- Indexes for table `portal_role`
--
ALTER TABLE `portal_role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `portal_role_user`
--
ALTER TABLE `portal_role_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_PORTAL_ROLE_ID_USER_ID` (`portal_role_id`,`user_id`),
  ADD KEY `IDX_PORTAL_ROLE_ID` (`portal_role_id`),
  ADD KEY `IDX_USER_ID` (`user_id`);

--
-- Indexes for table `portal_user`
--
ALTER TABLE `portal_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_PORTAL_ID_USER_ID` (`portal_id`,`user_id`),
  ADD KEY `IDX_PORTAL_ID` (`portal_id`),
  ADD KEY `IDX_USER_ID` (`user_id`);

--
-- Indexes for table `preferences`
--
ALTER TABLE `preferences`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reminder`
--
ALTER TABLE `reminder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_REMIND_AT` (`remind_at`),
  ADD KEY `IDX_START_AT` (`start_at`),
  ADD KEY `IDX_TYPE` (`type`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_ENTITY` (`entity_id`,`entity_type`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_team`
--
ALTER TABLE `role_team`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_ROLE_ID_TEAM_ID` (`role_id`,`team_id`),
  ADD KEY `IDX_ROLE_ID` (`role_id`),
  ADD KEY `IDX_TEAM_ID` (`team_id`);

--
-- Indexes for table `role_user`
--
ALTER TABLE `role_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_ROLE_ID_USER_ID` (`role_id`,`user_id`),
  ADD KEY `IDX_ROLE_ID` (`role_id`),
  ADD KEY `IDX_USER_ID` (`user_id`);

--
-- Indexes for table `scheduled_job`
--
ALTER TABLE `scheduled_job`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `scheduled_job_log_record`
--
ALTER TABLE `scheduled_job_log_record`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_SCHEDULED_JOB_ID_EXECUTION_TIME` (`scheduled_job_id`,`execution_time`),
  ADD KEY `IDX_SCHEDULED_JOB_ID` (`scheduled_job_id`),
  ADD KEY `IDX_TARGET` (`target_id`,`target_type`);

--
-- Indexes for table `sms`
--
ALTER TABLE `sms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_DATE_SENT` (`date_sent`,`deleted`),
  ADD KEY `IDX_DATE_SENT_STATUS` (`date_sent`,`status`,`deleted`),
  ADD KEY `IDX_FROM_PHONE_NUMBER_ID` (`from_phone_number_id`),
  ADD KEY `IDX_PARENT` (`parent_id`,`parent_type`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_REPLIED_ID` (`replied_id`);

--
-- Indexes for table `sms_phone_number`
--
ALTER TABLE `sms_phone_number`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_SMS_ID_PHONE_NUMBER_ID_ADDRESS_TYPE` (`sms_id`,`phone_number_id`,`address_type`),
  ADD KEY `IDX_SMS_ID` (`sms_id`),
  ADD KEY `IDX_PHONE_NUMBER_ID` (`phone_number_id`);

--
-- Indexes for table `star_subscription`
--
ALTER TABLE `star_subscription`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_USER_ENTITY` (`user_id`,`entity_id`,`entity_type`),
  ADD KEY `IDX_USER_ENTITY_TYPE` (`user_id`,`entity_type`),
  ADD KEY `IDX_ENTITY` (`entity_id`,`entity_type`),
  ADD KEY `IDX_USER` (`user_id`);

--
-- Indexes for table `stream_subscription`
--
ALTER TABLE `stream_subscription`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_USER_ENTITY` (`user_id`,`entity_id`,`entity_type`),
  ADD KEY `IDX_ENTITY` (`entity_id`,`entity_type`),
  ADD KEY `IDX_USER` (`user_id`);

--
-- Indexes for table `system_data`
--
ALTER TABLE `system_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `target`
--
ALTER TABLE `target`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_FIRST_NAME` (`first_name`,`deleted`),
  ADD KEY `IDX_NAME` (`first_name`,`last_name`),
  ADD KEY `IDX_ASSIGNED_USER` (`assigned_user_id`,`deleted`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`);

--
-- Indexes for table `target_list`
--
ALTER TABLE `target_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_AT` (`created_at`,`deleted`),
  ADD KEY `IDX_CATEGORY_ID` (`category_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`);

--
-- Indexes for table `target_list_category`
--
ALTER TABLE `target_list_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_PARENT_ID` (`parent_id`);

--
-- Indexes for table `target_list_category_path`
--
ALTER TABLE `target_list_category_path`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ASCENDOR_ID` (`ascendor_id`),
  ADD KEY `IDX_DESCENDOR_ID` (`descendor_id`);

--
-- Indexes for table `target_list_user`
--
ALTER TABLE `target_list_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_USER_ID_TARGET_LIST_ID` (`user_id`,`target_list_id`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_TARGET_LIST_ID` (`target_list_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_DATE_START_STATUS` (`date_start`,`status`),
  ADD KEY `IDX_DATE_END_STATUS` (`date_end`,`status`),
  ADD KEY `IDX_DATE_START` (`date_start`,`deleted`),
  ADD KEY `IDX_STATUS` (`status`,`deleted`),
  ADD KEY `IDX_ASSIGNED_USER` (`assigned_user_id`,`deleted`),
  ADD KEY `IDX_ASSIGNED_USER_STATUS` (`assigned_user_id`,`status`),
  ADD KEY `IDX_PARENT` (`parent_id`,`parent_type`),
  ADD KEY `IDX_ACCOUNT_ID` (`account_id`),
  ADD KEY `IDX_CONTACT_ID` (`contact_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`),
  ADD KEY `IDX_ASSIGNED_USER_ID` (`assigned_user_id`),
  ADD KEY `IDX_EMAIL_ID` (`email_id`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_LAYOUT_SET_ID` (`layout_set_id`),
  ADD KEY `IDX_WORKING_TIME_CALENDAR_ID` (`working_time_calendar_id`);

--
-- Indexes for table `team_user`
--
ALTER TABLE `team_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_TEAM_ID_USER_ID` (`team_id`,`user_id`),
  ADD KEY `IDX_TEAM_ID` (`team_id`),
  ADD KEY `IDX_USER_ID` (`user_id`);

--
-- Indexes for table `template`
--
ALTER TABLE `template`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `two_factor_code`
--
ALTER TABLE `two_factor_code`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_AT` (`created_at`),
  ADD KEY `IDX_USER_ID_METHOD` (`user_id`,`method`),
  ADD KEY `IDX_USER_ID_METHOD_IS_ACTIVE` (`user_id`,`method`,`is_active`),
  ADD KEY `IDX_USER_ID_METHOD_CREATED_AT` (`user_id`,`method`,`created_at`),
  ADD KEY `IDX_USER_ID` (`user_id`);

--
-- Indexes for table `unique_id`
--
ALTER TABLE `unique_id`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_NAME` (`name`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_TARGET` (`target_id`,`target_type`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_USER_NAME_DELETE_ID` (`user_name`,`delete_id`),
  ADD KEY `IDX_USER_NAME` (`user_name`),
  ADD KEY `IDX_TYPE` (`type`),
  ADD KEY `IDX_DEFAULT_TEAM_ID` (`default_team_id`),
  ADD KEY `IDX_CONTACT_ID` (`contact_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_DASHBOARD_TEMPLATE_ID` (`dashboard_template_id`),
  ADD KEY `IDX_WORKING_TIME_CALENDAR_ID` (`working_time_calendar_id`),
  ADD KEY `IDX_LAYOUT_SET_ID` (`layout_set_id`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_USER_ID` (`user_id`);

--
-- Indexes for table `user_reaction`
--
ALTER TABLE `user_reaction`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_PARENT_USER_TYPE` (`parent_id`,`parent_type`,`user_id`,`type`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_PARENT` (`parent_id`,`parent_type`);

--
-- Indexes for table `user_working_time_range`
--
ALTER TABLE `user_working_time_range`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_USER_ID_WORKING_TIME_RANGE_ID` (`user_id`,`working_time_range_id`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_WORKING_TIME_RANGE_ID` (`working_time_range_id`);

--
-- Indexes for table `webhook`
--
ALTER TABLE `webhook`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_EVENT` (`event`),
  ADD KEY `IDX_ENTITY_TYPE_TYPE` (`entity_type`,`type`),
  ADD KEY `IDX_ENTITY_TYPE_FIELD` (`entity_type`,`field`),
  ADD KEY `IDX_USER_ID` (`user_id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `webhook_event_queue_item`
--
ALTER TABLE `webhook_event_queue_item`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NUMBER` (`number`),
  ADD KEY `IDX_TARGET` (`target_id`,`target_type`),
  ADD KEY `IDX_USER_ID` (`user_id`);

--
-- Indexes for table `webhook_queue_item`
--
ALTER TABLE `webhook_queue_item`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_NUMBER` (`number`),
  ADD KEY `IDX_WEBHOOK_ID` (`webhook_id`),
  ADD KEY `IDX_TARGET` (`target_id`,`target_type`);

--
-- Indexes for table `working_time_calendar`
--
ALTER TABLE `working_time_calendar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- Indexes for table `working_time_calendar_working_time_range`
--
ALTER TABLE `working_time_calendar_working_time_range`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_WORKING_TIME_CALENDAR_ID_WORKING_TIME_RANGE_ID` (`working_time_calendar_id`,`working_time_range_id`),
  ADD KEY `IDX_WORKING_TIME_CALENDAR_ID` (`working_time_calendar_id`),
  ADD KEY `IDX_WORKING_TIME_RANGE_ID` (`working_time_range_id`);

--
-- Indexes for table `working_time_range`
--
ALTER TABLE `working_time_range`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_TYPE_RANGE` (`type`,`date_start`,`date_end`),
  ADD KEY `IDX_TYPE` (`type`),
  ADD KEY `IDX_CREATED_BY_ID` (`created_by_id`),
  ADD KEY `IDX_MODIFIED_BY_ID` (`modified_by_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_contact`
--
ALTER TABLE `account_contact`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `account_document`
--
ALTER TABLE `account_document`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `account_portal_user`
--
ALTER TABLE `account_portal_user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `account_target_list`
--
ALTER TABLE `account_target_list`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `action_history_record`
--
ALTER TABLE `action_history_record`
  MODIFY `number` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2986;

--
-- AUTO_INCREMENT for table `app_log_record`
--
ALTER TABLE `app_log_record`
  MODIFY `number` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `autofollow`
--
ALTER TABLE `autofollow`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `call_contact`
--
ALTER TABLE `call_contact`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `call_lead`
--
ALTER TABLE `call_lead`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `call_user`
--
ALTER TABLE `call_user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `campaign_target_list`
--
ALTER TABLE `campaign_target_list`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `campaign_target_list_excluding`
--
ALTER TABLE `campaign_target_list_excluding`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `case`
--
ALTER TABLE `case`
  MODIFY `number` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `case_contact`
--
ALTER TABLE `case_contact`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `case_knowledge_base_article`
--
ALTER TABLE `case_knowledge_base_article`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_document`
--
ALTER TABLE `contact_document`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_meeting`
--
ALTER TABLE `contact_meeting`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_opportunity`
--
ALTER TABLE `contact_opportunity`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_target_list`
--
ALTER TABLE `contact_target_list`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `document_folder_path`
--
ALTER TABLE `document_folder_path`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document_lead`
--
ALTER TABLE `document_lead`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document_opportunity`
--
ALTER TABLE `document_opportunity`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_email_account`
--
ALTER TABLE `email_email_account`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_email_address`
--
ALTER TABLE `email_email_address`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_inbound_email`
--
ALTER TABLE `email_inbound_email`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_template_category_path`
--
ALTER TABLE `email_template_category_path`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_user`
--
ALTER TABLE `email_user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `entity_collaborator`
--
ALTER TABLE `entity_collaborator`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `entity_email_address`
--
ALTER TABLE `entity_email_address`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `entity_phone_number`
--
ALTER TABLE `entity_phone_number`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `entity_team`
--
ALTER TABLE `entity_team`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `entity_user`
--
ALTER TABLE `entity_user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `group_email_folder_team`
--
ALTER TABLE `group_email_folder_team`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `import_entity`
--
ALTER TABLE `import_entity`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inbound_email_team`
--
ALTER TABLE `inbound_email_team`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job`
--
ALTER TABLE `job`
  MODIFY `number` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `knowledge_base_article_knowledge_base_category`
--
ALTER TABLE `knowledge_base_article_knowledge_base_category`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `knowledge_base_article_portal`
--
ALTER TABLE `knowledge_base_article_portal`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `knowledge_base_category_path`
--
ALTER TABLE `knowledge_base_category_path`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lead_capture_log_record`
--
ALTER TABLE `lead_capture_log_record`
  MODIFY `number` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lead_meeting`
--
ALTER TABLE `lead_meeting`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lead_target_list`
--
ALTER TABLE `lead_target_list`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mass_email_target_list`
--
ALTER TABLE `mass_email_target_list`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mass_email_target_list_excluding`
--
ALTER TABLE `mass_email_target_list_excluding`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meeting_user`
--
ALTER TABLE `meeting_user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `note`
--
ALTER TABLE `note`
  MODIFY `number` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=775;

--
-- AUTO_INCREMENT for table `note_portal`
--
ALTER TABLE `note_portal`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `note_team`
--
ALTER TABLE `note_team`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `note_user`
--
ALTER TABLE `note_user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `number` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=231;

--
-- AUTO_INCREMENT for table `portal_portal_role`
--
ALTER TABLE `portal_portal_role`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `portal_role_user`
--
ALTER TABLE `portal_role_user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `portal_user`
--
ALTER TABLE `portal_user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role_team`
--
ALTER TABLE `role_team`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role_user`
--
ALTER TABLE `role_user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sms_phone_number`
--
ALTER TABLE `sms_phone_number`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `star_subscription`
--
ALTER TABLE `star_subscription`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stream_subscription`
--
ALTER TABLE `stream_subscription`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `target_list_category_path`
--
ALTER TABLE `target_list_category_path`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `target_list_user`
--
ALTER TABLE `target_list_user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `team_user`
--
ALTER TABLE `team_user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_working_time_range`
--
ALTER TABLE `user_working_time_range`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `webhook_event_queue_item`
--
ALTER TABLE `webhook_event_queue_item`
  MODIFY `number` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `webhook_queue_item`
--
ALTER TABLE `webhook_queue_item`
  MODIFY `number` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `working_time_calendar_working_time_range`
--
ALTER TABLE `working_time_calendar_working_time_range`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
