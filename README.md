# Safamotor Ad Dashboard

Dashboard ejecutivo de Google Ads + Meta Ads para Grupo Safamotor.

## Despliegue en Vercel

### Opción 1: Desde GitHub (recomendada)

1. Sube esta carpeta a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com) e inicia sesión
3. Haz clic en "New Project"
4. Importa el repositorio de GitHub
5. Vercel detectará Next.js automáticamente
6. Pulsa "Deploy"

### Opción 2: Con Vercel CLI

```bash
npm install -g vercel
cd safamotor-dashboard
vercel
```

Sigue las instrucciones interactivas.

## Configuración

- **Google Sheet ID**: `1HEykheeAndB-RXqKy4wehTzrZNZvuQxpv3WuUwSsUuM`
- El Sheet debe ser público (o al menos accesible con enlace)
- Pestañas requeridas: `Meta Ads` y `Google Ads`

## Flujo de datos

- **Meta Ads** → n8n (cada 6h) → Google Sheets
- **Google Ads** → Google Ads Script (diario) → Google Sheets
- **Dashboard** → Lee Google Sheets vía CSV export → Muestra datos

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:3000
