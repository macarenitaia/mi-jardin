-- =============================================
-- Actualizar niveles de luz a español
-- =============================================

-- Modificar el CHECK constraint de light_level para usar nombres en español
ALTER TABLE light_readings
DROP CONSTRAINT IF EXISTS light_readings_light_level_check;

ALTER TABLE light_readings
ADD CONSTRAINT light_readings_light_level_check
CHECK (light_level IN ('muy_baja', 'baja', 'media', 'alta', 'muy_alta'));

-- Actualizar valores existentes si los hay
UPDATE light_readings SET light_level = 'muy_baja' WHERE light_level = 'very_low';
UPDATE light_readings SET light_level = 'baja' WHERE light_level = 'low';
UPDATE light_readings SET light_level = 'media' WHERE light_level = 'medium';
UPDATE light_readings SET light_level = 'alta' WHERE light_level = 'high';
UPDATE light_readings SET light_level = 'muy_alta' WHERE light_level = 'very_high';
