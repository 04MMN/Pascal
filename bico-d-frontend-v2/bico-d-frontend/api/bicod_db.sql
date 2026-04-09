-- ═══════════════════════════════════════════════════
--  BICO-D — Schéma base de données MySQL
--  Fichier : bicod_db.sql
--  Usage   : mysql -u root -p < bicod_db.sql
-- ═══════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS bicod_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bicod_db;

-- ── Table : users ────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom        VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,          -- bcrypt hash
  role       ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Table : drones ───────────────────────────────
CREATE TABLE IF NOT EXISTS drones (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom          VARCHAR(100) NOT NULL,
  type_cap     ENUM('RGB','Multispectral','Thermique','LiDAR','Pulvérisation','Autre') NOT NULL,
  modele       VARCHAR(100) DEFAULT NULL,
  status       ENUM('libre','mission','maintenance') NOT NULL DEFAULT 'libre',
  prix         DECIMAL(10,2) DEFAULT 0,        -- FCFA / heure
  autonomie    SMALLINT UNSIGNED DEFAULT 0,    -- minutes
  localisation VARCHAR(150) DEFAULT NULL,
  description  TEXT DEFAULT NULL,
  proprio_id   INT UNSIGNED DEFAULT NULL,      -- FK → users.id (propriétaire)
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (proprio_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Table : reservations ────────────────────────
CREATE TABLE IF NOT EXISTS reservations (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  drone_id     INT UNSIGNED NOT NULL,
  nom_mission  VARCHAR(200) NOT NULL,
  date_mission DATE NOT NULL,
  duree        TINYINT UNSIGNED DEFAULT NULL,  -- heures
  description  TEXT DEFAULT NULL,
  status       ENUM('attente','approuve','rejete') NOT NULL DEFAULT 'attente',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (drone_id) REFERENCES drones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Table : depots ───────────────────────────────
CREATE TABLE IF NOT EXISTS depots (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  nom          VARCHAR(100) NOT NULL,
  type_cap     ENUM('RGB','Multispectral','Thermique','LiDAR','Pulvérisation','Autre') NOT NULL,
  modele       VARCHAR(100) DEFAULT NULL,
  prix         DECIMAL(10,2) DEFAULT 0,
  autonomie    SMALLINT UNSIGNED DEFAULT 0,
  localisation VARCHAR(150) DEFAULT NULL,
  description  TEXT DEFAULT NULL,
  status       ENUM('attente','approuve','rejete') NOT NULL DEFAULT 'attente',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ════════════════════════════════════════════════
--  DONNÉES DE TEST
-- ════════════════════════════════════════════════

-- Utilisateurs (passwords hashés avec bcrypt)
-- user@bicod.sn    → 1234
-- admin@bicod.sn   → admin

INSERT INTO users (nom, email, password, role) VALUES
('Moussa Diallo', 'user@bicod.sn',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Aminata Faye',  'admin@bicod.sn', '$2y$10$TKh8H1.PfYLlPFbOXzFpneI35r3hMSBbWYf93NU5s1l2kXz4O7bqm', 'admin'),
('Jean Dupont',   'jean@bicod.sn',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Drones de démonstration
INSERT INTO drones (nom, type_cap, modele, status, prix, autonomie, localisation, description, proprio_id) VALUES
('Agro-Pro X1',    'Multispectral', 'DJI Agras T30',    'libre',       12000, 45, 'Thiès',       'Drone de précision pour analyse végétale',      2),
('SkyField-3',     'RGB',           'Parrot Bluegrass',  'mission',     8000,  35, 'Dakar',       'Idéal pour cartographie et surveillance',        2),
('ThermoScan Pro', 'Thermique',     'Yuneec H520T',      'libre',       18000, 50, 'Saint-Louis', 'Détection de stress hydrique et maladies',       2),
('LiDAR Mapper',   'LiDAR',         'DJI Matrice 300',   'maintenance', 25000, 55, 'Kaolack',     'Cartographie 3D haute précision',               2),
('SprayBot Alpha', 'Pulvérisation', 'XAG P100',          'libre',       20000, 40, 'Ziguinchor',  'Pulvérisation de précision 10L/min',            2);
