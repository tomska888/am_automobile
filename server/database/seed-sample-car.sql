-- AM Automobile – Sample Car Seed
-- Run at mysql> prompt:
--   SOURCE C:/Users/zioma/Desktop/am automobile/mk/server/database/seed-sample-car.sql;
-- OR paste the INSERT below directly.

USE am_automobile;

INSERT INTO cars
    (make, model, year, price, mileage, fuel_type, transmission, body_type,
    engine_size, power_hp, color, status, featured, image_url, gallery, features, description)
VALUES
    (
        'BMW',
        '3 Series',
        2022,
        159900.00,
        28000,
        'petrol',
        'automatic',
        'sedan',
        2.0,
        258,
        'Alpine White',
        'available',
        1,
        NULL,
        '[]',
        '["Heated seats","Parking sensors","Apple CarPlay","Android Auto","LED headlights","Sunroof","Adaptive cruise control","Lane departure warning","Wireless charging","Premium sound system"]',
        'Excellent condition 2022 BMW 3 Series 320i. Full BMW service history, one owner. Loaded with premium features including M Sport package, panoramic sunroof, and Harman Kardon audio system. No accidents, non-smoker vehicle. Available for test drive by appointment.'
  );

-- Verify
SELECT id, make, model, year, price, status, featured
FROM cars
ORDER BY id DESC
LIMIT 5;
