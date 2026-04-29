-- Incremental patches on top of rorop.sql to support full frontend wiring.
-- Idempotent where possible.

USE rorop;
SET FOREIGN_KEY_CHECKS=0;

-- access_log: add visit_time, exit_time, unit_id, AUTO_INCREMENT
ALTER TABLE access_log MODIFY log_id INT NOT NULL AUTO_INCREMENT;
ALTER TABLE access_log ADD COLUMN visit_time TIME NULL AFTER visit_date;
ALTER TABLE access_log ADD COLUMN exit_time  TIME NULL AFTER visit_time;
ALTER TABLE access_log ADD COLUMN unit_id    INT  NULL AFTER exit_time;
ALTER TABLE access_log ADD CONSTRAINT access_log_unit_fk FOREIGN KEY (unit_id) REFERENCES residential_unit(unit_id);

-- payment: widen mode enum, AUTO_INCREMENT
ALTER TABLE payment MODIFY payment_id INT NOT NULL AUTO_INCREMENT;
ALTER TABLE payment MODIFY payment_mode ENUM('Cash','Card','Online','UPI','Net Banking') DEFAULT NULL;

-- complaint AUTO_INCREMENT already set in rorop.sql
-- residential_unit AUTO_INCREMENT already set

-- Seeds for demo volume
INSERT INTO complaint (resident_id, manager_id, complaint_type, description, complaint_status, status, created_at, resolved_by) VALUES
  (201, 101, 'Plumbing',     'Water leakage in bathroom',  'Under Review', 'In Progress', '2026-03-12', 4),
  (202, 101, 'Common Area',  'Lift noise on odd floors',   'Open',         'Pending',     '2026-03-28', NULL),
  (203, 101, 'Electrical',   'Power fluctuation',          'Resolved',     'Resolved',    '2026-04-02', 3),
  (204, 101, 'Parking',      'Parking slot dispute',       'Open',         'Pending',     '2026-04-05', NULL),
  (201, 101, 'Housekeeping', 'Garbage not cleared',        'Resolved',     'Resolved',    '2026-04-08', 5);

INSERT INTO payment (resident_id, amount, payment_date, payment_mode) VALUES
  (201, 8500.00, '2026-03-01', 'UPI'),
  (202, 8500.00, '2026-03-05', 'Net Banking'),
  (203, 4200.00, '2026-03-10', 'Card'),
  (204, 8500.00, '2026-04-01', 'UPI'),
  (201, 8500.00, '2026-04-02', 'Cash');

INSERT INTO access_log (resident_id, visitor_name, visit_date, visit_time, exit_time, unit_id) VALUES
  (201, 'Rahul Delivery', '2026-04-08', '14:30:00', '14:45:00', 501),
  (202, 'Meera Khanna',   '2026-04-07', '18:00:00', '21:30:00', 503),
  (203, 'Service - AC',   '2026-04-06', '10:15:00', '12:00:00', 504),
  (204, 'Guest - Family', '2026-04-09', '16:00:00', '20:00:00', 505);

-- Extra resource_usage months for multiple units
INSERT INTO resource_usage (unit_id, electricity_units, water_units, month) VALUES
  (503, 290, 38, '2026-01'),
  (503, 310, 41, '2026-02'),
  (503, 305, 40, '2026-03'),
  (504, 270, 35, '2026-01'),
  (504, 265, 36, '2026-02'),
  (504, 280, 39, '2026-03'),
  (505, 210, 28, '2026-01'),
  (505, 220, 30, '2026-02'),
  (505, 230, 32, '2026-03');

SET FOREIGN_KEY_CHECKS=1;
