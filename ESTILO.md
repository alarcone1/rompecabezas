# Guía de Estilo Visual - Rompecabezas

Este documento define el sistema de diseño visual implementado en la aplicación "Rompecabezas". El objetivo es mantener una estética moderna, fluida y consistente tanto en modo claro como en oscuro.

---

## 1. Tipografía

**Fuente Principal:** `Plus Jakarta Sans`
- Usada para toda la interfaz de usuario por su legibilidad y carácter geométrico moderno.
- **Pesos:**
  - `Regular (400)`: Texto de cuerpo.
  - `Medium (500)`: Botones y subtítulos.
  - `Bold (700)`: Títulos de tarjetas y énfasis.
  - `ExtraBold (800)`: Títulos principales (H1).

---

## 2. Paleta de Colores

### 🎨 Tema Claro (Light Mode)
Diseño vibrante y limpio, enfocado en la claridad.
- **Fondo Principal:** `#F5F3FF` (Violet 50)
- **Gradientes Header:** `Linear Gradient (Indigo-500 → Pink-500)`
- **Tarjetas:** Blanco `#FFFFFF` con sombra suave.
- **Accentos:** Indigo, Pink, Cyan.

### 🌑 Tema Oscuro (Dark Mode)
Diseño profundo y elegante ("Deep Slate"), optimizado para evitar fatiga visual.
- **Fondo Principal:** `#0F172A` (Slate 900)
- **Gradientes Header:** `Linear Gradient (Slate-900 → Slate-800)`
  - *Nota:* Se mantiene la estructura sutil para dar profundidad sin usar negros puros.
- **Tarjetas:** `#1E293B` (Slate 800) con transparencia (`bg-slate-800/70`) y efecto `backdrop-blur`.
- **Bordes Activos:** `Cyan-400` (Efecto Neón).

---

## 3. Sistema de Componentes

### Botones y Acciones
- **Primarios:** Gradiente Indigo a Pink. Sombra suave. Transformación sutil al hover (`scale-105`).
- **Secundarios (Modo Oscuro):** Bordes sutiles que se iluminan al pasar el mouse.
- **Hover Effect (Dark Mode):**
  - Al pasar el mouse sobre tarjetas interactivas o botones, el borde cambia a **Cyan Neón** (`border-cyan-400/80`), indicando interactividad inmediata.

### Tarjetas (Cards)
- **Estilo:** Glassmorphism (Vidrio esmerilado).
- **Implementación:** `bg-white/70` (Light) o `bg-slate-800/70` (Dark) con `backdrop-blur-lg`.
- **Bordes:** Finos y traslúcidos para definir límites sin ser invasivos.

### Iconografía
- **Librería:** Google Material Symbols Outlined.
- **Uso:** Iconos redondeados y amigables.
- **Estilos:** Rellenos con gradientes suaves o fondos circulares translúcidos.

---

## 4. Animaciones y Feedback

La interfaz reacciona a las acciones del usuario para sentirse "viva".

1.  **Micro-interacciones:**
    - Botones crecen ligeramente al hacer hover (`hover:scale-105`).
    - Iconos de navegación brillan o rebotan sutilmente.

2.  **Transiciones de Tema:**
    - Cambio suave de 300ms entre modo claro y oscuro (`transition-colors duration-300`).

3.  **Mecánicas de Juego:**
    - **Pieza Correcta:** Pulso verde brillante y efecto de "bloqueo" magnético.
    - **Victoria:** Explosión de confeti (sistema de partículas).

---

## 5. Implementación Técnica (Tailwind CSS)

El sistema se basa en clases de utilidad de Tailwind CSS con extensiones personalizadas en `css/styles.css`.

### Clases Clave
- **Gradiente Principal:** `.bg-gradient-to-b from-indigo-500 to-pink-500 dark:from-slate-900 dark:to-slate-800`
- **Tarjeta Interactiva:** `group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:hover:border-cyan-400/50 hover:border-indigo-300 border-2 border-transparent`
- **Texto con Gradiente:** `.text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600`

---

> **Nota de Diseño:** La filosofía es "Mobile First" pero con escalado elegante a escritorio, manteniendo los elementos centrados en un contenedor tipo "app nativa".
