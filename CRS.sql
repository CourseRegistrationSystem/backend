-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2021 at 10:46 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `CRS`
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
('1bRGl1FXLE8AbJeNObhpg4S1XUSqOJHi0o78yDywbYEhNeELzRvIVhC0MvDDAP57', 1209600, NULL, '2021-10-15 15:49:46', 2),
('aCLe3ydEUC6BcNUHjvsPyE3cbEkwUICvjxSgQUD9aGEumUcoiBI0Vd7HWkcFEI5G', 1209600, NULL, '2021-10-13 12:40:50', 2),
('b97Raft4mbA1OCoMjkyY5U1JCKoGY85HN9JUxI1rHXXQFbzV8jkek6ius26LFdfn', 1209600, NULL, '2021-10-11 17:08:12', 2),
('ddptVt0iHaCuLcO1gAeIkxmOfqh4DVi6BUkNItFFmas6dipRqZYOCbUo1RAKA8VE', 1209600, NULL, '2021-10-14 00:43:57', 2),
('F1QSasfHoCV6trOItkhN0P9xjSaghdnTCZtqncchOGy6MGC45QL4H6XPKHhtupfA', 1209600, NULL, '2021-10-11 13:15:32', 2),
('fiqiQ87eDPce4tWiO17gxdkhNN9bYhsnaEiG52K2JrKhoh7JVv96B7Cdt3k92N91', 1209600, NULL, '2021-10-16 12:46:47', 2),
('I5jBtj6IKFkalLHhnXO0NjsyvezQEU4TwsiImDD5oOZ1AyPJ7mKqBRYMJDhxg7HW', 1209600, NULL, '2021-10-14 15:40:34', 2),
('l8CEGBqf6Zo64hoFic886pCN64Thhh3We5eK73BOWfZRNAEH9Dt5pdrO26WNjyD2', 1209600, NULL, '2021-10-14 15:45:16', 2),
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
(2, 'Admin Development', '123456789', '2021-10-06 08:55:31', 1, NULL, NULL, '2021-10-17 01:30:33', NULL, 'admin-dev', '$2a$10$1V05MaT7gPL/p3ar0G6hPey6cF6EkovOQKSrO4280gcHI8olMJ9H6', 'admin-dev@iot.com', NULL, NULL),
(3, 'Admin System', '123456789', '2021-10-06 08:55:31', 1, NULL, NULL, NULL, NULL, 'admin', '$2a$10$lkZdgJVxHvjx4J29cwyuyeqVn4iUQ8kWkjmha/C8xU5X8/SuADifO', 'admin-system@iot.com', NULL, NULL),
(4, 'AMIRUL FAIZ BIN AHMAD PUAD', '1', '2021-10-10 09:27:51', 2, NULL, NULL, NULL, NULL, 'amirul-dev', '$2a$10$Ppy3DeGdNElPISdFZlIeNuOqkubWV3Mmbk59tYDU8jiHOiTDeutU6', 'amirul-dev1633858071439@appsystem.com', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `device`
--

CREATE TABLE `device` (
  `id` int(11) NOT NULL,
  `onlineStatus` int(11) NOT NULL,
  `category` varchar(512) NOT NULL,
  `name` varchar(512) NOT NULL,
  `device_id` varchar(512) NOT NULL,
  `api_key` varchar(512) NOT NULL,
  `createdDate` datetime DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  `ownerName` varchar(512) NOT NULL,
  `ownerIc` varchar(512) NOT NULL,
  `ownerPhoneNum` varchar(512) NOT NULL,
  `ownerLicenseNum` varchar(512) NOT NULL,
  `ownerBirthDate` date DEFAULT NULL,
  `vehicleModel` varchar(512) NOT NULL,
  `vehiclePlateNum` varchar(512) NOT NULL,
  `vehicleChasisNum` varchar(512) NOT NULL,
  `vehicleEngineNumber` varchar(512) NOT NULL,
  `vehiclePicture` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `device`
--

INSERT INTO `device` (`id`, `onlineStatus`, `category`, `name`, `device_id`, `api_key`, `createdDate`, `modifiedDate`, `ownerName`, `ownerIc`, `ownerPhoneNum`, `ownerLicenseNum`, `ownerBirthDate`, `vehicleModel`, `vehiclePlateNum`, `vehicleChasisNum`, `vehicleEngineNumber`, `vehiclePicture`) VALUES
(1, 1, '', 'Jentera 1 (OBD 1)', '061213300066', 'jrT45jcehlu&3ncf', '2021-10-06 08:55:31', NULL, 'Ahmad Albab', '980714565035', '01114409077', 'BLE9827BSJ', '1998-07-14', 'Perodua', 'ALE 6998', 'ABC123', 'ENGINE123', 'https://5.imimg.com/data5/CT/IY/XK/GLADMIN-12/jcbe1.jpeg'),
(2, 0, '', 'Hilux (OBD 2)', '061213300066', 'jrT45jcehlu&3ncf', '2021-10-06 08:55:31', NULL, 'Jumail Hamzah', '990823645213', '0167452637', 'JDE9827TSJ', '1999-10-18', 'Proton', 'JDT 768', 'ABC1234', 'ENGINE321', 'https://paultan.org/image/2021/08/2021-Toyota-Hilux-GR-Sport-Thailand-5-2-e1629855018984-1200x676.png');

-- --------------------------------------------------------

--
-- Table structure for table `devicedata`
--

CREATE TABLE `devicedata` (
  `id` int(11) NOT NULL,
  `alarmOverSpeed` tinyint(1) DEFAULT NULL,
  `alarmRemove` tinyint(1) DEFAULT NULL,
  `alarmMotion` tinyint(1) DEFAULT NULL,
  `alarmCrash` tinyint(1) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `altitude` double DEFAULT NULL,
  `speed` double DEFAULT NULL,
  `direction` int(10) DEFAULT NULL,
  `mileageOnMeter` int(50) DEFAULT NULL,
  `fuel` double DEFAULT NULL,
  `engineSpeed` double DEFAULT NULL,
  `batteryVoltage` double DEFAULT NULL,
  `totalMileage` double DEFAULT NULL,
  `fuelConsumptionIdle` double DEFAULT NULL,
  `fuelConsumptionDriving` double DEFAULT NULL,
  `coolantTemperature` double DEFAULT NULL,
  `throttlePosition` double DEFAULT NULL,
  `tripId` int(10) DEFAULT NULL,
  `tripMileage` double DEFAULT NULL,
  `tripFuelConsumption` double DEFAULT NULL,
  `tripAverageSpeed` double DEFAULT NULL,
  `tripMaximumSpeed` double DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `deviceId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `devicedata`
--

INSERT INTO `devicedata` (`id`, `alarmOverSpeed`, `alarmRemove`, `alarmMotion`, `alarmCrash`, `latitude`, `longitude`, `altitude`, `speed`, `direction`, `mileageOnMeter`, `fuel`, `engineSpeed`, `batteryVoltage`, `totalMileage`, `fuelConsumptionIdle`, `fuelConsumptionDriving`, `coolantTemperature`, `throttlePosition`, `tripId`, `tripMileage`, `tripFuelConsumption`, `tripAverageSpeed`, `tripMaximumSpeed`, `createdDate`, `deviceId`) VALUES
(1, 0, 0, 0, 0, 1.563427, 103.613132, 20, 10.5, NULL, NULL, 0, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-06 08:55:55', 1),
(2, 0, 0, 0, 0, 1.563515, 103.613194, 20, 20.5, NULL, NULL, 0, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-06 08:56:00', 1),
(3, 0, 0, 0, 0, 1.563619, 103.61326, 20, 35.5, NULL, NULL, 0, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-06 08:56:05', 1),
(4, 0, 0, 0, 0, 1.563739, 103.61334, 20, 40.5, NULL, NULL, 0, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-06 08:56:10', 1),
(5, 0, 0, 0, 0, 1.563853, 103.613417, 20, 40.5, NULL, NULL, 0, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-06 08:56:15', 1),
(6, 0, 0, 0, 0, 1.563974, 103.6135, 20, 40.5, NULL, NULL, 0, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-06 08:56:20', 1),
(7, 0, 0, 0, 0, 1.564037, 103.6136, 20, 40.5, NULL, NULL, 0, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-06 08:56:25', 1),
(322, 0, 0, 0, 0, 1.563427, 103.613132, 20, 10.5, NULL, NULL, 0, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-06 08:55:55', 2),
(323, 0, 0, 0, 0, 1.563427, 103.613132, 20, 10.5, NULL, NULL, NULL, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-15 22:03:30', 1),
(324, 0, 0, 0, 0, 1.563515, 103.613194, 20, 20.5, NULL, NULL, NULL, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-15 22:03:35', 1),
(325, 0, 0, 0, 0, 1.563427, 103.613132, 20, 10.5, NULL, NULL, NULL, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-15 22:21:10', 1),
(326, 0, 0, 0, 0, 1.563515, 103.613194, 20, 20.5, NULL, NULL, NULL, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-15 22:21:15', 1),
(327, 0, 0, 0, 0, 1.563619, 103.61326, 20, 35.5, NULL, NULL, NULL, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-15 22:21:20', 1),
(328, 0, 0, 0, 0, 1.563739, 103.61334, 20, 40.5, NULL, NULL, NULL, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-15 22:21:25', 1),
(329, 0, 0, 0, 0, 1.563853, 103.613417, 20, 40.5, NULL, NULL, NULL, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-15 22:21:30', 1),
(330, 0, 0, 0, 0, 1.563974, 103.6135, 20, 40.5, NULL, NULL, NULL, 1500, 12.14, 1.4000000000000001, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-15 22:21:35', 1),
(331, 0, 0, 0, 0, 1.563427, 103.613132, 20, 10.5, NULL, NULL, NULL, 1500, 12.14, 1.4000000000000001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-15 22:36:34', 1),
(332, 0, 0, 0, 0, 1.563515, 103.613194, 20, 20.5, NULL, NULL, NULL, 1500, 12.14, 1.4000000000000001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-15 22:36:39', 1);

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
(4, 'USER', '4', 4);

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
-- Indexes for table `device`
--
ALTER TABLE `device`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `devicedata`
--
ALTER TABLE `devicedata`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `device`
--
ALTER TABLE `device`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `devicedata`
--
ALTER TABLE `devicedata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=333;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `rolemapping`
--
ALTER TABLE `rolemapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
