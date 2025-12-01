# 🧩 Component Library

This document outlines the key UI components used in Hacking Vault.

## Core Components

### `Layout`
*   **Path**: `client/components/Layout.tsx`
*   **Purpose**: Wraps pages with the common `Navbar`, `Footer`, and the `NeuralParticles` background.
*   **Usage**: Should wrap the content of every top-level page.

### `NeuralParticles`
*   **Path**: `client/components/NeuralParticles.tsx`
*   **Purpose**: Renders the animated background effect.
*   **Props**: None (Configured internally).

## Machine Components

### `MachineCard` (Implicit in Pages)
*   **Location**: Currently implemented directly within `Machines.tsx` and `Index.tsx` loops.
*   **Features**:
    *   Displays machine avatar, name, difficulty, and points.
    *   Applies dynamic **Glitch Effects** based on difficulty.
    *   Handles "Active" vs "Retired" status styling.
    *   Interactive hover states (glow, border color).

## Modals

### `LoginModal`
*   **Path**: `client/components/LoginModal.tsx`
*   **Purpose**: Handles user authentication (Login/Register).
*   **State**: Controlled via `isOpen` prop.

### `MachineDetailsModal`
*   **Path**: `client/components/MachineDetailsModal.tsx`
*   **Purpose**: Displays detailed information about a specific machine when clicked.
*   **Props**: `machine` (The selected machine object), `isOpen`, `onClose`.

## UI Primitives (`client/components/ui/`)
Reusable low-level components based on Shadcn UI / Radix UI.
*   `Button`: Custom styled buttons with variants (default, outline, ghost).
*   `Input`: Styled form inputs.
*   `Card`: Container component.
