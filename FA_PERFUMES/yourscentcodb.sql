-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: c372_yourscentcodb
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `perfumes`
--

DROP TABLE IF EXISTS `perfumes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfumes` (
  `perfumeId` int NOT NULL AUTO_INCREMENT,
  `perfumeName` varchar(255) NOT NULL,
  `perfumeDescription` text NOT NULL,
  `gender` varchar(255) NOT NULL,
  `perfumeNotes` text NOT NULL,
  `quantity` int NOT NULL,
  `price` double(10,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`perfumeId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfumes`
--

LOCK TABLES `perfumes` WRITE;
/*!40000 ALTER TABLE `perfumes` DISABLE KEYS */;
INSERT INTO `perfumes` VALUES (1,'Bloomveil','A dreamy bouquet of blossoms that unfolds gently, leaving a delicate, romantic trail.','women','Floral, Musk, Jasmine',55,80.00,'BloomveilF.jpg'),(2,'Driftwood','Fresh and earthy, blending ocean breeze with woody depth for a calm, natural allure.','men','Fresh, Woody',60,75.00,'DriftwoodM.jpg'),(3,'Solace Mist ','A soft, refreshing fragrance that blends airy florals with warm musk, creating a calm and comforting scent perfect for everyday wear.','unisex','White Jasmine, Soft Pear',20,120.00,'SolaceMist.jpg');
/*!40000 ALTER TABLE `perfumes` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `reviewId` int NOT NULL AUTO_INCREMENT,
  `perfumeId` int NOT NULL,
  `userId` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewId`),
  INDEX (`perfumeId`),
  INDEX (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `contact` int NOT NULL,
  `role` varchar(45) NOT NULL DEFAULT 'user',
  `banned` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'user','1234','SIGMAAAAA@myrp.edu.sg',11111111,'user',0),(2,'admin1','123','123@gmail.com',11111111,'admin',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-09 16:19:39
