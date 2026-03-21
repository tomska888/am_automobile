-- ============================================================
--  AM Automobile – Favorites Table Migration
--  Run AFTER schema.sql to add user favorites functionality
-- ============================================================

USE `am_automobile`;

-- ─────────────────────────────────────────────────────────────
--  TABLE: user_favorites
--  Stores user <-> car favorites (many-to-many)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `user_favorites` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED NOT NULL,
  `car_id`     INT UNSIGNED NOT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_car` (`user_id`, `car_id`),
  KEY `idx_fav_user`       (`user_id`),
  KEY `idx_fav_car`        (`car_id`),
  CONSTRAINT `fk_fav_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_fav_car`
    FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
