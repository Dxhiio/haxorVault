# 🚀 Getting Started

This guide will help you set up the **Hacking Vault** project locally on your machine.

## Prerequisites

Ensure you have the following installed:
*   **Node.js** (v18 or higher recommended)
*   **npm** or **pnpm**
*   **Git**

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd codigoVibrador
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

## Environment Setup

1.  Create a `.env` file in the root directory (copy from `.env.example` if available).
2.  Configure the following variables (example):

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    # Add other relevant keys here
    ```

## Running the Application

### Development Mode
To start the development server with hot-reload:

```bash
npm run dev
```
The app will be available at `http://localhost:5173` (or the port shown in your terminal).

### Production Build
To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Scripts

*   `npm run dev`: Starts the Vite dev server.
*   `npm run build`: Builds the project for production.
*   `npm run lint`: Runs ESLint to check for code quality issues.
*   `npm run preview`: Previews the built app.
