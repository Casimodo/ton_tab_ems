CREATE TABLE ems_dispatch (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- ID unique de l'intervention
    agent_id INT NULL,                          -- ID de l'agent qui prend en charge (NULL si personne)
    type VARCHAR(50) NOT NULL,                  -- Type d'intervention (accident, feu, médical, etc.)
    description TEXT,                           -- Description libre
    location VARCHAR(255) NOT NULL,             -- Localisation (coordonnées, adresse, zone RP...)
    status ENUM('pending', 'assigned', 'on_scene', 'closed') DEFAULT 'pending', -- Statut
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Création
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- MAJ auto
);