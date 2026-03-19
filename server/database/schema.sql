-- ============================================================
--  AM Automobile – MySQL Database Schema
--  Compatible with: MySQL 5.7+ / MariaDB 10.3+
--  Charset: utf8mb4 (full Unicode + emoji support)
--  Run this file once to initialize the database.
--  For Hostinger: import via phpMyAdmin → Import tab
-- ============================================================

-- Create & select database
CREATE DATABASE IF NOT EXISTS `am_automobile`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `am_automobile`;

-- ─────────────────────────────────────────────────────────────
--  TABLE: users
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(100)     NOT NULL,
  `email`         VARCHAR(255)     NOT NULL,
  `password_hash` VARCHAR(255)     NOT NULL,
  `role`          ENUM('user','admin') NOT NULL DEFAULT 'user',
  `is_active`     TINYINT(1)       NOT NULL DEFAULT 1,
  `last_login`    DATETIME         DEFAULT NULL,
  `created_at`    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
--  TABLE: cars
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `cars` (
  `id`            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  `make`          VARCHAR(50)      NOT NULL,
  `model`         VARCHAR(100)     NOT NULL,
  `year`          SMALLINT UNSIGNED NOT NULL,
  `price`         DECIMAL(10,2)    NOT NULL,
  `mileage`       INT UNSIGNED     DEFAULT NULL COMMENT 'Kilometres',
  `fuel_type`     ENUM('petrol','diesel','hybrid','electric','lpg','phev','other')
                                   NOT NULL DEFAULT 'petrol',
  `transmission`  ENUM('manual','automatic','semi-automatic','cvt')
                                   DEFAULT NULL,
  `body_type`     ENUM('sedan','hatchback','suv','coupe','wagon','convertible','van','pickup','other')
                                   DEFAULT NULL,
  `engine_size`   DECIMAL(3,1)     DEFAULT NULL COMMENT 'Litres, e.g. 2.0',
  `power_hp`      SMALLINT UNSIGNED DEFAULT NULL COMMENT 'Horsepower',
  `color`         VARCHAR(50)      DEFAULT NULL,
  `vin`           VARCHAR(17)      DEFAULT NULL,
  `status`        ENUM('available','reserved','sold','archived')
                                   NOT NULL DEFAULT 'available',
  `featured`      TINYINT(1)       NOT NULL DEFAULT 0,
  `image_url`     VARCHAR(500)     DEFAULT NULL,
  `gallery`       JSON             DEFAULT NULL COMMENT 'Array of image URLs',
  `features`      JSON             DEFAULT NULL COMMENT 'Array of feature strings',
  `description`   TEXT             DEFAULT NULL,
  `created_at`    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cars_vin` (`vin`),
  KEY `idx_cars_status`    (`status`),
  KEY `idx_cars_featured`  (`featured`),
  KEY `idx_cars_make`      (`make`),
  KEY `idx_cars_year`      (`year`),
  KEY `idx_cars_price`     (`price`),
  KEY `idx_cars_fuel_type` (`fuel_type`),
  FULLTEXT KEY `ft_cars_search` (`make`, `model`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
--  TABLE: messages  (contact form submissions)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `messages` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100)  NOT NULL,
  `email`       VARCHAR(255)  NOT NULL,
  `phone`       VARCHAR(30)   DEFAULT NULL,
  `subject`     VARCHAR(200)  NOT NULL,
  `message`     TEXT          NOT NULL,
  `car_id`      INT UNSIGNED  DEFAULT NULL COMMENT 'Related car enquiry (nullable)',
  `is_read`     TINYINT(1)    NOT NULL DEFAULT 0,
  `ip_address`  VARCHAR(45)   DEFAULT NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_messages_is_read`   (`is_read`),
  KEY `idx_messages_car_id`    (`car_id`),
  KEY `idx_messages_created`   (`created_at`),
  CONSTRAINT `fk_messages_car`
    FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  SEED DATA
-- ============================================================

-- ─────────────────────────────────────────────────────────────
--  Admin user
--  Email   : admin@amautomobile.pl
--  Password: Admin1234!
--  Hash generated with bcrypt rounds=12
-- ─────────────────────────────────────────────────────────────
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`) VALUES
(
  'Administrator',
  'admin@amautomobile.pl',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKx2CZ.3bKXDhWVy',
  'admin'
);

-- ─────────────────────────────────────────────────────────────
--  Sample cars inventory
-- ─────────────────────────────────────────────────────────────
INSERT INTO `cars`
  (`make`, `model`, `year`, `price`, `mileage`, `fuel_type`, `transmission`,
   `body_type`, `engine_size`, `power_hp`, `color`, `status`, `featured`,
   `image_url`, `description`, `features`)
VALUES
(
  'BMW', '3 Series 320d', 2022, 149900.00, 32000,
  'diesel', 'automatic', 'sedan', 2.0, 190,
  'Czarny metalik', 'available', 1,
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
  'Piękne BMW 3 serii w wersji 320d xDrive. Samochód w doskonałym stanie technicznym, bezwypadkowy, serwisowany w ASO. Bogate wyposażenie: panoramiczny dach, adaptacyjny tempomat, system HiFi.',
  '["Panoramiczny dach", "Nawigacja Professional", "Adaptacyjny tempomat", "HiFi Sound System", "Kamera cofania 360°", "Podgrzewane fotele", "Ambient lighting", "Park Assist"]'
),
(
  'Audi', 'A4 2.0 TFSI', 2021, 139900.00, 45000,
  'petrol', 'automatic', 'sedan', 2.0, 190,
  'Szary nardowy', 'available', 1,
  'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800',
  'Eleganckie Audi A4 w wersji S line. Samochód garażowany, jeden właściciel, pełna dokumentacja serwisowa.',
  '["S line exterior", "Virtual cockpit", "Bang & Olufsen Audio", "Keyless entry", "Podgrzewana kierownica", "LED reflektory Matrix", "Asystent pasa ruchu", "Czujniki parkowania"]'
),
(
  'Mercedes-Benz', 'C 220d AMG Line', 2023, 189900.00, 12000,
  'diesel', 'automatic', 'sedan', 2.0, 200,
  'Biały polarny', 'available', 1,
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
  'Nowy model Mercedesa klasy C z pakietem AMG Line. Prawie nowy samochód z gwarancją producenta do 2026 roku.',
  '["AMG Line pakiet", "MBUX Infotainment", "Burmester® sound system", "Aktywny asystent dystansu", "360° kamera", "Head-up Display", "Bezkluczykowy dostęp", "Indukcyjne ładowanie"]'
),
(
  'Volkswagen', 'Golf 8 GTI', 2022, 119900.00, 28000,
  'petrol', 'automatic', 'hatchback', 2.0, 245,
  'Czerwony tornado', 'available', 0,
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
  'Legendarny Golf GTI w najnowszej generacji. Fenomenalne osiągi połączone z codzienną użytecznością.',
  '["IQ.DRIVE asystenty jazdy", "Digital Cockpit Pro", "Harman Kardon Audio", "Sportowe siedzenia kubełkowe", "DSG skrzynia 7-biegowa", "Performance brake kit", "18\" felgi GTI Pretoria"]'
),
(
  'Toyota', 'RAV4 Hybrid', 2022, 159900.00, 38000,
  'hybrid', 'automatic', 'suv', 2.5, 222,
  'Szary meteoryt', 'available', 1,
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
  'Toyota RAV4 Hybrid AWD-i w wersji Executive. Ekonomiczny i dynamiczny SUV z napędem na 4 koła.',
  '["AWD-i napęd elektryczny", "Toyota Safety Sense", "JBL Audio 9 głośników", "Nagrzewnica postojowa", "Panoramiczny dach", "8\" system multimedialny", "Kamera 360°", "Bezprzewodowe ładowanie"]'
),
(
  'Skoda', 'Octavia Combi RS', 2021, 109900.00, 52000,
  'petrol', 'automatic', 'wagon', 2.0, 245,
  'Zielony mamba', 'available', 0,
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
  'Skoda Octavia RS Combi – połączenie sportowego charakteru z praktycznością kombi. DSG 7-biegowe.',
  '["RS sport pakiet", "Canton® Sound System", "Adaptive Cruise Control", "Virtual Cockpit", "Sportowe siedzenia RS", "19\" felgi RS", "Szyberdach panoramiczny"]'
),
(
  'Porsche', 'Cayenne E-Hybrid', 2021, 399900.00, 25000,
  'phev', 'automatic', 'suv', 3.0, 462,
  'Czarny jet', 'available', 1,
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
  'Porsche Cayenne E-Hybrid – luksus, sport i oszczędność w jednym. Zasięg elektryczny ok. 40 km.',
  '["Sportowy układ wydechowy", "BOSE Surround Sound", "Panoramiczny dach szyberdach", "Air Suspension", "LED Matrix reflektory", "Night Vision", "Porsche InnoDrive"]'
),
(
  'Ford', 'Mustang Mach-E', 2023, 179900.00, 8000,
  'electric', 'automatic', 'suv', NULL, 351,
  'Niebieski grabber', 'available', 0,
  'https://images.unsplash.com/photo-1647038020193-6a2a21d13b40?w=800',
  'Ford Mustang Mach-E GT Performance – w pełni elektryczny SUV z zasięgiem do 500 km WLTP.',
  '["Zasięg 500 km WLTP", "DC Fast Charging 150 kW", "SYNC 4A system", "15.5\" ekran dotykowy", "Indukcyjne ładowanie", "FordPass Connect", "Kamera B&O Sound"]'
),
(
  'Volvo', 'XC60 B5 AWD', 2022, 219900.00, 31000,
  'hybrid', 'automatic', 'suv', 2.0, 250,
  'Szary osmium', 'sold', 0,
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
  'Volvo XC60 Inscription z mild-hybrid. Jeden z najbezpieczniejszych SUV-ów na rynku.',
  '["Bowers & Wilkins Audio", "Pilot Assist", "360° kamera", "Air Quality System", "Apple CarPlay/Android Auto", "Bezkluczykowy dostęp", "Pamięć foteli"]'
),
(
  'Kia', 'EV6 GT-Line', 2023, 199900.00, 5000,
  'electric', 'automatic', 'suv', NULL, 229,
  'Aurora czarny', 'available', 0,
  'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=800',
  'Kia EV6 GT-Line AWD – nowatorski design i technologia 800V do ultra szybkiego ładowania.',
  '["Ładowanie 800V / 350 kW DC", "Augmented Reality HUD", "Meridian Sound 14 głośników", "V2L Vehicle to Load", "Over-the-air updates", "Adaptacyjne reflektory LED"]'
);

-- ─────────────────────────────────────────────────────────────
--  Sample messages
-- ─────────────────────────────────────────────────────────────
INSERT INTO `messages` (`name`, `email`, `phone`, `subject`, `message`, `car_id`, `is_read`) VALUES
(
  'Jan Kowalski',
  'jan.kowalski@example.com',
  '+48 600 123 456',
  'Zapytanie o BMW 3 Series',
  'Dzień dobry, jestem zainteresowany BMW 3 Series 320d. Czy jest możliwość umówienia jazdy próbnej w tym tygodniu? Proszę o kontakt telefoniczny.',
  1, 0
),
(
  'Anna Nowak',
  'anna.nowak@example.com',
  '+48 700 987 654',
  'Finansowanie Audi A4',
  'Witam, chciałabym dowiedzieć się więcej o możliwościach finansowania Audi A4. Czy oferujecie leasing lub kredyt? Proszę o informację o wymaganych dokumentach.',
  2, 1
),
(
  'Piotr Wiśniewski',
  'p.wisniewski@example.com',
  NULL,
  'Wycena mojego samochodu + zakup Mercedesa',
  'Chciałbym zamienić mojego obecnego Mercedesa E-klasa 2019 na nowego Mercedesa C 220d. Czy możecie wycenić mój samochód do rozliczenia? Proszę o kontakt.',
  3, 0
);

-- ============================================================
--  NOTES FOR PRODUCTION DEPLOYMENT (HOSTINGER)
-- ============================================================
-- 1. In Hostinger cPanel → Databases → MySQL Databases:
--    a. Create database: am_automobile (or your prefix_am_automobile)
--    b. Create user with ALL PRIVILEGES on that database
-- 2. Import this file via phpMyAdmin → Import
-- 3. Update mk/server/.env with your Hostinger DB credentials:
--    DB_HOST=localhost (or Hostinger's internal DB host)
--    DB_USER=your_db_user
--    DB_PASSWORD=your_db_password
--    DB_NAME=your_db_name
-- 4. Change the admin password immediately after first login!
--    The default hash above = "Admin1234!" — change it in phpMyAdmin
--    or via the admin panel's Change Password feature.
-- ============================================================
