# 🚀 Deployment Guide

This guide explains how to deploy **Hacking Vault** for **$0** using free tier services.

## 1. Frontend Deployment (Netlify)

We recommend **Netlify** for hosting the frontend because it's free, fast, and integrates easily with GitHub.

### Steps:
1.  **Push your code to GitHub** (if you haven't already).
2.  Log in to [Netlify](https://app.netlify.com/).
3.  Click **"Add new site"** -> **"Import from existing project"**.
4.  Select **GitHub** and choose your `codigoVibrador` repository.
5.  **Build Settings**:
    *   **Base directory**: (Leave empty)
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
6.  **Environment Variables**:
    *   Click "Show advanced" or go to "Site settings" -> "Environment variables" after creation.
    *   Add the following keys (from your local `.env`):
        *   `VITE_SUPABASE_URL`
        *   `VITE_SUPABASE_ANON_KEY`
7.  Click **"Deploy site"**.

*Note: The project includes a `netlify.toml` file that handles routing redirects for Single Page Applications automatically.*

---

## 2. Database (Supabase)

You are already using Supabase. The **Free Tier** is sufficient for this project:
*   500MB Database
*   50MB File Storage
*   50,000 Monthly Active Users

**Action Required**:
*   Ensure your Supabase project is "Active".
*   If you plan to share this publicly, ensure your **Row Level Security (RLS)** policies are set up correctly to prevent unauthorized data modification.

---

## 3. Automated Data Sync (GitHub Actions)

To keep the machine list updated from HackTheBox without running a server, we use **GitHub Actions** (Free).

A workflow file has been created at `.github/workflows/sync-htb.yml`. It runs automatically every day at midnight UTC.

### Setup Secrets:
1.  Go to your GitHub Repository.
2.  Click **Settings** -> **Secrets and variables** -> **Actions**.
3.  Click **"New repository secret"** and add the following:

| Name | Value |
| :--- | :--- |
| `HTB_API_KEY` | Your HackTheBox API Token (Profile Settings -> Create App Token) |
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase **Service Role** Key (Project Settings -> API). *Note: Do NOT use the Anon key here, the script needs write access.* |

### Manual Trigger:
You can also run the sync manually:
1.  Go to the **Actions** tab in your repo.
2.  Select **"Sync HTB Machines"** on the left.
3.  Click **"Run workflow"**.

---

## Summary of Costs

| Service | Usage | Cost |
| :--- | :--- | :--- |
| **Netlify** | Frontend Hosting | **$0** (Free Tier) |
| **Supabase** | Database & Auth | **$0** (Free Tier) |
| **GitHub Actions** | Scheduled Scripts | **$0** (Free Tier) |
| **Total** | | **$0 / month** |
