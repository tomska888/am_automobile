-- ============================================================
--  AM Automobile – Password Reset Tokens Migration
--  Run this once against your existing am_automobile database.
--  For Hostinger: import via phpMyAdmin → Import tab
-- ============================================================

USE `am_automobile`;

-- ─────────────────────────────────────────────────────────────
--  TABLE: password_reset_tokens
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED  NOT NULL,
  `token_hash` VARCHAR(255)  NOT NULL  COMMENT 'SHA-256 hash of the raw token',
  `expires_at` DATETIME      NOT NULL,
  `used_at`    DATETIME      DEFAULT NULL,
  `created_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reset_token_hash` (`token_hash`),
  KEY `idx_reset_user_id`   (`user_id`),
  KEY `idx_reset_expires`   (`expires_at`),
  CONSTRAINT `fk_reset_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
