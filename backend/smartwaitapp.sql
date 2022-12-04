-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 04, 2022 at 07:47 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smartwaitapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `appt`
--

CREATE TABLE `appt` (
  `id` int(11) NOT NULL,
  `patient` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `doctor` enum('Dr. A','Dr. B','Dr. C') NOT NULL,
  `note` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `appt`
--

INSERT INTO `appt` (`id`, `patient`, `time`, `doctor`, `note`) VALUES
(26, 6, '2022-11-24 14:30:00', 'Dr. C', ''),
(27, 0, '2022-11-24 16:00:00', 'Dr. C', NULL),
(29, 6, '2022-12-04 01:00:00', 'Dr. A', NULL),
(60, 3, '2022-12-03 12:30:00', 'Dr. A', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `firstname` varchar(25) NOT NULL,
  `lastname` varchar(25) NOT NULL,
  `email` varchar(30) NOT NULL,
  `dob` date NOT NULL,
  `gender` enum('F','M') NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`firstname`, `lastname`, `email`, `dob`, `gender`, `id`) VALUES
('Em', 'Stark', 'emstart@gmail.com', '2022-11-12', 'M', 3),
('K', 'W', 'kw@gmail.com', '2022-11-09', 'F', 6),
('Cam', 'Dod', 'camdod@aol.com', '2000-12-01', 'F', 24);

-- --------------------------------------------------------

--
-- Table structure for table `patient_requests`
--

CREATE TABLE `patient_requests` (
  `firstname` varchar(25) NOT NULL,
  `lastname` varchar(25) NOT NULL,
  `email` varchar(30) NOT NULL,
  `dob` date NOT NULL,
  `gender` enum('F','M') NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `type` enum('staff','patient') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`, `type`) VALUES
('allstaff', 'staffpwd', 'staff');

-- --------------------------------------------------------

--
-- Table structure for table `vars`
--

CREATE TABLE `vars` (
  `var` varchar(25) NOT NULL,
  `value` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vars`
--

INSERT INTO `vars` (`var`, `value`) VALUES
('default_waittime', '45'),
('queue_status', '1');

-- --------------------------------------------------------

--
-- Table structure for table `wait_queue_appt`
--

CREATE TABLE `wait_queue_appt` (
  `doctor` enum('Dr. A','Dr. B','Dr. C') NOT NULL,
  `time` time NOT NULL,
  `apptId` int(11) NOT NULL,
  `checkInFlag` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `wait_queue_appt`
--

INSERT INTO `wait_queue_appt` (`doctor`, `time`, `apptId`, `checkInFlag`) VALUES
('Dr. A', '20:00:00', 29, 0);

-- --------------------------------------------------------

--
-- Table structure for table `wait_queue_gen`
--

CREATE TABLE `wait_queue_gen` (
  `patId` int(11) NOT NULL,
  `patName` varchar(50) NOT NULL,
  `apptFlag` tinyint(1) NOT NULL,
  `apptId` int(11) DEFAULT NULL,
  `doctor` enum('Dr. A','Dr. B','Dr. C') NOT NULL,
  `note` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appt`
--
ALTER TABLE `appt`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `time_and_doctor` (`time`,`doctor`) USING BTREE;

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patient_requests`
--
ALTER TABLE `patient_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `vars`
--
ALTER TABLE `vars`
  ADD PRIMARY KEY (`var`),
  ADD UNIQUE KEY `var` (`var`);

--
-- Indexes for table `wait_queue_appt`
--
ALTER TABLE `wait_queue_appt`
  ADD UNIQUE KEY `apptId` (`apptId`);

--
-- Indexes for table `wait_queue_gen`
--
ALTER TABLE `wait_queue_gen`
  ADD UNIQUE KEY `patId` (`patId`),
  ADD UNIQUE KEY `apptId` (`apptId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appt`
--
ALTER TABLE `appt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `patient_requests`
--
ALTER TABLE `patient_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
