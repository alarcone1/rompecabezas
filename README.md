# Rompecabezas PWA 🧩

Una aplicación web moderna de rompecabezas, optimizada como Progressive Web App (PWA) con soporte para temas (Claro/Oscuro), generación de imágenes con IA y una experiencia de usuario premium.

## ✨ Características Principales

- **🎮 Jugabilidad Clásica y Moderna**:
  - Dificultades adaptables: 3x3, 4x4, 5x5.
  - Sistema de puntuación y rankings locales.
  - Efectos visuales de victoria (confeti) y feedback háptico.

- **📱 Experiencia PWA**:
  - Instalable en escritorio y móviles.
  - Funciona totalmente Offline.
  - Diseño responsivo "Mobile First".

- **🎨 Diseño Premium**:
  - **Tema Oscuro (Dark Mode)**: Interfaz "Deep Slate" con acentos neón para reducir fatiga visual.
  - **Glassmorphism**: Tarjetas y paneles con efectos de desenfoque.
  - **Animaciones fluidas**: Transiciones suaves en toda la interfaz.

- **🤖 IA Generativa**:
  - Crea rompecabezas únicos generando imágenes mediante Inteligencia Artificial (Pollinations API).
  - O usa tus propias fotos desde la galería.

## 🛠️ Tecnologías

- **HTML5 Semantic**: Estructura accesible.
- **Tailwind CSS**: Estilizado moderno y sistema de temas.
- **JavaScript (Vanilla)**: Lógica optimizada sin dependencias pesadas.
- **Service Workers**: Para capacidades Offline y caché.

## 🚀 Instalación y Uso

1. **Online**:
   Puedes desplegar este proyecto en cualquier host de sitios estáticos (Vercel, Netlify, GitHub Pages).

2. **Local**:
   ```bash
   git clone https://github.com/alarcone1/rompecabezas.git
   cd rompecabezas
   # Usar cualquier servidor estático, por ejemplo con Python:
   python3 -m http.server
   # O con Node.js:
   npx serve .
   ```

## 📂 Estructura del Proyecto

- `index.html`: Pantalla de inicio.
- `puzzle.html`: Tablero principal de juego.
- `ranking.html`: Tabla de posiciones.
- `setting.html`: Configuración de usuario.
- `welcome.html`: Selección de imagen (Galería / IA).
- `css/`: Estilos personalizados y configuraciones de Tailwind.
- `js/`: Lógica del juego modularizada (`main.js`, `puzzle.js`, `settings.js`).
- `sw.js`: Service Worker para PWA.

## 📖 Documentación de Diseño

Para más detalles sobre el sistema de diseño, colores y componentes, consulta la [Guía de Estilo](ESTILO.md).

---
Desarrollado con ❤️ por Edgar Alarcón.
