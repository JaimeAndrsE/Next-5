# Setup Guía Completa - Image Gallery CRUD

## 1️⃣ SUPABASE SETUP (IMPORTANTE!)

### Paso 1: Crear Proyecto
1. Ve a [supabase.com](https://supabase.com)
2. Click en "New Project"
3. Elige nombre y región
4. Espera a que se cree (2-3 minutos)

### Paso 2: Crear Tabla
1. En Supabase, ve a **SQL Editor**
2. Haz click en **New Query**
3. Copia y ejecuta este SQL:

```sql
CREATE TABLE public.images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear índice para búsqueda rápida
CREATE INDEX idx_images_title ON public.images(title);

-- Alter table para permitir selects públicos
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
```

4. Click en **Run** (botón negro)
5. Espera a que se complete

### Paso 3: Configurar RLS (Row Level Security)
1. Ve a **Authentication** > **Policies** en Supabase
2. Busca la tabla `images`
3. Haz click en **New Policy** (o en la tabla si no hay)
4. Elige **Enable RLS for images**
5. Crea estas 4 políticas (presiona "+ New policy" cada vez):

**Política 1: SELECT (Leer)**
- Name: `Allow public read`
- Command: `SELECT`
- Using expression: `true`
- Click **Save**

**Política 2: INSERT (Crear)**
- Name: `Allow public insert`
- Command: `INSERT`
- With check: `true`
- Click **Save**

**Política 3: UPDATE (Editar)**
- Name: `Allow public update`
- Command: `UPDATE`
- Using: `true`
- With check: `true`
- Click **Save**

**Política 4: DELETE (Borrar)**
- Name: `Allow public delete`
- Command: `DELETE`
- Using: `true`
- Click **Save**

### Paso 4: Copiar Credenciales
1. Ve a **Settings** > **API**
2. Copia estos valores:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

## 2️⃣ VERCEL BLOB SETUP

### Paso 1: Crear Token
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu GitHub si no lo has hecho
3. Ve a **Settings** > **Storage** > **Blob**
4. Click en **Create** si no hay proyecto
5. Elige el proyecto y región
6. Click en **Create Token**
7. Copia el token → `VERCEL_BLOB_TOKEN` en `.env.local`

## 3️⃣ CONFIGURAR .env.local

Abre `.env.local` en el proyecto y completa:

```
NEXT_PUBLIC_SUPABASE_URL=https://[tu-url].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (copia tu key)
SUPABASE_SERVICE_KEY=eyJhbGc... (copia tu key)
VERCEL_BLOB_TOKEN=vercel_blob_rw_... (copia tu token)
```

**IMPORTANTE:** No compartas estos valores en GitHub

## 4️⃣ PROBAR LOCALMENTE

```bash
npm run dev
```

Abre http://localhost:3000

Prueba:
- ✅ Crear imagen
- ✅ Buscar por título
- ✅ Editar imagen
- ✅ Eliminar imagen

## 5️⃣ DEPLOY A VERCEL

### Opción A: Deploy Manual
```bash
git add .
git commit -m "Add image gallery app"
git push origin main
```

Luego en [vercel.com](https://vercel.com):
1. Click **Add New** > **Project**
2. Importa tu repositorio de GitHub
3. En **Environment Variables**, agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `VERCEL_BLOB_TOKEN`
4. Click **Deploy**

### Opción B: Deploy con Vercel CLI
```bash
npm i -g vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY
vercel env add VERCEL_BLOB_TOKEN
vercel --prod
```

## Solucionar Problemas

### Error: "Failed to save image"
- [ ] Verifica que la tabla `images` existe en Supabase
- [ ] Verifica las RLS policies están configuradas
- [ ] Verifica `.env.local` tiene los valores correctos
- [ ] Abre browser DevTools (F12) > Console para ver error exacto

### Error: "Failed to upload blob"
- [ ] Verifica `VERCEL_BLOB_TOKEN` es correcto
- [ ] La imagen no excede 25MB

### Error: "Supabase URL invalid"
- [ ] Verifica `NEXT_PUBLIC_SUPABASE_URL` empieza con `https://`
- [ ] Verifica la URL es correcta sin caracteres adicionales

## Características Implementadas ✨

- ✅ Crear imágenes con upload
- ✅ Editar título, descripción e imagen
- ✅ Eliminar imágenes
- ✅ Búsqueda por título en tiempo real
- ✅ Grid responsivo (4 columnas en desktop)
- ✅ Modal dinámico para forms
- ✅ Animaciones suaves
- ✅ Toast notifications
- ✅ Diseño moderno tipo SaaS
- ✅ Íconos Lucide React
- ✅ Almacenamiento en Vercel Blob
- ✅ Base de datos en Supabase PostgreSQL

## Stack Tecnológico

- **Frontend:** Next.js 16.2.6, React 19, TypeScript
- **UI:** Tailwind CSS 4.3, Lucide Icons
- **Animaciones:** Framer Motion
- **Notificaciones:** React Hot Toast
- **Base de datos:** Supabase (PostgreSQL)
- **Storage:** Vercel Blob
- **Deploy:** Vercel

