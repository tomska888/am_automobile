-- ============================================================
--  AM Automobile – Add owners column to cars table
--  Run via phpMyAdmin or MySQL CLI:
--    mysql -u root -p am_automobile < owners-migration.sql
-- ============================================================

ALTER TABLE `cars`
  ADD COLUMN `owners` TINYINT UNSIGNED DEFAULT NULL
    COMMENT 'Number of previous owners'
  AFTER `vin`;
