-- =============================================
-- MI JARDÍN - Schema inicial
-- Aplicar en: Supabase Dashboard > SQL Editor
-- =============================================

-- Perfil de cada planta en el jardín del usuario
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT,
  acquired_at DATE,
  location TEXT,
  pot_size TEXT,
  pot_substrate TEXT,
  watering_frequency_days INTEGER,
  fertilizing_frequency_days INTEGER,
  main_photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own plants" ON plants FOR ALL USING (auth.uid() = user_id);

-- Historial fotográfico por planta
CREATE TABLE plant_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  taken_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);
ALTER TABLE plant_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own photos" ON plant_photos FOR ALL USING (auth.uid() = user_id);

-- Registro de acciones de cuidado
CREATE TABLE care_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  care_type TEXT NOT NULL CHECK (care_type IN ('watering', 'fertilizing', 'pruning', 'repotting', 'treatment', 'other')),
  notes TEXT,
  performed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE care_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own care logs" ON care_logs FOR ALL USING (auth.uid() = user_id);

-- Diagnósticos de enfermedades
CREATE TABLE diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  diagnosis_result JSONB NOT NULL,
  diagnosed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own diagnoses" ON diagnoses FOR ALL USING (auth.uid() = user_id);

-- Recordatorios configurados por planta
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('watering', 'fertilizing', 'pruning', 'repotting', 'other')),
  frequency_days INTEGER NOT NULL,
  next_reminder_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own reminders" ON reminders FOR ALL USING (auth.uid() = user_id);

-- Mediciones de luz por planta
CREATE TABLE light_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lux_value INTEGER,
  light_level TEXT NOT NULL CHECK (light_level IN ('very_low', 'low', 'medium', 'high', 'very_high')),
  location_description TEXT,
  recommendation TEXT,
  measured_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE light_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own light readings" ON light_readings FOR ALL USING (auth.uid() = user_id);

-- Historial de conversaciones con El Jardinero
CREATE TABLE jardinero_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE jardinero_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own conversations" ON jardinero_conversations FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- STORAGE BUCKET (ejecutar en SQL Editor también)
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-photos', 'plant-photos', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Authenticated users can upload plant photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'plant-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view plant photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'plant-photos');

CREATE POLICY "Users can delete own plant photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'plant-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
