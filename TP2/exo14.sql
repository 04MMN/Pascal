-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Sam 09 Juillet 2016 à 13:14
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `exo14`
--

-- --------------------------------------------------------

--
-- Structure de la table `auteur`
--

CREATE TABLE IF NOT EXISTS `auteur` (
  `idauteur` smallint(6) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `siecle` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`idauteur`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Contenu de la table `auteur`
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
(20, 'Hugo', 'HonorÃ©', 20);

-- --------------------------------------------------------

--
-- Structure de la table `citations`
--

CREATE TABLE IF NOT EXISTS `citations` (
  `idcit` smallint(6) NOT NULL AUTO_INCREMENT,
  `texte` varchar(100) DEFAULT NULL,
  `idauteur` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`idcit`),
  KEY `fk_idauteur` (`idauteur`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Contenu de la table `citations`
--

INSERT INTO `citations` (`idcit`, `texte`, `idauteur`) VALUES
(1, 'Tout m''afflige et me nuit et conspire à me nuire', 1),
(9, 'Je ne sais pas', 11);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE IF NOT EXISTS `utilisateur` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `nom_user` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `pass_user` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom_user`, `pass_user`) VALUES
(1, 'marcel', 'diagne'),
(2, 'pascal', 'faye'),
(3, 'khady', 'mbengue'),
(4, 'fagueye', 'djite');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `citations`
--
ALTER TABLE `citations`
  ADD CONSTRAINT `fk_idauteur` FOREIGN KEY (`idauteur`) REFERENCES `auteur` (`idauteur`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
