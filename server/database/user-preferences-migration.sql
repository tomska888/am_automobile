-- ============================================================
--  AM Automobile – User Preferences Migration
--  Adds theme and locale columns to users table
--  Run once on existing databases
-- ============================================================

ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `theme`  VARCHAR(10)  NOT NULL DEFAULT 'system'
    COMMENT 'UI theme: light | dark | system',
  ADD COLUMN IF NOT EXISTS `locale` VARCHAR(10)  NOT NULL DEFAULT 'en'
    COMMENT 'UI locale: en | pl | lt | ru';
