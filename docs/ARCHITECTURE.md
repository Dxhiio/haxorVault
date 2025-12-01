# 🏗️ Architecture & Tech Stack

## Technology Stack

*   **Frontend Framework**: [React](https://react.dev/) (v18)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL)

## Project Structure

```
e:\HackingVault\dev\codigoVibrador\
├── client/                 # Frontend source code
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Shadcn/Generic UI elements
│   │   └── ...             # Feature-specific components (e.g., NeuralParticles)
│   ├── pages/              # Route components (Index, Machines, etc.)
│   ├── hooks/              # Custom React hooks (useMachines, useAuth)
│   ├── context/            # Global state context providers
│   ├── constants/          # Config constants (UI config, API endpoints)
│   └── global.css          # Global styles & Tailwind directives
├── server/                 # Backend logic (if applicable)
├── scripts/                # Utility scripts (HTB sync, testing)
├── supabase/               # Supabase configuration & migrations
├── public/                 # Static assets
└── docs/                   # Project documentation
```

## Key Concepts

### Data Flow
1.  **Supabase Client**: Initialized in `client/lib/supabase.ts` (or similar).
2.  **Hooks**: Custom hooks like `useMachines` fetch data from Supabase and manage loading/error states.
3.  **Components**: UI components consume data via props or Context.

### Authentication
Authentication is handled via Supabase Auth. The `AuthContext` provides the current user state (`isAuthenticated`, `user`) to the rest of the app.

### Integration with HackTheBox
Scripts in the `scripts/` folder (e.g., `htb-sync.mjs`) are used to synchronize machine data from the HackTheBox API to the local Supabase database.
