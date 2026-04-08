-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 02, 2026 at 07:09 PM
-- Server version: 8.0.44
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exo`
--

-- --------------------------------------------------------

--
-- Table structure for table `auteur`
--

DROP TABLE IF EXISTS `auteur`;
CREATE TABLE IF NOT EXISTS `auteur` (
  `idauteur` smallint NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `siecle` smallint DEFAULT NULL,
  PRIMARY KEY (`idauteur`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `auteur`
--

INSERT INTO `auteur` (`idauteur`, `nom`, `prenom`, `siecle`) VALUES
(1, 'Flaubert', 'Gustave', 19),
(9, 'Musset', 'Alfred', 18),
(10, 'Balzac', 'HonorÃ©', 19),
(11, 'Hugo', 'Victor', 19),
(12, 'Musset', 'Alfred', 19),
(13, 'Hugo', 'Victor', 19),
(14, 'Musset', 'Alfred', 19),
(15, 'Hugo', 'Victor', 19),
(16, 'Balzac', 'HonorÃ©', 19),
(17, 'Hugo', 'HonorÃ©', 19),
(18, 'Balzac', 'Alfred', 19),
(19, 'Hugo', 'HonorÃ©', 20),
(20, 'Hugo', 'HonorÃ©', 20),
(21, 'ngome', 'khemess', 265),
(22, 'ndao', 'moustapha', 20),
(23, 'ndao2', 'moustapha', 20),
(24, 'nda', 'moustapha', 20),
(25, 'ndax', 'moustapha', 20),
(26, 'ba', 'mouhamed', 15);

-- --------------------------------------------------------

--
-- Table structure for table `citations`
--

DROP TABLE IF EXISTS `citations`;
CREATE TABLE IF NOT EXISTS `citations` (
  `idcit` smallint NOT NULL AUTO_INCREMENT,
  `texte` varchar(100) DEFAULT NULL,
  `idauteur` smallint DEFAULT NULL,
  PRIMARY KEY (`idcit`),
  KEY `fk_idauteur` (`idauteur`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `citations`
--

INSERT INTO `citations` (`idcit`, `texte`, `idauteur`) VALUES
(1, 'Tout m\'afflige et me nuit et conspire à me nuire', 1),
(9, 'Je ne sais pas', 11),
(10, 'ggg', 11);

-- --------------------------------------------------------

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `nom_user` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `pass_user` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom_user`, `pass_user`) VALUES
(1, 'marcel', 'diagne'),
(2, 'pascal', 'faye'),
(3, 'khady', 'mbengue'),
(4, 'fagueye', 'djite'),
(5, 'moussa', 'diop'),
(7, 'soxna', 'fall');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `citations`
--
ALTER TABLE `citations`
  ADD CONSTRAINT `fk_idauteur` FOREIGN KEY (`idauteur`) REFERENCES `auteur` (`idauteur`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
