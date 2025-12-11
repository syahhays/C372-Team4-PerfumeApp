-- Create table for reviews
CREATE TABLE IF NOT EXISTS `reviews` (
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
