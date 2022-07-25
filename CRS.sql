-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 25, 2022 at 05:01 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crs`
--

-- --------------------------------------------------------

--
-- Table structure for table `accesstoken`
--

CREATE TABLE `accesstoken` (
  `id` varchar(255) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `scopes` text DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `accesstoken`
--

INSERT INTO `accesstoken` (`id`, `ttl`, `scopes`, `created`, `userId`) VALUES
('aCLe3ydEUC6BcNUHjvsPyE3cbEkwUICvjxSgQUD9aGEumUcoiBI0Vd7HWkcFEI5G', 1209600, NULL, '2021-10-13 12:40:50', 2),
('b97Raft4mbA1OCoMjkyY5U1JCKoGY85HN9JUxI1rHXXQFbzV8jkek6ius26LFdfn', 1209600, NULL, '2021-10-11 17:08:12', 2),
('BCWxpyFSOogDDpAFSLh24xOKS6uLgR0vdVZGUcq7pYPbhYDG15rJynyyYReyUKbL', 1209600, NULL, '2022-03-22 17:14:53', 6),
('ddptVt0iHaCuLcO1gAeIkxmOfqh4DVi6BUkNItFFmas6dipRqZYOCbUo1RAKA8VE', 1209600, NULL, '2021-10-14 00:43:57', 2),
('F1QSasfHoCV6trOItkhN0P9xjSaghdnTCZtqncchOGy6MGC45QL4H6XPKHhtupfA', 1209600, NULL, '2021-10-11 13:15:32', 2),
('fiqiQ87eDPce4tWiO17gxdkhNN9bYhsnaEiG52K2JrKhoh7JVv96B7Cdt3k92N91', 1209600, NULL, '2021-10-16 12:46:47', 2),
('I5jBtj6IKFkalLHhnXO0NjsyvezQEU4TwsiImDD5oOZ1AyPJ7mKqBRYMJDhxg7HW', 1209600, NULL, '2021-10-14 15:40:34', 2),
('l8CEGBqf6Zo64hoFic886pCN64Thhh3We5eK73BOWfZRNAEH9Dt5pdrO26WNjyD2', 1209600, NULL, '2021-10-14 15:45:16', 2),
('lCmjFDYr0b9wLrrPukUheYp1bIf9rKlKtq3ZMDGfjoZrPoRPihHH1ImDFGptswPL', 1209600, NULL, '2022-07-12 15:22:33', 2),
('MVqalCW26liH2ettKVWNlDFHJ5zPgpYymSAnPYpzQrogdSoVqAFjFF5x7PQS9clT', 1209600, NULL, '2022-07-12 14:36:33', 2),
('q8uTNIfGZ10UUJpqHuEXaktWXDyijp8AQlLZR8wr6YZnqqmxVsNDxZVdTYSI1puN', 1209600, NULL, '2022-03-22 13:22:41', 6),
('qaQ5xnZQz9EuUDvI0MHKYLWAGjvtdhlHB5zjH09OoiDXComwdjotOMgGqhKUaoe7', 1209600, NULL, '2021-10-10 03:37:06', 2),
('sIycnDrtj7qmRAsD5vnDN6fLCUkwyit3T5aDFXXg1MlGjOKIAWOA5tGNwVvxAYBb', 1209600, NULL, '2021-10-14 00:40:26', 2),
('tREoIOfu60AeSsLve1xAaLv2TfMSpbqAQXD7rBhZOOtCqBhzpluJHYtGlFeeAd5L', 1209600, NULL, '2021-10-15 19:55:35', 2),
('x1VoiDKobuBMUeDqA8tMOIaLu93TwEM7RbiLFA4Sb8uSc3IuBU2NBWYYMmLmSvfg', 1209600, NULL, '2021-10-17 01:30:33', 2),
('X9RAIcAE2MYjKBAiUdQNb4euxaZs76ShjBo80xD1u0lxErkB6WNJZvrLRl7XzPKL', 1209600, NULL, '2021-10-08 13:38:53', 2);

-- --------------------------------------------------------

--
-- Table structure for table `acl`
--

CREATE TABLE `acl` (
  `id` int(11) NOT NULL,
  `model` varchar(512) DEFAULT NULL,
  `property` varchar(512) DEFAULT NULL,
  `accessType` varchar(512) DEFAULT NULL,
  `permission` varchar(512) DEFAULT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `appuser`
--

CREATE TABLE `appuser` (
  `id` int(11) NOT NULL,
  `name` varchar(512) NOT NULL,
  `contact` varchar(512) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  `modifiedBy` int(11) DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `realm` varchar(512) DEFAULT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `email` varchar(512) NOT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `appuser`
--

INSERT INTO `appuser` (`id`, `name`, `contact`, `createdDate`, `createdBy`, `modifiedDate`, `modifiedBy`, `lastLogin`, `realm`, `username`, `password`, `email`, `emailVerified`, `verificationToken`) VALUES
(1, 'System Development', '123456789', '2021-10-06 08:55:31', 1, NULL, NULL, NULL, NULL, 'system-dev', '$2a$10$MTQc06WduqoKc.osUFvtZ.G9gifZZqqB8iQeB3etwEqsS24ZMP/Yy', 'system-dev@iot.com', NULL, NULL),
(2, 'Admin Development', '123456789', '2021-10-06 08:55:31', 1, NULL, NULL, '2022-07-25 02:49:25', NULL, 'admin-dev', '$2a$10$1V05MaT7gPL/p3ar0G6hPey6cF6EkovOQKSrO4280gcHI8olMJ9H6', 'admin-dev@iot.com', NULL, NULL),
(3, 'Admin System', '123456789', '2021-10-06 08:55:31', 1, NULL, NULL, NULL, NULL, 'admin', '$2a$10$lkZdgJVxHvjx4J29cwyuyeqVn4iUQ8kWkjmha/C8xU5X8/SuADifO', 'admin-system@iot.com', NULL, NULL),
(4, 'AMIRUL FAIZ BIN AHMAD PUAD', '1', '2021-10-10 09:27:51', 2, NULL, NULL, '2022-03-22 13:20:12', NULL, 'amirul-dev', '$2a$10$1V05MaT7gPL/p3ar0G6hPey6cF6EkovOQKSrO4280gcHI8olMJ9H6', 'amirul-dev1633858071439@appsystem.com', NULL, NULL),
(6, 'manager', '1', '2022-03-22 13:22:32', 2, NULL, NULL, '2022-03-22 17:14:53', NULL, 'manager-dev', '$2a$10$8jIJhXRIhK89fFRglP4cpuH4yfTltM3WzhEQrhKiY27YnPsrn8GJG', 'manager-dev1647955352396@appsystem.com', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` int(11) NOT NULL,
  `kod_subjek` varchar(50) NOT NULL,
  `nama_subjek` varchar(255) NOT NULL,
  `sesi` varchar(50) NOT NULL,
  `semester` int(11) NOT NULL,
  `createdDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `kod_subjek`, `nama_subjek`, `sesi`, `semester`, `createdDate`) VALUES
(16, 'SCSB2103', 'Bioinformatik I', '2018/2019', 1, '2022-06-28 15:30:06'),
(17, 'SCSB3104', 'Pembangunan Aplikasi', '2018/2019', 1, '2022-06-28 15:30:06'),
(18, 'SCSD2523', 'Pangkalan Data', '2018/2019', 1, '2022-06-28 15:32:31'),
(20, 'SCSB3032', 'Projek I Bioinformatik', '2018/2019', 1, '2022-07-12 17:00:04'),
(21, 'SCSD3761', 'Technopreneurship Seminar', '2018/2019', 1, '2022-07-13 03:09:16');

-- --------------------------------------------------------

--
-- Table structure for table `curriculum`
--

CREATE TABLE `curriculum` (
  `id` int(11) NOT NULL,
  `id_kurikulum` int(11) NOT NULL,
  `sesi_masuk` varchar(50) NOT NULL,
  `kod_kurikulum` varchar(50) NOT NULL,
  `nama_kurikulum` varchar(255) NOT NULL,
  `semester_masuk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `lecturer`
--

CREATE TABLE `lecturer` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `registration`
--

CREATE TABLE `registration` (
  `id` int(11) NOT NULL,
  `nama_pelajar` varchar(255) NOT NULL,
  `kad_matrik_pelajar` varchar(50) NOT NULL,
  `section_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  `modifiedDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `registration`
--

INSERT INTO `registration` (`id`, `nama_pelajar`, `kad_matrik_pelajar`, `section_id`, `student_id`, `createdDate`, `modifiedDate`) VALUES
(44, 'ARIF MASYHUR MOHAMED HATTA', 'B19EC0007', 16, 27, '2022-06-28 15:32:31', '0000-00-00 00:00:00'),
(45, 'ARIF MASYHUR MOHAMED HATTA', 'B19EC0007', 18, 27, '2022-06-28 15:32:31', '0000-00-00 00:00:00'),
(47, 'MUHAMMAD HAFIZ BIN KHAIRUL ANWAR', 'B19EC0044', 16, 29, '2022-07-12 17:00:04', '0000-00-00 00:00:00'),
(48, 'MUHAMMAD HAFIZ BIN KHAIRUL ANWAR', 'B19EC0044', 20, 29, '2022-07-12 17:00:04', '0000-00-00 00:00:00'),
(49, 'AMIRUL FAIZ BIN AHMAD PUAD', 'B19EC0004', 16, 30, '2022-07-13 03:00:15', '0000-00-00 00:00:00'),
(50, 'TAUFIIQ BIN NOOR AZMAN', 'A18CS0262', 16, 31, '2022-07-13 03:09:16', '0000-00-00 00:00:00'),
(51, 'TAUFIIQ BIN NOOR AZMAN', 'A18CS0262', 21, 31, '2022-07-13 03:09:16', '0000-00-00 00:00:00'),
(52, 'TAUFIIQ BIN NOOR AZMAN', 'A18CS0262', 22, 31, '2022-07-13 03:09:16', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `registrationschedule`
--

CREATE TABLE `registrationschedule` (
  `id` int(11) NOT NULL,
  `startDateTime` datetime NOT NULL,
  `endDateTime` datetime NOT NULL,
  `session` varchar(50) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `id_RegistrationSchedule` varchar(50) NOT NULL,
  `createdDate` datetime NOT NULL,
  `nameCreatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `registrationschedule`
--

INSERT INTO `registrationschedule` (`id`, `startDateTime`, `endDateTime`, `session`, `semester`, `id_RegistrationSchedule`, `createdDate`, `nameCreatedBy`) VALUES
(8, '2022-07-01 16:00:00', '2022-07-31 16:00:00', '2018/2019', '1', '2018/20191', '2022-06-28 15:24:58', 'Admin Development');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `description`, `created`, `modified`) VALUES
(1, 'system', 'System Application', '2021-10-06 08:55:31', '2021-10-06 08:55:31'),
(2, 'supervisor', 'Supervisor System', '2021-10-06 08:55:31', '2021-10-06 08:55:31'),
(3, 'admin', 'Admin System', '2021-10-06 08:55:31', '2021-10-06 08:55:31'),
(4, 'manager', 'Manager System', '2021-10-06 08:55:31', '2021-10-06 08:55:31'),
(5, 'normal', 'Normal User', '2021-10-06 08:55:31', '2021-10-06 08:55:31');

-- --------------------------------------------------------

--
-- Table structure for table `rolemapping`
--

CREATE TABLE `rolemapping` (
  `id` int(11) NOT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(255) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rolemapping`
--

INSERT INTO `rolemapping` (`id`, `principalType`, `principalId`, `roleId`) VALUES
(1, 'USER', '1', 1),
(2, 'USER', '2', 3),
(3, 'USER', '3', 3),
(4, 'USER', '4', 4),
(6, 'USER', '6', 4);

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `id` int(11) NOT NULL,
  `section` int(11) NOT NULL,
  `capacity` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `nama_pensyarah` varchar(255) DEFAULT NULL,
  `dateCreated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`id`, `section`, `capacity`, `course_id`, `nama_pensyarah`, `dateCreated`) VALUES
(16, 1, 4, 16, 'HASLINA BINTI HASHIM', '2022-06-28 15:30:06'),
(17, 1, 1, 17, 'MOHD SHAHIZAN BIN OTHMAN', '2022-06-28 15:30:06'),
(18, 6, 1, 18, 'FAISAL ABDULKAREEM QASEM SAEED', '2022-06-28 15:32:31'),
(20, 1, 1, 20, NULL, '2022-07-12 17:00:04'),
(21, 1, 1, 21, 'HAIRUDIN BIN ABD. MAJID', '2022-07-13 03:09:16'),
(22, 3, 1, 18, 'ROZILAWATI BT. DOLLAH @ MD.ZAIN', '2022-07-13 03:09:16');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `matricNo` varchar(50) NOT NULL,
  `sesi` varchar(50) NOT NULL,
  `semester` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  `modifiedDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `name`, `matricNo`, `sesi`, `semester`, `createdDate`, `modifiedDate`) VALUES
(27, 'ARIF MASYHUR MOHAMED HATTA', 'B19EC0007', '2018/2019', 1, '2022-06-28 15:32:31', '0000-00-00 00:00:00'),
(29, 'MUHAMMAD HAFIZ BIN KHAIRUL ANWAR', 'B19EC0044', '2018/2019', 1, '2022-07-12 17:00:04', '0000-00-00 00:00:00'),
(31, 'TAUFIIQ BIN NOOR AZMAN', 'A18CS0262', '2018/2019', 1, '2022-07-13 03:09:16', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `table`
--

CREATE TABLE `table` (
  `id` int(11) NOT NULL,
  `masa` int(11) NOT NULL,
  `hari` int(11) NOT NULL,
  `section_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `table`
--

INSERT INTO `table` (`id`, `masa`, `hari`, `section_id`) VALUES
(42, 4, 3, 16),
(43, 5, 3, 16),
(44, 6, 3, 16),
(45, 2, 4, 16),
(46, 2, 4, 17),
(47, 3, 4, 17),
(48, 5, 2, 18),
(49, 6, 2, 18),
(50, 9, 5, 18),
(51, 8, 5, 18),
(52, 4, 3, 19),
(53, 5, 3, 19),
(54, 2, 4, 19),
(55, 6, 3, 19),
(56, 3, 4, 20),
(57, 2, 4, 20),
(58, 6, 3, 21),
(59, 2, 1, 22),
(60, 3, 1, 22),
(61, 2, 2, 22),
(62, 3, 2, 22);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accesstoken`
--
ALTER TABLE `accesstoken`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `acl`
--
ALTER TABLE `acl`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appuser`
--
ALTER TABLE `appuser`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `curriculum`
--
ALTER TABLE `curriculum`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lecturer`
--
ALTER TABLE `lecturer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registration`
--
ALTER TABLE `registration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registrationschedule`
--
ALTER TABLE `registrationschedule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rolemapping`
--
ALTER TABLE `rolemapping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `principalId` (`principalId`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `table`
--
ALTER TABLE `table`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `acl`
--
ALTER TABLE `acl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `appuser`
--
ALTER TABLE `appuser`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `curriculum`
--
ALTER TABLE `curriculum`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lecturer`
--
ALTER TABLE `lecturer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `registration`
--
ALTER TABLE `registration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `registrationschedule`
--
ALTER TABLE `registrationschedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `rolemapping`
--
ALTER TABLE `rolemapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `table`
--
ALTER TABLE `table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
