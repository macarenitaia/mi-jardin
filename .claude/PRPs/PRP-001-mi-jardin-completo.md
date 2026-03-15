# PRP-001: Mi Jardín - App Completa

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-15
> **Proyecto**: Mi Jardín

---

## Objetivo

Implementar la aplicación completa "Mi Jardín" con design system Liquid Glass: una app de gestión inteligente de jardín que permite identificar plantas por foto (IA Vision), llevar historial completo de cuidados, diagnosticar enfermedades, recibir recordatorios y conversar con un agente IA llamado "El Jardinero" que puede actualizar los perfiles directamente.

---

## Por Qué

| Problema | Solución |
|----------|----------|
| Las personas pierden plantas por no saber qué enfermedad tienen o cuándo regarlas | Identificación por foto + historial de cuidados automatizado |
| Se pierde tiempo buscando en Google qué hacer con cada planta | Agente IA "El Jardinero" da consejos contextualizados a cada planta |
| Sin diagnóstico temprano las enfermedades se propagan | Diagnóstico por foto con plan de acción paso a paso |
| No hay registro histórico de cuidados por planta | Perfil completo con historial fotográfico y log de acciones |
| Dificultad para calcular riego correcto según macetero | Calculadora automática según especie, tamaño y sustrato |

**Valor de negocio**: Todas las plantas del jardín con perfil completo en la app, historial de cuidados intacto, cero pérdidas por información incompleta. Métrica de éxito: cada planta tiene al menos 1 acción registrada en los primeros 7 días de uso.

---

## Qué

### Criterios de Éxito

- [ ] Usuario puede registrarse e iniciar sesión (Email/Password)
- [ ] Usuario puede fotografiar una planta desconocida y obtener su identificación (nombre, especie, cuidados básicos)
- [ ] Planta identificada se añade a la biblioteca del jardín con un click
- [ ] Cada planta tiene perfil completo: fotos, historial de riegos/abono/poda, recordatorios activos
- [ ] Usuario puede fotografiar una planta enferma y recibir diagnóstico con plan de acción
- [ ] "El Jardinero" (agente IA) puede responder preguntas Y actualizar datos de plantas directamente via tools
- [ ] Recordatorios de riego/abono/poda funcionan según frecuencia configurada por planta
- [ ] Calculadora de riego devuelve frecuencia y cantidad según especie + macetero
- [ ] Medidor de luz registra la lectura y recomienda ubicación óptima para la planta
- [ ] `npm run build` exitoso y sin errores de TypeScript

### Comportamiento Esperado (Happy Path)

1. Usuario abre la app → ve su biblioteca de jardín (plantas con foto, nombre y próxima acción pendiente)
2. Tiene una planta nueva → toca "Identificar" → sube foto → IA responde con nombre, especie y cuidados → un click para añadirla a su jardín
3. Selecciona una planta existente → ve su perfil: foto principal, historial de cuidados, próximos recordatorios
4. Registra que la regó → queda guardado en `care_logs` → el recordatorio se resetea
5. Ve que la planta tiene manchas → toca "Diagnosticar" → sube foto → IA devuelve diagnóstico con plan de acción → queda guardado en `diagnoses`
6. Abre "El Jardinero" → pregunta: "¿Cuándo riegar el ficus?" → el agente consulta el perfil y responde; si el usuario dice "actualiza la frecuencia de riego a cada 3 días", el agente lo actualiza directamente via tool
7. Recibe notificación de riego → entra, registra acción → recordatorio se pospone según frecuencia

---

## Contexto

### Estado Actual del Proyecto

- Framework base: Next.js 16 + TypeScript configurado y funcionando
- Supabase clients creados en `src/lib/supabase/` (server y client)
- Rutas de auth scaffoldeadas: `(auth)/login` y `(auth)/signup` (sin implementar)
- Ruta principal scaffoldeada: `(main)/dashboard` (sin implementar)
- Features scaffoldeadas vacías: `auth/`, `dashboard/` (solo `.gitkeep`)
- **Sin código real implementado** — el proyecto es un template base limpio

### Referencias

- `src/lib/supabase/server.ts` - Cliente Supabase server ya configurado
- `src/lib/supabase/client.ts` - Cliente Supabase browser ya configurado
- `.claude/design-systems/liquid-glass/liquid-glass.md` - Recetas CSS y patrones de Liquid Glass
- `.claude/skills/ai/references/agents/00-setup-base.md` - Setup de OpenRouter + AI SDK v5
- `.claude/skills/ai/references/agents/01-chat-streaming.md` - Patrón de chat streaming con useChat
- `.claude/skills/ai/references/agents/04-vision-analysis.md` - Vision con useImageUpload + Gemini
- `.claude/skills/ai/references/agents/05-tools-funciones.md` - Tools con AI SDK v5 (inputSchema, stopWhen)

### Arquitectura Propuesta (Feature-First)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx              # Sidebar + nav Liquid Glass
│   │   ├── dashboard/page.tsx      # Vista biblioteca del jardín
│   │   ├── plants/
│   │   │   ├── page.tsx            # Garden library
│   │   │   └── [id]/page.tsx       # Plant profile
│   │   ├── identify/page.tsx       # Identificar planta por foto
│   │   ├── diagnose/page.tsx       # Diagnosticar enfermedad
│   │   ├── reminders/page.tsx      # Gestión de recordatorios
│   │   ├── watering/page.tsx       # Calculadora de riego
│   │   ├── light/page.tsx          # Medidor de luz
│   │   └── jardinero/page.tsx      # Agente IA conversacional
│   └── api/
│       ├── identify/route.ts       # Vision API: identificar planta
│       ├── diagnose/route.ts       # Vision API: diagnosticar enfermedad
│       └── jardinero/route.ts      # Chat API con tools del agente
│
├── features/
│   ├── auth/
│   │   ├── components/             # LoginForm, SignupForm
│   │   ├── hooks/                  # useAuth
│   │   ├── services/               # authService (signIn, signUp, signOut)
│   │   └── types/                  # AuthUser
│   │
│   ├── garden-library/
│   │   ├── components/             # GardenGrid, PlantCard, AddPlantButton
│   │   ├── hooks/                  # usePlants
│   │   ├── services/               # plantsService (CRUD)
│   │   └── types/                  # Plant
│   │
│   ├── plant-profile/
│   │   ├── components/             # PlantHeader, CareHistory, PhotoTimeline
│   │   ├── hooks/                  # usePlantProfile
│   │   ├── services/               # plantProfileService
│   │   └── types/                  # PlantProfile, CareLog, PlantPhoto
│   │
│   ├── plant-identification/
│   │   ├── components/             # IdentifyForm, IdentificationResult
│   │   ├── hooks/                  # useIdentification
│   │   ├── services/               # identificationService
│   │   └── types/                  # IdentificationResult
│   │
│   ├── disease-diagnosis/
│   │   ├── components/             # DiagnoseForm, DiagnosisResult
│   │   ├── hooks/                  # useDiagnosis
│   │   ├── services/               # diagnosisService
│   │   └── types/                  # DiagnosisResult
│   │
│   ├── care-tracking/
│   │   ├── components/             # CareLogForm, CareLogList, QuickActions
│   │   ├── hooks/                  # useCareTracking
│   │   ├── services/               # careTrackingService
│   │   └── types/                  # CareLog, CareType
│   │
│   ├── reminders/
│   │   ├── components/             # ReminderList, ReminderForm, ReminderBadge
│   │   ├── hooks/                  # useReminders
│   │   ├── services/               # remindersService
│   │   └── types/                  # Reminder
│   │
│   ├── watering-calculator/
│   │   ├── components/             # WateringForm, WateringResult
│   │   ├── hooks/                  # useWateringCalculator
│   │   └── types/                  # WateringCalculation
│   │
│   ├── light-meter/
│   │   ├── components/             # LightMeterUI, LightRecommendation
│   │   ├── hooks/                  # useLightMeter
│   │   ├── services/               # lightMeterService
│   │   └── types/                  # LightReading
│   │
│   └── jardinero-agent/
│       ├── components/             # JardineroChat, JardineroMessage
│       ├── hooks/                  # useJardinero
│       ├── tools/                  # jardineroTools (updatePlant, addCareLog, etc.)
│       └── types/                  # JardineroMessage
│
└── shared/
    ├── components/
    │   ├── ui/                     # Componentes base shadcn/ui + glass preset
    │   ├── GlassCard.tsx           # Componente glass reutilizable
    │   ├── GlassButton.tsx
    │   └── PhotoUploader.tsx       # Input de fotos reutilizable
    ├── lib/
    │   ├── ai/openrouter.ts        # OpenRouter provider + MODELS
    │   └── glass.ts                # Preset de clases Liquid Glass
    └── types/
        └── supabase.ts             # Tipos generados de Supabase
```

### Modelo de Datos (Supabase)

```sql
-- Perfil de cada planta en el jardín del usuario
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,                          -- Nombre que el usuario le pone
  species TEXT,                                -- Nombre científico/común identificado
  acquired_at DATE,
  location TEXT,                               -- "sala", "terraza", "balcón"
  pot_size TEXT,                               -- "pequeño", "mediano", "grande"
  pot_substrate TEXT,                          -- "universal", "cactus", "orquídeas"
  watering_frequency_days INTEGER,             -- Frecuencia de riego en días
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
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,  -- Null si es diagnóstico sin agregar planta
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  diagnosis_result JSONB NOT NULL,   -- { disease, severity, symptoms, action_plan }
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
  lux_value INTEGER,                           -- Valor del sensor si disponible
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
  title TEXT,                                  -- Resumen auto-generado de la conversación
  messages JSONB NOT NULL DEFAULT '[]',        -- Array de UIMessage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE jardinero_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own conversations" ON jardinero_conversations FOR ALL USING (auth.uid() = user_id);

-- Storage bucket para fotos
-- Bucket: plant-photos (público con RLS en upload)
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo se definen FASES. Las subtareas se generan just-in-time al entrar a cada fase con el bucle agéntico.

### Fase 1: Fundaciones — Design System + Auth + Supabase
**Objetivo**: Base técnica completa sobre la que construir todo lo demás: design system Liquid Glass configurado, auth funcional (Email/Password), esquema de base de datos creado, Supabase Storage listo, y OpenRouter configurado.
**Validación**:
- Login y signup funcionan end-to-end con Supabase
- Tablas en Supabase creadas con RLS activo
- Componentes base Liquid Glass (GlassCard, GlassButton, PhotoUploader) disponibles en shared/
- `lib/ai/openrouter.ts` configurado con modelos de vision y chat
- `npm run typecheck` pasa sin errores

### Fase 2: Garden Library + Plant Profile
**Objetivo**: El núcleo de la app — el usuario puede ver todas sus plantas en una cuadrícula visual estilo Liquid Glass y acceder al perfil detallado de cada una con su historial.
**Validación**:
- Página `/plants` muestra cuadrícula de plantas con foto, nombre y próxima acción pendiente
- Página `/plants/[id]` muestra foto principal, datos de la planta, historial de cuidados y galería de fotos
- CRUD completo de plantas funciona (crear, ver, editar, borrar)
- Layout principal con sidebar de navegación Liquid Glass implementado

### Fase 3: Plant Identification (IA Vision)
**Objetivo**: El usuario puede fotografiar cualquier planta y recibir identificación automática con nombre, especie y cuidados básicos. Puede añadirla a su jardín con un click.
**Validación**:
- Página `/identify` permite subir foto o pegarla con Cmd+V
- API `/api/identify` llama a Gemini Vision con prompt de identificación y devuelve JSON estructurado
- Resultado muestra nombre común, nombre científico, cuidados básicos y nivel de confianza
- Botón "Añadir a mi jardín" crea la planta en Supabase y redirige a su perfil

### Fase 4: Care Tracking + Recordatorios
**Objetivo**: El usuario puede registrar acciones de cuidado (regar, abonar, podar) desde el perfil de cada planta, y configurar recordatorios automáticos por tipo de cuidado.
**Validación**:
- Botones de acción rápida (Regar, Abonar, Podar) en el perfil de planta crean entradas en `care_logs`
- Historial de cuidados visible en el perfil ordenado cronológicamente
- Página `/reminders` muestra recordatorios activos ordenados por urgencia (más próximos primero)
- Al registrar una acción, el recordatorio correspondiente se recalcula y pospone

### Fase 5: Disease Diagnosis (IA Vision)
**Objetivo**: El usuario puede fotografiar una planta enferma y recibir diagnóstico con identificación de la enfermedad, severidad y plan de acción concreto.
**Validación**:
- Página `/diagnose` permite subir foto con síntomas visibles
- API `/api/diagnose` devuelve JSON con: enfermedad, síntomas identificados, severidad (leve/moderado/grave) y plan de acción paso a paso
- Diagnóstico se guarda en `diagnoses` vinculado a la planta (si se indica cuál)
- Historial de diagnósticos visible en el perfil de cada planta

### Fase 6: Watering Calculator + Light Meter
**Objetivo**: Herramientas de soporte para decisiones de cuidado — calculadora de riego según la planta y el macetero, y medidor de luz con recomendación de ubicación.
**Validación**:
- Página `/watering`: usuario selecciona planta (o introduce especie + macetero) y recibe frecuencia de riego y cantidad de agua recomendada
- Página `/light`: usuario introduce nivel de luz medido (manual o lux si el dispositivo lo soporta) y recibe recomendación de ubicación óptima para su planta
- Ambas herramientas guardan sus resultados en Supabase (`light_readings`)

### Fase 7: El Jardinero — Agente IA con Tools
**Objetivo**: Agente conversacional que conoce el jardín del usuario y puede consultar y actualizar perfiles de plantas directamente, responder preguntas contextuales y dar consejos personalizados.
**Validación**:
- Página `/jardinero` con interfaz de chat Liquid Glass y streaming
- API `/api/jardinero` tiene tools funcionales: `getPlant`, `listPlants`, `updatePlant`, `addCareLog`, `getPlantHistory`
- El Jardinero puede responder: "¿Cuándo regué el ficus por última vez?" consultando `care_logs`
- El Jardinero puede ejecutar: "Registra que regué el monstera" creando entrada en `care_logs`
- Historial de conversaciones persistido en `jardinero_conversations`

### Fase 8: Polish + Integración Final
**Objetivo**: Integrar todas las features en un flujo coherente, aplicar consistencia visual Liquid Glass en todos los componentes, y validar que la app funciona end-to-end sin errores.
**Validación**:
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` exitoso
- [ ] `npm run lint` sin warnings críticos
- [ ] Playwright screenshot confirma UI Liquid Glass en todas las páginas principales
- [ ] Todos los criterios de éxito del PRP cumplidos
- [ ] Flujo completo: signup → añadir planta → identificar → diagnosticar → hablar con El Jardinero

---

## Aprendizajes (Self-Annealing)

> Esta sección crece con cada error encontrado durante la implementación.

*(Vacío — pendiente de implementación)*

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] **Liquid Glass requiere fondo con contenido visible** — el layout principal necesita el fondo de gradiente con orbs de color como base, sin él el blur no tiene efecto visible
- [ ] **backdrop-filter en Safari** — siempre incluir `-webkit-backdrop-filter` o usar el preset Tailwind `supports-[backdrop-filter]:`
- [ ] **Vercel AI SDK v5 breaking changes** — usar `inputSchema` (NO `parameters`), `stopWhen` (NO `maxSteps`), `sendMessage({ text })` (NO `handleSubmit`), `message.parts` (NO `message.content`)
- [ ] **Supabase Storage para fotos** — crear bucket `plant-photos` con política de upload autenticado; las URLs públicas necesitan que el bucket sea público
- [ ] **Vision con base64** — las fotos se envían como base64 a la API de identificación/diagnóstico, NO como URLs de Supabase, para evitar problemas de acceso del modelo
- [ ] **RLS en TODAS las tablas** — nunca crear una tabla sin habilitar RLS + policy de `user_id = auth.uid()`
- [ ] **Componente Image de Next.js** — usar `next/image` para fotos de plantas; las URLs de Supabase Storage necesitan estar en `next.config.js` como `remotePatterns`
- [ ] **Tipos de Supabase** — generar tipos con `mcp__supabase__generate_typescript_types` después de crear las migraciones
- [ ] **useImageUpload con Cmd+V** — el hook escucha `paste` en `document`; verificar que no hay conflictos con inputs de texto en la misma página

## Anti-Patrones

- NO crear hooks genéricos si cada feature tiene su propia lógica
- NO ignorar errores de TypeScript (usar `unknown` en vez de `any`)
- NO hardcodear species o care types como strings sueltos (usar constantes o enums Zod)
- NO omitir validación Zod en los schemas de request de las APIs de IA
- NO usar `any` en los tipos de respuesta de las APIs de visión — definir siempre el schema con Zod y `generateObject`
- NO saltarse el diseño Liquid Glass en ninguna página — todas las páginas deben seguir el mismo sistema visual
- NO enviar fotos grandes directamente — redimensionar antes de enviar a la API (max 1MB por imagen para evitar timeouts)

---

*PRP pendiente aprobación. No se ha modificado código.*
