# 🎨 Styling & Visual Effects

Hacking Vault features a distinct **Cyberpunk / Hacker** aesthetic, characterized by dark themes, neon accents (Cyan, Green, Magenta), and dynamic visual effects.

## Design System

*   **Colors**: Defined in `tailwind.config.ts` and `client/global.css` as CSS variables.
    *   `--primary`: Neon Green (Success/Active)
    *   `--secondary`: Cyan (Info/Tech)
    *   `--accent`: Magenta (Special/Warning)
    *   `--background`: Deep dark blue/black
*   **Typography**: `JetBrains Mono` and `Space Mono` for that terminal feel.

## 🌟 Neural Particles Background (`NeuralParticles.tsx`)

A custom Canvas-based component that renders a dynamic background.

*   **Concept**: "Cloud Chamber" / Radioactive Decay.
*   **Behavior**:
    *   Particles move independently with random, slow velocities.
    *   They leave fading trails (`history` array) to simulate movement paths.
    *   No connections between nodes (unlike the previous network mesh).
    *   **Performance**: Optimized by limiting particle count (~40) and using efficient Canvas API calls.

## 📺 Glitch Effects System

A robust, difficulty-scaled glitch system applied to machine images.

### Implementation
*   **CSS Animations**: Defined in `client/global.css`.
*   **Classes**:
    *   `.glitch-effect-easy`
    *   `.glitch-effect-medium`
    *   `.glitch-effect-hard`
    *   `.glitch-effect-insane`
*   **Scanline Overlay**: `.scanline-overlay` adds a permanent CRT-like texture.

### Difficulty Scaling
The intensity and behavior of the glitch scale with the machine's difficulty:

| Difficulty | Effect Description | Animation Name |
| :--- | :--- | :--- |
| **Easy** | Rare, subtle sparks. Mostly static. | `spark-easy` |
| **Medium** | Occasional jolts and hue shifts. | `spark-medium` |
| **Hard** | Frequent, visible distortion and RGB splitting. | `spark-hard` |
| **Insane** | Chaotic, rapid inversion and heavy noise artifacts. | `spark-insane` |

### "Bursty" Animation Logic
Unlike standard looping animations, these use keyframes to remain static for ~80-90% of the cycle and then "burst" with activity in the final frames, creating a more realistic "loose connection" feel.

```css
/* Example Keyframe Logic */
@keyframes spark-hard {
  0%, 80% { transform: translate(0); filter: none; } /* Static */
  81% { ... } /* Start Burst */
  92% { ... } /* End Burst */
  100% { transform: translate(0); } /* Reset */
}
```

## Tailwind Configuration

The project uses a custom Tailwind configuration to extend the theme with our specific colors and font families. See `tailwind.config.ts` for details.
