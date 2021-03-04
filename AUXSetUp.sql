-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema aux
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema aux
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `aux` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `aux` ;

-- -----------------------------------------------------
-- Table `aux`.`platform`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aux`.`platform` (
  `platform_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`platform_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `aux`.`rooms`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aux`.`rooms` (
  `room_id` INT NOT NULL,
  `passcode` VARCHAR(50) NULL,
  PRIMARY KEY (`room_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `aux`.`queue`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aux`.`queue` (
  `queue_id` INT NOT NULL,
  `rooms_room_id` INT NOT NULL,
  PRIMARY KEY (`queue_id`, `rooms_room_id`),
  INDEX `fk_queue_Rooms1_idx` (`rooms_room_id` ASC) VISIBLE,
  CONSTRAINT `fk_queue_Rooms1`
    FOREIGN KEY (`rooms_room_id`)
    REFERENCES `aux`.`rooms` (`room_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `aux`.`requests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aux`.`requests` (
  `requests_id` INT NOT NULL,
  `rooms_room_id` INT NOT NULL,
  PRIMARY KEY (`requests_id`, `rooms_room_id`),
  INDEX `fk_requests_Rooms1_idx` (`rooms_room_id` ASC) VISIBLE,
  CONSTRAINT `fk_requests_Rooms1`
    FOREIGN KEY (`rooms_room_id`)
    REFERENCES `aux`.`rooms` (`room_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `aux`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aux`.`users` (
  `user_id` INT NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `passcode` VARCHAR(2000) NOT NULL,
  `first_name` VARCHAR(45) NULL DEFAULT NULL,
  `last_name` VARCHAR(45) NULL DEFAULT NULL,
  `isDJ` TINYINT NOT NULL,
  `rooms_room_id` INT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `fk_users_Rooms_idx` (`rooms_room_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_Rooms`
    FOREIGN KEY (`rooms_room_id`)
    REFERENCES `aux`.`rooms` (`room_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `aux`.`has_service`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aux`.`has_service` (
  `users_user_id` INT NOT NULL,
  `platform_platform_id` INT NOT NULL,
  PRIMARY KEY (`users_user_id`, `platform_platform_id`),
  INDEX `fk_has_service_platform1_idx` (`platform_platform_id` ASC) VISIBLE,
  CONSTRAINT `fk_has_service_users1`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `aux`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_has_service_platform1`
    FOREIGN KEY (`platform_platform_id`)
    REFERENCES `aux`.`platform` (`platform_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `aux`.`song`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aux`.`song` (
  `song_id` INT NOT NULL,
  `song_name` VARCHAR(45) NOT NULL,
  `artist` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`song_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `aux`.`requested`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aux`.`requested` (
  `song_song_id` INT NOT NULL,
  `requests_requests_id` INT NOT NULL,
  `requests_rooms_room_id` INT NOT NULL,
  `request_number` INT NOT NULL,
  PRIMARY KEY (`song_song_id`, `requests_requests_id`, `requests_rooms_room_id`),
  INDEX `fk_requested_requests1_idx` (`requests_requests_id` ASC, `requests_rooms_room_id` ASC) VISIBLE,
  CONSTRAINT `fk_requested_Song1`
    FOREIGN KEY (`song_song_id`)
    REFERENCES `aux`.`song` (`song_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_requested_requests1`
    FOREIGN KEY (`requests_requests_id` , `requests_rooms_room_id`)
    REFERENCES `aux`.`requests` (`requests_id` , `rooms_room_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `aux`.`in_queue`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aux`.`in_queue` (
  `song_song_id` INT NOT NULL,
  `queue_queue_id` INT NOT NULL,
  `queue_rooms_room_id` INT NOT NULL,
  `order` INT NOT NULL,
  PRIMARY KEY (`song_song_id`, `queue_queue_id`, `queue_rooms_room_id`),
  INDEX `fk_in_queue_queue1_idx` (`queue_queue_id` ASC, `queue_rooms_room_id` ASC) VISIBLE,
  CONSTRAINT `fk_in_queue_Song1`
    FOREIGN KEY (`song_song_id`)
    REFERENCES `aux`.`song` (`song_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_in_queue_queue1`
    FOREIGN KEY (`queue_queue_id` , `queue_rooms_room_id`)
    REFERENCES `aux`.`queue` (`queue_id` , `rooms_room_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
