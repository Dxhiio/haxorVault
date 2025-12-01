# 🔐 Security & Secrets Guide

This guide outlines the sensitive information used in Hacking Vault and how to handle it securely during development and deployment.

## 🚨 Critical Security Notice

**NEVER commit your `.env` file or any file containing real API keys to GitHub.**
If you suspect a key has been committed, **revoke and rotate it immediately**.

## 🔑 Required Secrets

The following environment variables are required for the application to function:

| Variable Name | Description | Where to find it | Usage |
| :--- | :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase Project URL | Supabase Dashboard -> Settings -> API | Frontend (Public) |
| `VITE_SUPABASE_ANON_KEY` | Supabase Anonymous Key | Supabase Dashboard -> Settings -> API | Frontend (Public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | Supabase Dashboard -> Settings -> API | **Backend Scripts ONLY** (Private) |
| `HTB_API_KEY` | HackTheBox App Token | HTB Profile -> Settings -> App Tokens | **Backend Scripts ONLY** (Private) |
| `DATABASE_URL` | PostgreSQL Connection String | Supabase Dashboard -> Settings -> Database | **Backend Scripts ONLY** (Private) |

## 🛠️ Local Development

1.  Create a file named `.env` in the root directory.
2.  Add the variables in the following format:

```env
# Frontend (Safe to expose in client bundle)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend / Scripts (NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
HTB_API_KEY=your-htb-token
DATABASE_URL=postgres://postgres:password@db.project.supabase.co:5432/postgres
```

The `.gitignore` file is configured to ignore `.env`, keeping it local-only.

## 🚀 Production Deployment

### 1. Frontend (Netlify / Vercel)
When deploying the frontend, you only need the **Public** variables.

*   **Go to:** Site Settings -> Environment Variables
*   **Add:**
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`

**⚠️ WARNING:** Do NOT add `SUPABASE_SERVICE_ROLE_KEY` or `HTB_API_KEY` to Netlify. These keys have administrative privileges and should never be accessible to the browser.

### 2. Backend / Automation (GitHub Actions)
For scripts that run in the background (like `sync-htb.js`), you need the **Private** variables.

*   **Go to:** GitHub Repo -> Settings -> Secrets and variables -> Actions
*   **Add:**
    *   `HTB_API_KEY`
    *   `VITE_SUPABASE_URL`
    *   `SUPABASE_SERVICE_ROLE_KEY`

## 🔄 Key Rotation (If Compromised)

If you accidentally committed a key to GitHub:

1.  **Supabase Keys:**
    *   Go to Supabase Dashboard -> Settings -> API.
    *   Click "Rotate secret" (this will generate new Anon and Service Role keys).
    *   Update your `.env` and deployment secrets with the new keys.

2.  **HackTheBox Token:**
    *   Go to your HTB Profile Settings.
    *   Revoke the existing App Token.
    *   Generate a new one.

3.  **Database Password:**
    *   Go to Supabase Dashboard -> Settings -> Database.
    *   Change the database password.
    *   Update `DATABASE_URL` in your secrets.
