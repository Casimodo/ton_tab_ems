# PROJET : ton_tab_ems

** PROJET, EN COURS DE CREATION NON EXPLOITABLE POUR L'INSTANT ! **

## 📜 Description

Ce projet FiveM à pour but de créer une tablette pour les EMS dans FiveM à la fois accessible en jeux mais aussi sur internet avec un certain niveau de sécurité.
L'idée est aussi de rester le plus émmersif possible tout en ayant pour le joueur la possibilité de continuer l'aventure sans être obligatoirement en jeux (pratique pour les chefs de service de suivre l'activité pendant leur réelle congés ou tout simplement continuer une expérience hors IG).
Cela permet de montrer à votre comunauté les différentes possibilité de FiveM une expérience du RP innoubliable.

## 📦 Installation & pré-requis

1. Installer les deux dépendances qui sont "ox_inventory" et "loaf_headshot_base64" si vous ne les avez déjà pas
2. Aller dans le dossier "shared" et adapter la config à vos besoins.
3. Copier la ressouces et lancez là.

## ⚙️ Personnalisation

Un certain nombre d'image sont en dans leur dossier respectif et donc modifiable par respect pour l'auteur qui fournie ce script gratuitement merci de garder sont logo visible cela permettra à tout à chaqu'un de connaitre cette resseouces et donc de motiver l'auteur à y amener des améliorations continue.

## 😁 Possibilitées

- Prise en charge multi-unité
- Map pour les appels
- Recrutement et gestion du personnel (grade, fiche etc) - Les grades donnes des accès différents
- Gestion des soins (Création, Modification, Suppression) avec desciptif et prix pour la facturation
- Création / Modification d'un fichier patient (suppression réservé grade voir config)
- Création / Modification d'une fiche traitement patient, avec facturation (suppression réservé grade voir config)
- Recherche de fiche d'un patient
- Création des papiers avec Items pour les arrêts de travail et autre (image personnalisable pour votre serveur)
- Aide à la création d'une fiche de soins, permet d'avoir une aide préconfiguré par la direction pour orienter les soins, permet d'avoir un RP plus poussé
- Visu des effectifs
- Prise de service
- Gestion feuille de temps
- Dispatch (Unités, Affectation Véhicule, Secteur, CP, Equipes, Statut)
- Facturation (En cours, Traités, classement et calcul pour les services de la ville) permet d'avoir un suivis par l'état
- Gestion de la flotte de véhicule responsabilité
- Note de frais (système de gestion de notes de frais pour les agents)

## 🛜 Exports serveur

```
-- Appel, signalement | exemple: export['ton_tab_ems']:alert(source, "accident de chantier")  
exports['ton_tab_ems']:alert(source, raison)
```