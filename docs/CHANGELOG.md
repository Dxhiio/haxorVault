# 📝 Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-12-01

### ✨ Added
*   **New Glitch System**: Implemented a difficulty-scaled glitch effect for machine images.
    *   Added `spark-easy`, `spark-medium`, `spark-hard`, and `spark-insane` animations.
    *   Added `.scanline-overlay` for CRT texture.
*   **Neural Particles Overhaul**:
    *   Replaced network mesh with "Cloud Chamber" effect.
    *   Particles now move independently with fading trails.
    *   Optimized performance by reducing particle count.
*   **Documentation**: Added comprehensive project documentation in `docs/`.

### 🎨 Changed
*   **Visual Style**: Shifted towards a darker, more "radioactive" cyberpunk aesthetic.
*   **Machine Cards**: Updated hover effects to trigger difficulty-specific glitches.
*   **Global CSS**: Refactored animation keyframes for better performance and "bursty" behavior.

### 🐛 Fixed
*   Fixed syntax errors in `Machines.tsx` and `Index.tsx` related to JSX rendering.
*   Resolved linting issues in `NeuralParticles.tsx`.

---

## [Initial Release]
*   Basic project setup with Vite + React.
*   Supabase integration for authentication and database.
*   HackTheBox API sync scripts.
*   Basic machine listing and search functionality.
