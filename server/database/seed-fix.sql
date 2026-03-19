-- ============================================================
--  AM Automobile – Seed Data Fix
--  Run this in mysql> after the main schema import
--  Fixes: bad JSON in cars batch, FK-failing messages
-- ============================================================

USE `am_automobile`;

-- Check what cars already inserted
-- SELECT id, make, model FROM cars ORDER BY id;

-- Remove any partial car data to re-insert cleanly
DELETE FROM `messages`;
DELETE FROM `cars`;
ALTER TABLE `cars` AUTO_INCREMENT = 1;

-- ─────────────────────────────────────────────────────────────
--  Re-insert all 10 cars with clean ASCII-safe JSON
-- ─────────────────────────────────────────────────────────────
INSERT INTO `cars`
  (`
make`,
`model`,
`year`,
`price`,
`mileage`,
`fuel_type`,
`transmission`,
`body_type
`, `engine_size`, `power_hp`, `color`, `status`, `featured`,
   `image_url`, `description`, `features`)
VALUES
(
  'BMW', '3 Series 320d', 2022, 149900.00, 32000,
  'diesel', 'automatic', 'sedan', 2.0, 190,
  'Czarny metalik', 'available', 1,
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
  'Piekne BMW 3 serii w wersji 320d xDrive. Samochod w doskonalym stanie technicznym, bezwypadkowy, serwisowany w ASO. Bogate wyposazenie: panoramiczny dach, adaptacyjny tempomat, system HiFi.',
  '["Panoramiczny dach", "Nawigacja Professional", "Adaptacyjny tempomat", "HiFi Sound System", "Kamera cofania 360", "Podgrzewane fotele", "Ambient lighting", "Park Assist"]'
),
(
  'Audi', 'A4 2.0 TFSI', 2021, 139900.00, 45000,
  'petrol', 'automatic', 'sedan', 2.0, 190,
  'Szary nardowy', 'available', 1,
  'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800',
  'Eleganckie Audi A4 w wersji S line. Samochod garazowany, jeden wlasciciel, pelna dokumentacja serwisowa.',
  '["S line exterior", "Virtual cockpit", "Bang and Olufsen Audio", "Keyless entry", "Podgrzewana kierownica", "LED reflektory Matrix", "Asystent pasa ruchu", "Czujniki parkowania"]'
),
(
  'Mercedes-Benz', 'C 220d AMG Line', 2023, 189900.00, 12000,
  'diesel', 'automatic', 'sedan', 2.0, 200,
  'Bialy polarny', 'available', 1,
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
  'Nowy model Mercedesa klasy C z pakietem AMG Line. Prawie nowy samochod z gwarancja producenta do 2026 roku.',
  '["AMG Line pakiet", "MBUX Infotainment", "Burmester sound system", "Aktywny asystent dystansu", "360 kamera", "Head-up Display", "Bezkluczykowy dostep", "Indukcyjne ladowanie"]'
),
(
  'Volkswagen', 'Golf 8 GTI', 2022, 119900.00, 28000,
  'petrol', 'automatic', 'hatchback', 2.0, 245,
  'Czerwony tornado', 'available', 0,
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
  'Legendarny Golf GTI w najnowszej generacji. Fenomenalne osiagi polaczone z codzienna uzytecznoscia.',
  '["IQ.DRIVE asystenty jazdy", "Digital Cockpit Pro", "Harman Kardon Audio", "Sportowe siedzenia", "DSG skrzynia 7-biegowa", "Performance brake kit", "18 felgi GTI Pretoria"]'
),
(
  'Toyota', 'RAV4 Hybrid', 2022, 159900.00, 38000,
  'hybrid', 'automatic', 'suv', 2.5, 222,
  'Szary meteoryt', 'available', 1,
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
  'Toyota RAV4 Hybrid AWD-i w wersji Executive. Ekonomiczny i dynamiczny SUV z napedem na 4 kola.',
  '["AWD-i napeed elektryczny", "Toyota Safety Sense", "JBL Audio 9 glosnikow", "Nagrzewnica postojowa", "Panoramiczny dach", "8 system multimedialny", "Kamera 360", "Bezprzewodowe ladowanie"]'
),
(
  'Skoda', 'Octavia Combi RS', 2021, 109900.00, 52000,
  'petrol', 'automatic', 'wagon', 2.0, 245,
  'Zielony mamba', 'available', 0,
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
  'Skoda Octavia RS Combi - polaczenie sportowego charakteru z praktycznoscia kombi. DSG 7-biegowe.',
  '["RS sport pakiet", "Canton Sound System", "Adaptive Cruise Control", "Virtual Cockpit", "Sportowe siedzenia RS", "19 felgi RS", "Szyberdach panoramiczny"]'
),
(
  'Porsche', 'Cayenne E-Hybrid', 2021, 399900.00, 25000,
  'phev', 'automatic', 'suv', 3.0, 462,
  'Czarny jet', 'available', 1,
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
  'Porsche Cayenne E-Hybrid - luksus, sport i oszczednosc w jednym. Zasieg elektryczny ok. 40 km.',
  '["Sportowy uklad wydechowy", "BOSE Surround Sound", "Panoramiczny dach", "Air Suspension", "LED Matrix reflektory", "Night Vision", "Porsche InnoDrive"]'
),
(
  'Ford', 'Mustang Mach-E', 2023, 179900.00, 8000,
  'electric', 'automatic', 'suv', NULL, 351,
  'Niebieski grabber', 'available', 0,
  'https://images.unsplash.com/photo-1647038020193-6a2a21d13b40?w=800',
  'Ford Mustang Mach-E GT Performance - w pelni elektryczny SUV z zasiegiem do 500 km WLTP.',
  '["Zasieg 500 km WLTP", "DC Fast Charging 150 kW", "SYNC 4A system", "15 ekran dotykowy", "Indukcyjne ladowanie", "FordPass Connect", "B&O Sound System"]'
),
(
  'Volvo', 'XC60 B5 AWD', 2022, 219900.00, 31000,
  'hybrid', 'automatic', 'suv', 2.0, 250,
  'Szary osmium', 'sold', 0,
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
  'Volvo XC60 Inscription z mild-hybrid. Jeden z najbezpieczniejszych SUV-ow na rynku.',
  '["Bowers and Wilkins Audio", "Pilot Assist", "360 kamera", "Air Quality System", "Apple CarPlay Android Auto", "Bezkluczykowy dostep", "Pamiec foteli"]'
),
(
  'Kia', 'EV6 GT-Line', 2023, 199900.00, 5000,
  'electric', 'automatic', 'suv', NULL, 229,
  'Aurora czarny', 'available', 0,
  'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=800',
  'Kia EV6 GT-Line AWD - nowatorski design i technologia 800V do ultra szybkiego ladowania.',
  '["Ladowanie 800V 350 kW DC", "Augmented Reality HUD", "Meridian Sound 14 glosnikow", "V2L Vehicle to Load", "Over-the-air updates", "Adaptacyjne reflektory LED"]'
);

-- ─────────────────────────────────────────────────────────────
--  Re-insert sample messages (now cars 1,2,3 exist)
-- ─────────────────────────────────────────────────────────────
INSERT INTO `messages` (`
name`,
`email
`, `phone`, `subject`, `message`, `car_id`, `is_read`) VALUES
(
  'Jan Kowalski',
  'jan.kowalski@example.com',
  '+48 600 123 456',
  'Zapytanie o BMW 3 Series',
  'Dzien dobry, jestem zainteresowany BMW 3 Series 320d. Czy jest mozliwosc umowienia jazdy probnej w tym tygodniu? Prosze o kontakt telefoniczny.',
  1, 0
),
(
  'Anna Nowak',
  'anna.nowak@example.com',
  '+48 700 987 654',
  'Finansowanie Audi A4',
  'Witam, chciałabym dowiedziec sie wiecej o mozliwosciach finansowania Audi A4. Czy oferujecie leasing lub kredyt?',
  2, 1
),
(
  'Piotr Wisniewski',
  'p.wisniewski@example.com',
  NULL,
  'Wycena samochodu + zakup Mercedesa',
  'Chcialbym zamienic mojego obecnego Mercedesa E-klasa 2019 na nowego Mercedesa C 220d. Czy mozecie wycenic moj samochod do rozliczenia?',
  3, 0
);

-- Verify
SELECT COUNT(*) AS cars_inserted
FROM cars;
SELECT COUNT(*) AS messages_inserted
FROM messages;
SELECT id, make, model, price
FROM cars
ORDER BY id;
