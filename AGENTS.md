# AGENTS.md - Proyecto Rompecabezas

## Project overview

Este es un juego de rompecabezas web interactivo diseñado para programadores principiantes. Permite a los usuarios resolver puzzles digitales con diferentes niveles de dificultad (3x3, 4x4, 5x5). El juego incluye funcionalidades como contador de movimientos, temporizador, sistema de ranking por dificultad y detección automática de piezas correctas.

## Build and test commands

- Abrir el proyecto: Abrir `index.html` en un navegador web
- Iniciar servidor local: `npx live-server`
- Ver juego principal: Navegar a `puzzle.html`
- Ver configuraciones: Navegar a `setting.html`
- Ver rankings: Navegar a `ranking.html`

## Code style guidelines

- **HTML**: Usar elementos semánticos y clases descriptivas
- **CSS**: Utilizar clases de TailwindCSS para estilos principales
- **JavaScript**: 
  - Usar camelCase para variables y funciones
  - Documentar funciones con comentarios descriptivos
  - Separar lógica en archivos específicos (puzzle.js, ranking.js, etc.)
- **Nomenclatura de clases CSS personalizadas**:
  - Usar kebab-case para clases personalizadas
  - Prefijos funcionales: `.puzzle-piece`, `.pieza-fija`, etc.
  - Sufijos de estado: `.articulada-right`, `.articulada-bottom`

## Tech Stack and Key Libraries

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **CSS Framework**: TailwindCSS (vía CDN)
- **Fuentes**: Google Fonts (Plus Jakarta Sans, Material Symbols)
- **Almacenamiento**: localStorage para rankings y configuraciones
- **Estructura de datos**: Arrays y objetos para gestión del estado del juego
- **Responsive Design**: Clases de TailwindCSS para adaptabilidad

## Estructura del Proyecto
rompecabezas/
├── css/
│   └── styles.css           # Estilos personalizados
├── js/
│   ├── main.js              # Lógica principal
│   ├── puzzle.js            # Lógica del rompecabezas
│   ├── puzzle-refactored.js # Versión refactorizada
│   ├── ranking.js           # Sistema de rankings
│   ├── settings.js          # Configuraciones
│   └── utils.js             # Funciones auxiliares
├── images/
│   └── puzzles/             # Imágenes para rompecabezas
├── index.html               # Página principal
├── puzzle.html              # Juego principal
├── setting.html             # Configuraciones
├── ranking.html             # Tabla de rankings
└── completion.html          # Página de felicitaciones


## Convenciones Específicas

### Sistema de Dificultades
- **Fácil**: Grid 3x3 (9 piezas)
- **Medio**: Grid 4x4 (16 piezas)
- **Difícil**: Grid 5x5 (25 piezas)

### Clases CSS Importantes
- `.puzzle-piece`: Piezas del rompecabezas
- `.pieza-fija`: Piezas en posición correcta (bloqueadas)
- `.articulada-right`, `.articulada-bottom`: Piezas adyacentes correctas
- `.rompecabezas-completo`: Estado final del puzzle

### Almacenamiento Local
- `puzzleRanking_3x3`: Ranking para dificultad fácil
- `puzzleRanking_4x4`: Ranking para dificultad media
- `puzzleRanking_5x5`: Ranking para dificultad difícil
- `puzzleSettings`: Configuraciones del juego

## Notas para Desarrollo

- El proyecto está diseñado para ser educativo y accesible para principiantes
- Priorizar explicaciones claras en el código
- Mantener la consistencia visual entre todas las páginas
- Asegurar que las imágenes de rompecabezas tengan relación de aspecto 9:16