CREATE TABLE ton_ems_dispatch (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- ID unique de l'intervention
    unity_id INT NULL,                          -- ID de l'agent qui prend en charge (NULL si personne)
    type VARCHAR(50) NOT NULL,                  -- Type d'intervention (accident, feu, médical, etc.)
    description TEXT,                           -- Description libre
    location VARCHAR(255) NOT NULL,             -- Localisation (coordonnées, adresse, zone RP...)
    status ENUM('en attente','attribué','traité','close') DEFAULT 'en attente', -- Statut
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Création
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- MAJ auto
);


CREATE TABLE ton_ems_agents (
    identifier VARCHAR(60) PRIMARY KEY,             -- identifiant unique de l’agent
    nom VARCHAR(100) NOT NULL,                     -- nom complet de l’agent
    matricule VARCHAR(20) UNIQUE NOT NULL,         -- numéro unique (badge / matricule EMS)
    grade ENUM('stagiaire', 'ambulancier', 'chef_equipe', 'medecin') 
          DEFAULT 'ambulancier',                   -- grade ou rôle
    date_embauche DATE DEFAULT NULL,               -- si tu veux garder une date d’entrée
    phone_number VARCHAR(20) DEFAULT NULL,         -- si besoin pour RP
    notes TEXT DEFAULT NULL,                       -- remarques diverses
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ton_ems_unites (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- identifiant unique de l’unité
    nom_unite VARCHAR(50) NOT NULL,            -- ex: "Ambu 1", "VL Médic 2"
    status ENUM('disponible', 'en_inter', 'en_transfert', 'indisponible') 
           DEFAULT 'disponible',               -- état global de l’unité
    agent1_id VARCHAR(60) DEFAULT '',                    -- premier ambulancier (obligatoire)
    agent2_id VARCHAR(60) DEFAULT '',                -- 2ème ambulancier
    agent3_id VARCHAR(60) DEFAULT '',                -- 3ème ambulancier
    agent4_id VARCHAR(60) DEFAULT '',                -- 4ème ambulancier
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO `ton_ems_unites` (`nom_unite`, `status`) VALUES ('Unité 1', 'indisponible');
INSERT INTO `ton_ems_unites` (`nom_unite`, `status`) VALUES ('Unité 2', 'indisponible');
INSERT INTO `ton_ems_unites` (`nom_unite`, `status`) VALUES ('Unité 3', 'indisponible');
INSERT INTO `ton_ems_unites` (`nom_unite`, `status`) VALUES ('Unité 4', 'indisponible');
INSERT INTO `ton_ems_unites` (`nom_unite`, `status`) VALUES ('Unité 5', 'indisponible');
INSERT INTO `ton_ems_unites` (`nom_unite`, `status`) VALUES ('Unité 6', 'indisponible');