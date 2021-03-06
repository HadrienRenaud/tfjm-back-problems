-- MySQL Script generated by MySQL Workbench
-- ven. 25 janv. 2019 21:34:36 CET
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

USE `tfjmprob` ;

-- -----------------------------------------------------
-- Table `tfjmprob`.`tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tfjmprob`.`tag` ;

CREATE TABLE IF NOT EXISTS `tfjmprob`.`tag` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tfjmprob`.`problems`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tfjmprob`.`problems` ;

CREATE TABLE IF NOT EXISTS `tfjmprob`.`problems` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `description` VARCHAR(100) NULL,
  `pdf` MEDIUMBLOB NULL,
  `tex` VARCHAR(45) NULL,
  `medias` MEDIUMBLOB NULL,
  `image` MEDIUMBLOB NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tfjmprob`.`problem_has_tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tfjmprob`.`problem_has_tag` ;

CREATE TABLE IF NOT EXISTS `tfjmprob`.`problem_has_tag` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fk_tag` INT UNSIGNED NOT NULL,
  `fk_problem` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_problem_has_tag_tag_idx` (`fk_tag` ASC),
  INDEX `fk_problem_has_tag_problems1_idx` (`fk_problem` ASC),
  CONSTRAINT `fk_problem_has_tag_tag`
    FOREIGN KEY (`fk_tag`)
    REFERENCES `tfjmprob`.`tag` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_problem_has_tag_problems1`
    FOREIGN KEY (`fk_problem`)
    REFERENCES `tfjmprob`.`problems` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
