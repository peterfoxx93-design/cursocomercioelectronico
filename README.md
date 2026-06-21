# Quórum Comercio Electrónico

Aplicación web para recopilar el interés de estudiantes en abrir una sección del curso **Comercio Electrónico** con el profesor **Randy Bautista** en **INFOTEP**, República Dominicana.

> **Importante:** Esta no es una inscripción oficial. Es una lista de preinscripción para reunir el quórum de 30 estudiantes.

## Stack

- **Next.js 15+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL)
- **iron-session** (autenticación admin)
- **Zod** (validación)

## Requisitos previos

- [Node.js](https://nodejs.org/) 18.17 o superior
- Cuenta en [Supabase](https://supabase.com) (plan gratuito)
- Cuenta en [GitHub](https://github.com) y [Vercel](https://vercel.com) para despliegue

---

## 1. Configurar Supabase

### Crear proyecto

1. Ve a [supabase.com/dashboard](https://supabase.com/dashboard) e inicia sesión.
2. Clic en **New Project**.
3. Elige un nombre (ej. `quorum-comercio`), contraseña de base de datos y región cercana.
4. Espera a que el proyecto termine de crearse.

### Crear la tabla

1. En el panel de Supabase, ve a **SQL Editor**.
2. Clic en **New query**.
3. Copia y pega el contenido de [`supabase/schema.sql`](supabase/schema.sql).
4. Clic en **Run**.

### Obtener las claves

1. Ve a **Project Settings** → **API**.
2. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ La `service_role` key nunca debe exponerse en el frontend. Solo se usa en el servidor.

### Datos de prueba (opcional, solo desarrollo)

En el SQL Editor, ejecuta el contenido de [`supabase/seed.sql`](supabase/seed.sql) para cargar 8 registros ficticios.

---

## 2. Configurar el proyecto local

### Clonar / instalar

```bash
git clone https://github.com/TU-USUARIO/quorum-comercio-electronico.git
cd quorum-comercio-electronico
npm install
```

### Variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu-contraseña-segura
SESSION_SECRET=genera-un-secreto-aleatorio-de-al-menos-32-caracteres
QUORUM_TARGET=30
```

**Generar SESSION_SECRET** (PowerShell):

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
```

**Generar SESSION_SECRET** (macOS/Linux):

```bash
openssl rand -base64 32
```

### Correr en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para la landing.

Panel admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 3. Subir a GitHub

```bash
git init
git add .
git commit -m "feat: MVP Quórum Comercio Electrónico"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/quorum-comercio-electronico.git
git push -u origin main
```

---

## 4. Desplegar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new).
2. Importa el repositorio de GitHub.
3. En **Environment Variables**, agrega todas las variables de `.env.local`:

   | Variable | Valor |
   |----------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL de Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service role key |
   | `ADMIN_USERNAME` | Usuario admin |
   | `ADMIN_PASSWORD` | Contraseña admin |
   | `SESSION_SECRET` | Secreto de 32+ caracteres |
   | `QUORUM_TARGET` | `30` |

4. Clic en **Deploy**.
5. Tu app estará disponible en `https://tu-proyecto.vercel.app`.

---

## Funcionalidades

### Estudiante (landing pública)

- Información del curso, profesor e institución
- Contador de progreso del quórum (X de 30)
- Barra de progreso visual
- Formulario: nombre, email, teléfono, compromiso obligatorio
- Validación de duplicados por email y teléfono
- Mensaje de confirmación al registrarse

### Administrador (`/admin`)

- Login con usuario y contraseña
- Dashboard con métricas del quórum
- Tabla de inscritos con búsqueda
- Exportar a CSV
- Eliminar registros de prueba o duplicados

---

## Estructura del proyecto

```
app/
  page.tsx              # Landing pública
  admin/                # Panel administrativo
  api/                  # API routes (register, stats, admin)
components/             # Componentes React
lib/                    # Supabase, sesión, validación, auth
supabase/               # Schema SQL y seed
middleware.ts           # Protección de rutas admin
```

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linter ESLint |

---

## Seguridad (MVP)

- Credenciales admin solo en variables de entorno del servidor
- Sesión admin en cookie httpOnly encriptada (iron-session)
- Rutas `/admin` protegidas por middleware
- Service role key de Supabase nunca expuesta al cliente
- Validación server-side con Zod en todos los endpoints

---

## Licencia

Proyecto educativo para INFOTEP — uso interno del organizador del curso.
