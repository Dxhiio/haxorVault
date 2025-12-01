# Plan de Integración de Máquinas HTB

Este documento detalla el plan para crear una nueva tabla de base de datos e integrar los datos de las máquinas de Hack The Box (activas y retiradas), con actualización automática cada sábado.

## 1. Esquema de Base de Datos

Se creará una nueva tabla llamada `htb_machines` en Supabase para almacenar la información de las máquinas.

### SQL de Creación

```sql
create table if not exists public.htb_machines (
  id integer primary key,
  name text not null,
  os text,
  ip text,
  avatar text,
  points integer,
  difficulty_text text,
  status text check (status in ('active', 'retired')),
  release_date date,
  user_owns_count integer,
  root_owns_count integer,
  free boolean,
  stars real,
  last_updated timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS (Row Level Security) si es necesario
alter table public.htb_machines enable row level security;

-- Política de lectura pública (ajustar según necesidad)
create policy "Public machines are viewable by everyone"
  on public.htb_machines for select
  using ( true );
```

## 2. Script de Integración

Se utilizará un script en Node.js para interactuar con la API v4 de HTB.

### Flujo del Script
1.  **Autenticación**: Usar el `HTB_API_KEY` definido en las variables de entorno.
2.  **Obtención de Máquinas Activas**:
    *   Endpoint: `https://labs.hackthebox.com/api/v4/machine/paginated`
    *   Iterar por todas las páginas.
    *   Marcar estado como `active`.
3.  **Obtención de Máquinas Retiradas**:
    *   Endpoint: `https://labs.hackthebox.com/api/v4/machine/retired`
    *   Iterar por todas las páginas.
    *   Marcar estado como `retired`.
4.  **Detalles Adicionales**:
    *   Para cada máquina, consultar `https://labs.hackthebox.com/api/v4/machine/profile/{id}` para obtener detalles como la IP (si no viene en el listado) y otros metadatos.
5.  **Upsert en Base de Datos**:
    *   Insertar o actualizar los registros en la tabla `htb_machines` usando el cliente de Supabase.

### Ubicación del Script
El script se ubicará en `scripts/sync-htb.js`.

## 3. Automatización (Cron Job)

Para ejecutar la actualización automáticamente cada sábado, utilizaremos **GitHub Actions**.

### Workflow de GitHub Actions
Archivo: `.github/workflows/htb-sync.yml`

```yaml
name: HTB Machines Sync

on:
  schedule:
    # Ejecutar a las 00:00 cada sábado
    - cron: '0 0 * * 6'
  workflow_dispatch: # Permite ejecución manual

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run Sync Script
        run: node scripts/sync-htb.js
        env:
          HTB_API_KEY: ${{ secrets.HTB_API_KEY }}
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          # O usar la SERVICE_ROLE_KEY si es necesario para escrituras sin RLS
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

## 4. Pasos de Implementación

1.  **Crear la tabla**: Ejecutar el SQL en el editor SQL de Supabase.
2.  **Crear el script**: Implementar `scripts/sync-htb.js`.
3.  **Configurar Secretos**: Añadir `HTB_API_KEY` y credenciales de Supabase a los secretos del repositorio en GitHub.
4.  **Configurar Workflow**: Crear el archivo `.github/workflows/htb-sync.yml`.
