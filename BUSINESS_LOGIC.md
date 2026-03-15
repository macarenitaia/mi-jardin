# BUSINESS_LOGIC.md - Mi Jardín

> Generado por SaaS Factory | Fecha: 2026-03-15

## 1. Problema de Negocio

**Dolor:** Las personas que cuidan su jardín en casa pierden plantas y tiempo porque no tienen información precisa sobre cada planta: qué enfermedad tiene, cuánta agua necesita, si le da suficiente luz, qué bichos la afectan, cuándo podarla.

**Costo actual:**
- Plantas muertas por falta de información o diagnóstico tardío
- Mucho tiempo buscando respuestas en Google y YouTube
- Frustración al no saber qué hacer cuando una planta se ve mal

---

## 2. Solución

**Propuesta de valor:** Una app de gestión inteligente de jardín que identifica plantas por foto, lleva el historial completo de cada una, diagnostica enfermedades, y tiene un asistente IA llamado "El Jardinero" que da consejos y actualiza los perfiles directamente.

**Flujo principal (Happy Path):**
1. Abre la app y ve su jardín completo (biblioteca de plantas)
2. Selecciona una planta para ver qué necesita hoy
3. Registra acciones: regada, abono, poda, o saca foto para actualizar estado
4. Si tiene una planta nueva → foto → la app la identifica y la agrega automáticamente a la biblioteca
5. También puede identificar plantas desconocidas "por la calle" sin necesidad de añadirlas
6. Recibe recordatorios de riego, abono o poda según la planta
7. Si ve la planta mal → foto → diagnóstico de enfermedad con plan de acción
8. Habla con "El Jardinero" (agente IA) para pedir consejo; el Jardinero puede actualizar los perfiles directamente

---

## 3. Usuario Objetivo

**Rol:** Persona con experiencia en jardinería doméstica que gestiona un jardín en casa (macetas, exterior o interior)
**Perfil:** Mujer de ~36 años, cómoda con el móvil, con bastante experiencia con plantas
**Multi-usuario:** La pareja también puede usar la app y contribuir al cuidado del jardín

---

## 4. Arquitectura de Datos

**Input:**
- Fotos de plantas (identificación, diagnóstico, evolución)
- Acciones manuales: riego, abono/fertilizante, poda, notas
- Datos del macetero (tamaño, tipo de sustrato)
- Medición de luz (sensor del dispositivo o entrada manual)
- Conversaciones con El Jardinero

**Output:**
- Perfil completo de cada planta con historial de cuidados
- Evolución fotográfica ordenada cronológicamente
- Recordatorios y alertas de cuidado
- Diagnóstico de enfermedades con plan de acción
- Plan de cuidados personalizado por planta
- Cálculo de riego (frecuencia y cantidad según planta y macetero)
- Recomendación de ubicación según luz medida

**Storage (Supabase tables sugeridas):**
- `plants`: Perfil de cada planta (nombre, especie, fecha de adquisición, macetero, ubicación, foto principal)
- `plant_photos`: Historial fotográfico por planta con fecha y notas
- `care_logs`: Registro de acciones (riego, abono, poda) con fecha y usuario
- `diagnoses`: Diagnósticos realizados por IA con foto, resultado y plan de acción
- `reminders`: Recordatorios configurados por planta y tipo de cuidado
- `light_readings`: Mediciones de luz por planta con recomendación
- `jardinero_conversations`: Historial de conversaciones con el agente IA

---

## 5. KPI de Éxito

**Métrica principal:** Todas las plantas del jardín tienen su perfil completo en la app y no se pierde ninguna información de su historial de cuidados.

---

## 6. Especificación Técnica (Para el Agente)

### Features a Implementar (Feature-First)

```
src/features/
├── auth/                  # Autenticación Email/Password (Supabase)
├── garden-library/        # Biblioteca del jardín: listado y gestión de plantas
├── plant-profile/         # Perfil individual: historial, fotos, cuidados
├── plant-identification/  # Identificación de plantas por foto (IA Vision)
├── disease-diagnosis/     # Diagnóstico de enfermedades por foto (IA Vision)
├── care-tracking/         # Registro de riegos, abono, poda
├── reminders/             # Recordatorios y alertas de cuidado
├── watering-calculator/   # Calculadora de riego según planta y macetero
├── light-meter/           # Medidor de luz con recomendación de ubicación
└── jardinero-agent/       # Agente IA conversacional que puede actualizar perfiles
```

### Stack Confirmado

- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind 3.4 + shadcn/ui
- **Backend:** Supabase (Auth + Database + Storage para fotos)
- **IA:** Vercel AI SDK v5 + OpenRouter (Vision para identificación y diagnóstico, Chat para El Jardinero)
- **Validación:** Zod
- **State:** Zustand
- **MCPs:** Next.js DevTools + Playwright + Supabase

### Próximos Pasos

1. [ ] Setup proyecto base (Next.js 16 + Tailwind + shadcn)
2. [ ] Configurar Supabase (tablas + Storage para fotos + RLS)
3. [ ] Implementar Auth (Email/Password)
4. [ ] Feature: garden-library (biblioteca del jardín)
5. [ ] Feature: plant-profile (perfil e historial de cada planta)
6. [ ] Feature: plant-identification (identificar por foto con IA)
7. [ ] Feature: care-tracking (registrar riegos, abono, poda)
8. [ ] Feature: disease-diagnosis (diagnosticar enfermedades por foto)
9. [ ] Feature: reminders (recordatorios de cuidado)
10. [ ] Feature: watering-calculator (calculadora de riego)
11. [ ] Feature: light-meter (medidor de luz)
12. [ ] Feature: jardinero-agent (agente IA conversacional)
13. [ ] Testing E2E con Playwright
14. [ ] Deploy Vercel
