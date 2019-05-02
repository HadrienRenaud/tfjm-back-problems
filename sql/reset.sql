-- MySQL Script generated by MySQL Workbench
-- ven. 25 janv. 2019 21:36:40 CET
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`tag` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`problems`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`problems` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `description` VARCHAR(100) NULL,
  `pdf` VARCHAR(200) NULL,
  `image` MEDIUMBLOB NULL,
  `tex` VARCHAR(45) NULL,
  `medias` MEDIUMBLOB NULL,
  `image` MEDIUMBLOB NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`problem_has_tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`problem_has_tag` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fk_tag` INT UNSIGNED NOT NULL,
  `fk_problem` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_problem_has_tag_tag_idx` (`fk_tag` ASC),
  INDEX `fk_problem_has_tag_problems1_idx` (`fk_problem` ASC),
  CONSTRAINT `fk_problem_has_tag_tag`
    FOREIGN KEY (`fk_tag`)
    REFERENCES `mydb`.`tag` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_problem_has_tag_problems1`
    FOREIGN KEY (`fk_problem`)
    REFERENCES `mydb`.`problems` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
