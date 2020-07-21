-- MySQL dump 10.13  Distrib 8.0.20, for macos10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: iot
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CamBien`
--

DROP TABLE IF EXISTS `CamBien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CamBien` (
  `idCamBien` int NOT NULL AUTO_INCREMENT,
  `nhietdo` int DEFAULT NULL,
  `doam` int DEFAULT NULL,
  `thoigian` datetime DEFAULT NULL,
  `device` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idCamBien`)
) ENGINE=InnoDB AUTO_INCREMENT=1376 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CamBien`
--

LOCK TABLES `CamBien` WRITE;
/*!40000 ALTER TABLE `CamBien` DISABLE KEYS */;
INSERT INTO `CamBien` VALUES (796,49,72,'2020-06-19 04:25:21','TempHumi '),(797,30,72,'2020-06-19 04:25:22','TempHumi '),(880,10,72,'2020-06-19 04:25:23','TempHumi '),(881,10,72,'2020-06-19 04:25:24','TempHumi '),(890,10,72,'2020-06-19 04:25:25','TempHumi '),(899,10,72,'2020-06-19 04:25:26','TempHumi '),(900,10,72,'2020-06-19 04:25:27','TempHumi '),(901,40,72,'2020-06-19 04:25:28','TempHumi '),(910,31,68,'2020-06-19 04:25:29','TempHumi '),(911,31,68,'2020-06-19 04:25:30','TempHumi '),(912,31,68,'2020-06-19 04:25:31','TempHumi '),(913,32,67,'2020-06-20 04:25:21','TempHumi '),(914,30,50,'2020-06-20 04:25:22','TempHumi '),(917,33,67,'2020-06-20 04:25:23','TempHumi '),(918,31,67,'2020-06-20 04:25:24','TempHumi '),(919,31,67,'2020-06-20 04:25:25','TempHumi '),(920,33,66,'2020-06-20 04:25:26','TempHumi '),(921,34,67,'2020-06-20 04:25:27','TempHumi '),(922,31,66,'2020-06-20 04:25:28','TempHumi '),(923,34,66,'2020-06-20 04:25:29','TempHumi '),(924,33,66,'2020-06-20 04:25:30','TempHumi '),(925,31,67,'2020-06-20 04:25:31','TempHumi '),(926,34,66,'2020-06-20 04:25:32','TempHumi '),(927,32,66,'2020-06-20 04:25:33','TempHumi '),(928,32,67,'2020-06-20 04:25:33','TempHumi '),(929,32,67,'2020-06-20 04:25:34','TempHumi '),(930,32,67,'2020-06-20 04:25:35','TempHumi '),(931,32,66,'2020-06-21 04:25:21','TempHumi '),(932,32,66,'2020-06-22 04:25:22','TempHumi '),(933,31,66,'2020-06-22 04:25:23','TempHumi '),(934,31,66,'2020-06-22 04:25:24','TempHumi '),(935,33,65,'2020-06-22 04:25:25','TempHumi '),(936,33,65,'2020-06-22 04:25:26','TempHumi '),(937,31,66,'2020-06-22 04:25:27','TempHumi '),(943,30,72,'2020-06-22 04:25:28','TempHumi '),(953,30,72,'2020-06-22 04:25:29','TempHumi '),(955,30,72,'2020-06-28 04:25:22','TempHumi '),(958,30,72,'2020-06-28 04:25:23','TempHumi '),(960,30,72,'2020-06-28 04:25:24','TempHumi '),(1001,30,72,'2020-06-28 04:25:25','TempHumi '),(1002,65,72,'2020-06-28 04:25:26','TempHumi '),(1020,10,72,'2020-06-28 04:25:27','TempHumi '),(1022,9,72,'2020-06-28 04:25:28','TempHumi '),(1046,30,72,'2020-06-28 04:25:29','TempHumi '),(1047,30,72,'2020-06-28 04:25:30','TempHumi '),(1049,40,72,'2020-06-29 04:25:21','TempHumi '),(1050,30,72,'2020-06-29 04:25:22','TempHumi '),(1065,40,72,'2020-06-29 04:25:23','TempHumi '),(1066,41,72,'2020-06-29 04:25:24','TempHumi '),(1277,70,72,'2020-06-29 04:25:25','TempHumi '),(1278,70,72,'2020-06-29 04:25:26','TempHumi '),(1281,10,72,'2020-06-29 04:25:27','TempHumi '),(1282,40,72,'2020-06-29 04:25:28','TempHumi '),(1283,24,72,'2020-06-29 04:25:29','TempHumi '),(1284,19,72,'2020-06-29 04:25:30','TempHumi ');
/*!40000 ALTER TABLE `CamBien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Giatribomkhigioihannhietdo`
--

DROP TABLE IF EXISTS `Giatribomkhigioihannhietdo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Giatribomkhigioihannhietdo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` int DEFAULT NULL,
  `idgioihannhietdo` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Giatribomkhigioihannhietdo`
--

LOCK TABLES `Giatribomkhigioihannhietdo` WRITE;
/*!40000 ALTER TABLE `Giatribomkhigioihannhietdo` DISABLE KEYS */;
INSERT INTO `Giatribomkhigioihannhietdo` VALUES (1,36,152),(2,36,155),(3,36,156),(4,47,158),(5,47,159),(6,47,160),(7,47,162),(8,1,165),(9,54,166),(10,54,168),(11,70,169),(12,45,170),(13,45,174),(14,68,175),(15,68,176),(16,68,177),(17,68,178),(18,68,179),(19,68,180),(20,68,181),(21,68,182),(22,68,183),(23,68,185),(24,68,187),(25,68,189);
/*!40000 ALTER TABLE `Giatribomkhigioihannhietdo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Gioihannhietdo`
--

DROP TABLE IF EXISTS `Gioihannhietdo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Gioihannhietdo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gioihantren` int DEFAULT NULL,
  `gioihanduoi` int DEFAULT NULL,
  `timecreate` datetime DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Gioihannhietdo`
--

LOCK TABLES `Gioihannhietdo` WRITE;
/*!40000 ALTER TABLE `Gioihannhietdo` DISABLE KEYS */;
INSERT INTO `Gioihannhietdo` VALUES (191,999,-999,'2020-06-19 04:25:22','admin3'),(192,999,-999,'2020-06-19 04:25:23','admin3'),(193,999,-999,'2020-06-19 04:25:24','admin3');
/*!40000 ALTER TABLE `Gioihannhietdo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Motor`
--

DROP TABLE IF EXISTS `Motor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Motor` (
  `idMotor` int NOT NULL AUTO_INCREMENT,
  `trangthai` varchar(45) DEFAULT NULL,
  `value` int DEFAULT NULL,
  `thoigian` datetime DEFAULT NULL,
  `device` varchar(45) DEFAULT NULL,
  `auto` binary(1) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `idcambien` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idMotor`)
) ENGINE=InnoDB AUTO_INCREMENT=623 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Motor`
--

LOCK TABLES `Motor` WRITE;
/*!40000 ALTER TABLE `Motor` DISABLE KEYS */;
INSERT INTO `Motor` VALUES (620,'0',0,'2020-06-19 04:25:21','Speaker',_binary '0','admin3',NULL),(621,'1',1,'2020-06-19 04:25:20','Speaker',_binary '0','admin3',NULL),(622,'1',66,'2020-06-19 04:25:22','Speaker',_binary '0','admin3',NULL);
/*!40000 ALTER TABLE `Motor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `iduser` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `role` varchar(45) NOT NULL,
  `phone` int DEFAULT NULL,
  `ngaydk` datetime DEFAULT NULL,
  PRIMARY KEY (`iduser`),
  UNIQUE KEY `iduser_UNIQUE` (`iduser`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'123','d41d8cd98f00b204e9800998ecf8427e','user',789,'2020-06-19 04:25:21'),(2,'admin','202cb962ac59075b964b07152d234b70','user',394946767,'2020-06-19 04:25:22'),(3,'admin2','202cb962ac59075b964b07152d234b70','user',394946767,'2020-06-19 04:25:23'),(5,'admin3','202cb962ac59075b964b07152d234b70','admin',394946767,'2020-06-19 04:25:24'),(13,'test123','202cb962ac59075b964b07152d234b70','user',123,'2020-06-19 04:25:25'),(16,'test456','202cb962ac59075b964b07152d234b70','user',123,'2020-06-19 04:25:26'),(19,'test789','202cb962ac59075b964b07152d234b70','user',123,'2020-06-19 04:25:27');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'iot'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-22  0:27:52
