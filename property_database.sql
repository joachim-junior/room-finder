-- phpMyAdmin SQL Dump
-- version 4.9.11
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 25, 2023 at 02:40 PM
-- Server version: 8.0.32
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `akihvfyj_property`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `username` longtext NOT NULL,
  `password` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`) VALUES
(1, 'admin', 'admin@123');

-- --------------------------------------------------------

--
-- Table structure for table `payout_setting`
--

CREATE TABLE `payout_setting` (
  `id` int NOT NULL,
  `owner_id` int NOT NULL,
  `amt` int NOT NULL,
  `status` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `proof` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `r_date` datetime NOT NULL,
  `r_type` enum('UPI','BANK Transfer','Paypal') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `acc_number` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `bank_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `acc_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `ifsc_code` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `upi_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `paypal_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `plan_purchase_history`
--

CREATE TABLE `plan_purchase_history` (
  `id` int NOT NULL,
  `uid` int NOT NULL,
  `plan_id` int NOT NULL,
  `p_name` text NOT NULL,
  `t_date` datetime NOT NULL,
  `amount` int NOT NULL,
  `day` int NOT NULL,
  `plan_title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `plan_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `expire_date` date NOT NULL,
  `start_date` date NOT NULL,
  `trans_id` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `plan_purchase_history`
--


-- --------------------------------------------------------

--
-- Table structure for table `tbl_book`
--

CREATE TABLE `tbl_book` (
  `id` int NOT NULL,
  `prop_id` int NOT NULL,
  `uid` int NOT NULL,
  `book_date` date NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `subtotal` float NOT NULL,
  `total` float NOT NULL,
  `tax` float NOT NULL,
  `cou_amt` float NOT NULL,
  `wall_amt` float NOT NULL,
  `transaction_id` text NOT NULL,
  `p_method_id` int NOT NULL,
  `add_note` text NOT NULL,
  `book_status` text NOT NULL,
  `check_intime` text NOT NULL,
  `noguest` int NOT NULL,
  `is_rate` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;