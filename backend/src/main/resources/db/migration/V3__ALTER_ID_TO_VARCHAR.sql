ALTER TABLE steps DROP CONSTRAINT fk_step_service;

ALTER TABLE services
  ALTER COLUMN id TYPE VARCHAR(36)
  USING id::VARCHAR(36);

ALTER TABLE steps
  ALTER COLUMN service_id TYPE VARCHAR(36)
  USING service_id::VARCHAR(36);

ALTER TABLE steps
  ADD CONSTRAINT fk_step_service FOREIGN KEY (service_id) REFERENCES services(id);
