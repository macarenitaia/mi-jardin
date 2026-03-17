-- =============================================
-- Permitir acceso anónimo (demo mode)
-- =============================================

-- Eliminar políticas antiguas que requerían auth
DROP POLICY IF EXISTS "Users see own plants" ON plants;
DROP POLICY IF EXISTS "Users see own photos" ON plant_photos;
DROP POLICY IF EXISTS "Users see own care logs" ON care_logs;
DROP POLICY IF EXISTS "Users see own diagnoses" ON diagnoses;
DROP POLICY IF EXISTS "Users see own reminders" ON reminders;
DROP POLICY IF EXISTS "Users see own light readings" ON light_readings;
DROP POLICY IF EXISTS "Users see own conversations" ON jardinero_conversations;

-- Nuevas políticas: permitir todo para demo mode
CREATE POLICY "Allow all operations on plants" ON plants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on plant_photos" ON plant_photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on care_logs" ON care_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on diagnoses" ON diagnoses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on reminders" ON reminders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on light_readings" ON light_readings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on jardinero_conversations" ON jardinero_conversations FOR ALL USING (true) WITH CHECK (true);

-- Storage policies: permitir todo
DROP POLICY IF EXISTS "Authenticated users can upload plant photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view plant photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own plant photos" ON storage.objects;

CREATE POLICY "Allow all uploads to plant-photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'plant-photos');

CREATE POLICY "Allow all views of plant-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'plant-photos');

CREATE POLICY "Allow all deletes of plant-photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'plant-photos');
