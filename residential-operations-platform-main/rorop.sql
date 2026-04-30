-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: rorop
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `access_log`
--

DROP TABLE IF EXISTS `access_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_log` (
  `log_id` int NOT NULL,
  `resident_id` int DEFAULT NULL,
  `visitor_name` varchar(100) DEFAULT NULL,
  `visit_date` date DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  KEY `resident_id` (`resident_id`),
  CONSTRAINT `access_log_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `resident` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_log`
--

LOCK TABLES `access_log` WRITE;
/*!40000 ALTER TABLE `access_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `access_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL,
  `admin_name` varchar(100) NOT NULL,
  `admin_email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `contact_number` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_email` (`admin_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Super Admin','admin@rorop.com','admin123','2026-02-15 11:37:04',NULL);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaint`
--

DROP TABLE IF EXISTS `complaint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaint` (
  `complaint_id` int NOT NULL AUTO_INCREMENT,
  `resident_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `complaint_type` varchar(50) DEFAULT NULL,
  `description` text,
  `complaint_status` enum('Open','Under Review','Resolved') DEFAULT 'Open',
  `status` varchar(30) DEFAULT 'Pending',
  `owner_approval` tinyint(1) DEFAULT '0',
  `resolved_by` int DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  PRIMARY KEY (`complaint_id`),
  KEY `resident_id` (`resident_id`),
  KEY `manager_id` (`manager_id`),
  KEY `fk_staff` (`resolved_by`),
  CONSTRAINT `complaint_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `resident` (`resident_id`),
  CONSTRAINT `complaint_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `operations_manager` (`manager_id`),
  CONSTRAINT `fk_staff` FOREIGN KEY (`resolved_by`) REFERENCES `staff` (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaint`
--

LOCK TABLES `complaint` WRITE;
/*!40000 ALTER TABLE `complaint` DISABLE KEYS */;
/*!40000 ALTER TABLE `complaint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance` (
  `maintenance_id` int NOT NULL,
  `unit_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `issue` text,
  `status` enum('Pending','In Progress','Resolved') DEFAULT 'Pending',
  PRIMARY KEY (`maintenance_id`),
  KEY `unit_id` (`unit_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `residential_unit` (`unit_id`),
  CONSTRAINT `maintenance_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `operations_manager` (`manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance`
--

LOCK TABLES `maintenance` WRITE;
/*!40000 ALTER TABLE `maintenance` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operations_manager`
--

DROP TABLE IF EXISTS `operations_manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operations_manager` (
  `manager_id` int NOT NULL,
  `manager_name` varchar(100) NOT NULL,
  `manager_email` varchar(100) DEFAULT NULL,
  `manager_number` varchar(15) DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  PRIMARY KEY (`manager_id`),
  UNIQUE KEY `manager_email` (`manager_email`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `operations_manager_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operations_manager`
--

LOCK TABLES `operations_manager` WRITE;
/*!40000 ALTER TABLE `operations_manager` DISABLE KEYS */;
INSERT INTO `operations_manager` VALUES (101,'Manager A','managerA@rorop.com','9998887776',1);
/*!40000 ALTER TABLE `operations_manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL,
  `resident_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `payment_mode` enum('Cash','Card','Online') DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `resident_id` (`resident_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `resident` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resident`
--

DROP TABLE IF EXISTS `resident`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resident` (
  `resident_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `flat_no` varchar(20) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`resident_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resident`
--

LOCK TABLES `resident` WRITE;
/*!40000 ALTER TABLE `resident` DISABLE KEYS */;
INSERT INTO `resident` VALUES
  (201,'Rahul Sharma','9876541230','2004-05-10','Male','rahul@email.com','MG Road','Chennai','A-101','600001'),
  (202,'Neha Gupta','9876541231','2003-07-22','Female','neha@email.com','Park Ave','Chennai','B-201','600001'),
  (203,'Vikram Singh','9876541232','2002-09-14','Male','vikram@email.com','Park Ave','Chennai','B-202','600001'),
  (204,'Ananya Reddy','9876541233','2004-11-02','Female','ananya@email.com','Hill Rd','Chennai','C-301','600001');
/*!40000 ALTER TABLE `resident` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residential_block`
--

DROP TABLE IF EXISTS `residential_block`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residential_block` (
  `block_id` int NOT NULL,
  `block_name` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  PRIMARY KEY (`block_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `residential_block_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `operations_manager` (`manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residential_block`
--

LOCK TABLES `residential_block` WRITE;
/*!40000 ALTER TABLE `residential_block` DISABLE KEYS */;
INSERT INTO `residential_block` VALUES (10,'Block A','North Campus',100,101);
/*!40000 ALTER TABLE `residential_block` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residential_unit`
--

DROP TABLE IF EXISTS `residential_unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residential_unit` (
  `unit_id` int NOT NULL AUTO_INCREMENT,
  `unit_no` varchar(20) DEFAULT NULL,
  `unit_type` enum('1-Sharing','2-Sharing','3-Sharing') DEFAULT NULL,
  `unit_capacity` int DEFAULT NULL,
  `rent` decimal(10,2) DEFAULT NULL,
  `occupancy_status` enum('Available','Occupied') DEFAULT 'Available',
  `block_id` int DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  `floor_no` int DEFAULT NULL,
  PRIMARY KEY (`unit_id`),
  KEY `block_id` (`block_id`),
  KEY `fk_owner` (`owner_id`),
  CONSTRAINT `fk_owner` FOREIGN KEY (`owner_id`) REFERENCES `owner` (`owner_id`),
  CONSTRAINT `residential_unit_ibfk_1` FOREIGN KEY (`block_id`) REFERENCES `residential_block` (`block_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residential_unit`
--

LOCK TABLES `residential_unit` WRITE;
/*!40000 ALTER TABLE `residential_unit` DISABLE KEYS */;
INSERT INTO `residential_unit` (`unit_id`,`unit_no`,`unit_type`,`unit_capacity`,`rent`,`occupancy_status`,`block_id`,`owner_id`,`floor_no`) VALUES
  (501,'A-101','2-Sharing',2,8000.00,'Occupied',10,1,1),
  (502,'A-102','2-Sharing',2,8000.00,'Available',10,1,1),
  (503,'B-201','3-Sharing',3,10500.00,'Occupied',10,2,2),
  (504,'B-202','2-Sharing',2,8500.00,'Occupied',10,3,2),
  (505,'C-301','1-Sharing',1,6500.00,'Occupied',10,4,3),
  (506,'C-302','2-Sharing',2,8500.00,'Available',10,2,3);
/*!40000 ALTER TABLE `residential_unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_allocation`
--

DROP TABLE IF EXISTS `resource_allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_allocation` (
  `allocation_id` int NOT NULL,
  `resident_id` int DEFAULT NULL,
  `unit_id` int DEFAULT NULL,
  `allocation_date` date DEFAULT NULL,
  `lease_end_date` date DEFAULT NULL,
  PRIMARY KEY (`allocation_id`),
  KEY `resident_id` (`resident_id`),
  KEY `unit_id` (`unit_id`),
  CONSTRAINT `resource_allocation_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `resident` (`resident_id`),
  CONSTRAINT `resource_allocation_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `residential_unit` (`unit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_allocation`
--

LOCK TABLES `resource_allocation` WRITE;
/*!40000 ALTER TABLE `resource_allocation` DISABLE KEYS */;
INSERT INTO `resource_allocation` VALUES (1,201,501,'2025-01-01','2025-12-31');
/*!40000 ALTER TABLE `resource_allocation` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `prevent_double_allocation` BEFORE INSERT ON `resource_allocation` FOR EACH ROW BEGIN
    IF (SELECT occupancy_status 
        FROM RESIDENTIAL_UNIT 
        WHERE unit_id = NEW.unit_id) = 'Occupied' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Room already occupied!';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_room_status_after_allocation` AFTER INSERT ON `resource_allocation` FOR EACH ROW BEGIN
    UPDATE RESIDENTIAL_UNIT
    SET occupancy_status = 'Occupied'
    WHERE unit_id = NEW.unit_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
--
-- Table structure for table `owner`
--

DROP TABLE IF EXISTS `owner`;
CREATE TABLE `owner` (
  `owner_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`owner_id`),
  UNIQUE KEY `owner_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `owner` WRITE;
INSERT INTO `owner` VALUES
  (1,'Rajesh Kumar','+91 98765 43210','rajesh.kumar@email.com'),
  (2,'Priya Sharma','+91 98765 43211','priya.sharma@email.com'),
  (3,'Amit Verma','+91 98765 43212','amit.verma@email.com'),
  (4,'Sunita Iyer','+91 98765 43213','sunita.iyer@email.com');
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `staff_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `unit_id` int DEFAULT NULL,
  PRIMARY KEY (`staff_id`),
  KEY `staff_unit_id` (`unit_id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `residential_unit` (`unit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `staff` WRITE;
INSERT INTO `staff` VALUES
  (1,'Ramesh','Security Supervisor','9000000001',NULL),
  (2,'Suresh','Maintenance Lead','9000000002',NULL),
  (3,'Kiran','Electrician','9000000003',501),
  (4,'Anil','Plumber','9000000004',NULL),
  (5,'Lakshmi','Housekeeping','9000000005',NULL);
UNLOCK TABLES;

--
-- Table structure for table `resource_usage`
--

DROP TABLE IF EXISTS `resource_usage`;
CREATE TABLE `resource_usage` (
  `usage_id` int NOT NULL AUTO_INCREMENT,
  `unit_id` int DEFAULT NULL,
  `electricity_units` int DEFAULT NULL,
  `water_units` int DEFAULT NULL,
  `month` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`usage_id`),
  KEY `resource_usage_unit_id` (`unit_id`),
  CONSTRAINT `resource_usage_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `residential_unit` (`unit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `resource_usage` WRITE;
INSERT INTO `resource_usage` VALUES
  (1,501,320,42,'2026-01'),
  (2,501,305,45,'2026-02'),
  (3,501,298,48,'2026-03');
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-17  0:07:47
