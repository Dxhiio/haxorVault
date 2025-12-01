# Código Vibrador - Documentación Completa

## Descripción General

Este es un proyecto full-stack de aplicación web construida con React 18, TypeScript, Vite y Express. El sistema está diseñado como una plataforma de entrenamiento para hacking ético con funcionalidades de gamificación.

## Estructura del Proyecto

```
.
├── client/                   # Frontend React SPA
│   ├── pages/                # Componentes de rutas (Index.tsx = home)
│   ├── components/ui/        # Biblioteca de componentes UI preconstruidos
│   ├── App.tsx               # Punto de entrada de la aplicación y configuración de routing
│   └── global.css            # Temas y estilos globales de TailwindCSS 3
├── server/                   # Backend Express API
│   ├── index.ts              # Configuración principal del servidor (express + rutas)
│   └── routes/               # Manejadores de API
├── shared/                   # Tipos compartidos entre cliente y servidor
│   └── api.ts                # Interfaces compartidas para la API
├── package.json              # Dependencias y scripts de desarrollo
└── AGENTS.md                 # Documentación del template Fusion Starter
```

## Tecnologías Utilizadas

- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrado con Vite dev server
- **Herramientas**: Vitest para testing, Zod para validación
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Comandos de Desarrollo

```bash
pnpm dev        # Iniciar servidor de desarrollo (frontend + backend)
pnpm build      # Compilación para producción
pnpm start      # Iniciar servidor de producción
pnpm typecheck  # Validación de TypeScript
pnpm test       # Ejecutar pruebas con Vitest
```

## Sistema de Routing

### Frontend (React Router 6)

- `client/pages/Index.tsx` representa la página de inicio
- Las rutas se definen en `client/App.tsx`
- Los archivos de rutas están ubicados en `client/pages/`

Ejemplo de definición de rutas:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* AÑADIR TODAS LAS RUTAS PERSONALIZADAS ANTES DE LA RUTA CATCH-ALL "*" */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

## Sistema de Estilos

### Principales

- **Utilidad**: Clases de TailwindCSS 3
- **Temas y tokens de diseño**: Configurar en `client/global.css`
- **Componentes UI**: Biblioteca preconstruida en `client/components/ui/`
- **Función utilitaria**: `cn()` combina `clsx` + `tailwind-merge` para clases condicionales

Uso de la función `cn()`:

```typescript
// Ejemplo de uso de cn()
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // Sobrescritura del usuario
)}
```

## Integración del Servidor Express

### Desarrollo

- Puerto único (8080) para frontend/backend
- Recarga caliente (hot reload) para código del cliente y servidor
- Endpoints de API prefijados con `/api/`

### Ejemplos de Rutas API

- `GET /api/ping` - API de ping simple
- `GET /api/demo` - Endpoint de demostración

## Tipos Compartidos

Importar tipos consistentes en cliente y servidor:

```typescript
import { DemoResponse } from "@shared/api";
```

Alias de rutas:

- `@shared/*` - Carpeta compartida
- `@/*` - Carpeta del cliente

## Cómo Editar el Proyecto

### 1. Agregar Nuevas Páginas

1. Crear componente en `client/pages/MyPage.tsx`
2. Añadir ruta en `client/App.tsx`:

```typescript
<Route path="/my-page" element={<MyPage />} />
```

### 2. Agregar Nuevas Rutas API

1. **Opcional**: Crear interfaz compartida en `shared/api.ts`:

```typescript
export interface MyRouteResponse {
  message: string;
  // Añadir otras propiedades de respuesta aquí
}
```

2. Crear manejador de ruta en `server/routes/my-route.ts`:

```typescript
import { RequestHandler } from "express";
import { MyRouteResponse } from "@shared/api"; // Opcional: para seguridad de tipos

export const handleMyRoute: RequestHandler = (req, res) => {
  const response: MyRouteResponse = {
    message: "¡Hola desde mi endpoint!",
  };
  res.json(response);
};
```

3. Registrar la ruta en `server/index.ts`:

```typescript
import { handleMyRoute } from "./routes/my-route";

// Añadir a la función createServer:
app.get("/api/my-endpoint", handleMyRoute);
```

4. Usar en componentes React con seguridad de tipos:

```typescript
import { MyRouteResponse } from "@shared/api"; // Opcional: para seguridad de tipos

const response = await fetch("/api/my-endpoint");
const data: MyRouteResponse = await response.json();
```

### 3. Agregar Nuevos Colores al Tema

Abrir `client/global.css` y `tailwind.config.ts` y añadir nuevos colores de Tailwind.

### 4. Editar el Grid de Máquinas

El grid donde se muestran las máquinas está definido en el archivo `client/pages/Index.tsx`. Este grid se encuentra en la sección "Results" y utiliza una estructura de React con:

- Datos de máquinas en el array `MACHINES` (líneas 35-64) - **NOTA: ESTOS DATOS SON HARDCODEADOS**
- Filtros aplicados a las máquinas mediante `filteredMachines` (líneas 72-81)
- Renderizado del grid usando `grid md:grid-cols-2 gap-4` (línea 150)

Para modificar el grid:

1. Para cambiar el número de columnas, modificar la clase `grid md:grid-cols-2` en la línea 150
2. Para modificar el contenido de las máquinas, editar el array `MACHINES` (líneas 35-64)
3. Para agregar nuevas propiedades a las máquinas, actualizar tanto el array `MACHINES` como el código de renderizado en el map (líneas 151-163)

**NOTA IMPORTANTE: Los datos actuales del grid están hardcoded en el archivo Index.tsx. El proyecto tiene configuración de Supabase y una prueba de conexión existe (test-supabase.mjs), pero actualmente el componente no está utilizando datos de la base de datos, sino los datos fijos definidos en el array `MACHINES`.**

Para conectarlo con la base de datos:

1. Reemplazar el array `MACHINES` con una llamada a Supabase:

   ```typescript
   const [machines, setMachines] = useState<(typeof MACHINES)[0][]>([]);

   useEffect(() => {
     const fetchMachines = async () => {
       const { data, error } = await supabase.from("machines").select("*");
       if (error) {
         console.error("Error fetching machines:", error);
       } else {
         setMachines(data);
       }
     };

     fetchMachines();
   }, []);
   ```

2. Usar `machines` en lugar de `MACHINES` para el renderizado

## Archivos Clave para Modificar

- `client/App.tsx`: Configuración principal del routing
- `client/pages/Index.tsx`: Página principal con la interfaz principal de la aplicación
- `server/index.ts`: Configuración del servidor y rutas API
- `shared/api.ts`: Interfaces TypeScript compartidas

## Características Principales

- **Sistema de Routing SPA**: Utiliza React Router 6 para navegación sin recargas
- **Sistema de Estilos**: Base en TailwindCSS 3 con componentes preconstruidos
- **Integración Backend**: Servidor Express integrado con Vite para desarrollo
- **Gamificación**: Sistema de progreso, puntos y badges
- **Roadmaps por Certificación**: Caminos estructurados para CEH, OSCP y más
- **Notas con Timestamp**: Funcionalidad para guardar apuntes durante prácticas
- **Calendario de Progreso**: Visualización de consistencia y racha de entrenamiento

## Consideraciones de Implementación

### Para Nuevas Rutas API

Solo crear endpoints cuando sea estrictamente necesario, por ejemplo:

- Para encapsular lógica que debe permanecer en el servidor
- Manejo de claves privadas
- Operaciones específicas de base de datos

### Estructura de la Aplicación

- El proyecto sigue un patrón de diseño modular
- La separación entre cliente, servidor y código compartido permite mantenimiento eficiente
- El uso de TypeScript proporciona seguridad de tipos en toda la aplicación

## Despliegue en Producción

- **Estándar**: `pnpm build`
- **Binario**: Ejecutables autocontenidos (Linux, macOS, Windows)
- **Despliegue en la Nube**: Utilizar Netlify o Vercel a través de sus integraciones MCP para despliegue fácil. Ambos proveedores funcionan bien con esta plantilla.
