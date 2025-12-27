/**
 * puzzle.js - Lógica específica del juego de rompecabezas REFACTORIZADA
 * 
 * Este archivo contiene toda la lógica del juego:
 * - Manejo del grid de piezas
 * - Sistema de intercambio de piezas
 * - Detección de piezas correctas con animaciones y bloqueo
 * - Sistema de articulación visual entre piezas adyacentes
 * - Contador de movimientos y temporizador mejorados
 * - Verificación de victoria con estado final fluido
 */

// Estado del juego actual
let gameState = {
    // Grid actual del juego (3x3, 4x4, etc.)
    gridSize: 3,
    
    // Contador de movimientos
    moveCount: 0,
    
    // Tiempo de inicio del juego
    startTime: null,
    
    // Intervalo del temporizador
    timerInterval: null,
    
    // Array que representa el estado actual del puzzle
    currentPuzzle: [],
    
    // Array que representa la solución correcta
    correctSolution: [],
    
    // Piezas que están fijas en posición correcta
    fixedPieces: new Set(),
    
    // Pieza actualmente seleccionada para intercambio
    selectedPiece: null,
    
    // Indica si el juego está completado
    isCompleted: false
};

/**
 * Inicializar el juego cuando se carga la página de puzzle
 */
document.addEventListener('DOMContentLoaded', function() {
    // Solo ejecutar en la página de puzzle
    if (!document.querySelector('.puzzle-piece')) {
        return;
    }
    
    console.log('🧩 Inicializando juego de rompecabezas refactorizado...');
    
    // Configurar el juego inicial
    initializePuzzleGame();
});

/**
 * Configurar el estado inicial del juego
 */
function initializePuzzleGame() {
    // Obtener todas las piezas del DOM
    const puzzlePieces = document.querySelectorAll('.puzzle-piece');
    
    // Configurar el estado inicial
    gameState.startTime = Date.now();
    gameState.moveCount = 0;
    gameState.currentPuzzle = [];
    gameState.correctSolution = [];
    gameState.fixedPieces.clear();
    gameState.isCompleted = false;
    
    // Iniciar el temporizador
    startTimer();
    
    // Procesar cada pieza para crear el estado del juego
    puzzlePieces.forEach((piece, index) => {
        const currentPos = piece.dataset.position;
        const correctPos = piece.dataset.correctPosition;
        
        gameState.currentPuzzle.push({
            element: piece,
            currentPosition: currentPos,
            correctPosition: correctPos,
            isCorrect: currentPos === correctPos
        });
        
        // Verificar si la pieza está en posición correcta
        if (currentPos === correctPos) {
            markPieceAsFixed(piece, index, false); // Sin animación inicial
        }
    });
    
    // Agregar eventos de click a cada pieza
    setupPieceClickEvents();
    
    // Configurar botones de control
    setupGameControls();
    
    // Actualizar la interfaz
    updateGameInterface();
    
    // Verificar si el puzzle ya está completo al iniciar
    setTimeout(() => {
        checkPuzzleCompletion();
    }, 100);
    
    console.log('✅ Juego inicializado con', puzzlePieces.length, 'piezas');
}

/**
 * Configurar eventos de click en las piezas
 */
function setupPieceClickEvents() {
    const puzzlePieces = document.querySelectorAll('.puzzle-piece');
    
    puzzlePieces.forEach((piece, index) => {
        piece.addEventListener('click', function() {
            handlePieceClick(piece, index);
        });
    });
}

/**
 * Manejar click en una pieza del puzzle
 */
function handlePieceClick(piece, pieceIndex) {
    console.log('🖱️ Pieza clickeada:', piece.dataset.position);
    
    // Bloquear interacciones si el puzzle está completado
    if (gameState.isCompleted) {
        console.log('🔒 Puzzle completado - intercambios bloqueados');
        return;
    }
    
    // Bloquear interacción con piezas fijas
    if (piece.classList.contains('pieza-fija')) {
        console.log('🔒 Pieza fija - no se puede mover');
        return;
    }
    
    // Si no hay pieza seleccionada, seleccionar esta
    if (gameState.selectedPiece === null) {
        selectPiece(piece, pieceIndex);
    } 
    // Si ya hay una pieza seleccionada
    else {
        // Si se clickea la misma pieza, deseleccionar
        if (gameState.selectedPiece.index === pieceIndex) {
            deselectPiece();
        } 
        // Si se clickea una pieza diferente, intercambiar
        else {
            swapPieces(gameState.selectedPiece, {element: piece, index: pieceIndex});
        }
    }
}

/**
 * Seleccionar una pieza para intercambio
 */
function selectPiece(piece, pieceIndex) {
    gameState.selectedPiece = {
        element: piece,
        index: pieceIndex
    };
    
    // Agregar efecto visual de selección
    piece.classList.add('selected');
    piece.style.transform = 'scale(1.05)';
    piece.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.6)';
    piece.style.borderColor = '#6366F1';
    
    console.log('✅ Pieza seleccionada:', piece.dataset.position);
}

/**
 * Deseleccionar la pieza actual
 */
function deselectPiece() {
    if (gameState.selectedPiece) {
        const piece = gameState.selectedPiece.element;
        
        // Remover efectos visuales
        piece.classList.remove('selected');
        piece.style.transform = '';
        piece.style.boxShadow = '';
        piece.style.borderColor = '';
        
        gameState.selectedPiece = null;
        console.log('❌ Pieza deseleccionada');
    }
}

/**
 * Intercambiar dos piezas
 */
function swapPieces(piece1, piece2) {
    console.log('🔄 Intercambiando piezas:', 
                piece1.element.dataset.position, 
                '↔', 
                piece2.element.dataset.position);
    
    // Obtener las posiciones actuales
    const pos1 = piece1.element.dataset.position;
    const pos2 = piece2.element.dataset.position;
    
    // Intercambiar las posiciones en el dataset
    piece1.element.dataset.position = pos2;
    piece2.element.dataset.position = pos1;
    
    // Intercambiar el contenido visual
    const content1 = piece1.element.innerHTML;
    const content2 = piece2.element.innerHTML;
    
    piece1.element.innerHTML = content2;
    piece2.element.innerHTML = content1;
    
    // Agregar animación de intercambio
    animateSwap(piece1.element, piece2.element);
    
    // Incrementar contador de movimientos
    gameState.moveCount++;
    updateMoveCounter();
    
    // Deseleccionar
    deselectPiece();
    
    // Verificar si se formaron nuevas posiciones correctas
    setTimeout(() => {
        checkForCorrectPlacements();
    }, 300); // Esperar a que termine la animación
}

/**
 * Animar el intercambio de piezas
 */
function animateSwap(piece1, piece2) {
    // Efecto temporal de intercambio
    piece1.style.transform = 'scale(0.9)';
    piece2.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        piece1.style.transform = '';
        piece2.style.transform = '';
    }, 200);
}

/**
 * Marcar una pieza como fija en posición correcta
 * @param {HTMLElement} piece - Elemento de la pieza
 * @param {number} index - Índice de la pieza
 * @param {boolean} withAnimation - Si mostrar animación temporal
 */
function markPieceAsFixed(piece, index, withAnimation = true) {
    // Agregar a conjunto de piezas fijas
    gameState.fixedPieces.add(index);
    
    // Aplicar clase permanente
    piece.classList.add('pieza-fija');
    
    // Si se requiere animación temporal
    if (withAnimation) {
        piece.classList.add('pieza-correcta-anim');
        console.log('✨ Animación de pieza correcta aplicada:', piece.dataset.position);
        
        // Remover animación después de 1 segundo
        setTimeout(() => {
            piece.classList.remove('pieza-correcta-anim');
        }, 1000);
    }
    
    console.log('🔒 Pieza marcada como fija:', piece.dataset.position);
    
    // Actualizar articulación visual con piezas adyacentes
    updateAdjacentArticulation();
}

/**
 * Verificar piezas en posición correcta después del intercambio
 */
function checkForCorrectPlacements() {
    const puzzlePieces = document.querySelectorAll('.puzzle-piece');
    
    puzzlePieces.forEach((piece, index) => {
        const currentPos = piece.dataset.position;
        const correctPos = piece.dataset.correctPosition;
        
        if (currentPos === correctPos) {
            // Pieza en posición correcta
            if (!piece.classList.contains('pieza-fija')) {
                markPieceAsFixed(piece, index, true); // Con animación
            }
        } else {
            // Pieza no está en posición correcta
            if (piece.classList.contains('pieza-fija')) {
                // Remover de estado fijo
                gameState.fixedPieces.delete(index);
                piece.classList.remove('pieza-fija', 'pieza-correcta-anim');
                console.log('🔓 Pieza ya no está fija:', currentPos);
                
                // Actualizar articulación
                updateAdjacentArticulation();
            }
        }
    });
    
    // Verificar si el puzzle está completo
    checkPuzzleCompletion();
}

/**
 * Actualizar la articulación visual entre piezas adyacentes fijas
 */
function updateAdjacentArticulation() {
    const puzzlePieces = document.querySelectorAll('.puzzle-piece');
    
    puzzlePieces.forEach((piece, index) => {
        if (!piece.classList.contains('pieza-fija')) return;
        
        const [row, col] = piece.dataset.position.split(',').map(Number);
        
        // Verificar piezas adyacentes
        const adjacentPositions = [
            `${row},${col+1}`, // Derecha
            `${row+1},${col}`, // Abajo
        ];
        
        adjacentPositions.forEach(adjPos => {
            const adjacentPiece = Array.from(puzzlePieces).find(p => 
                p.dataset.position === adjPos && p.classList.contains('pieza-fija')
            );
            
            if (adjacentPiece) {
                // Las dos piezas están fijas y son adyacentes
                const direction = adjPos === `${row},${col+1}` ? 'right' : 'bottom';
                piece.classList.add(`articulada-${direction}`);
                console.log(`🔗 Articulación ${direction} aplicada entre ${piece.dataset.position} y ${adjPos}`);
            }
        });
    });
}

/**
 * Configurar botones de control del juego
 */
function setupGameControls() {
    // Botón de mezclar - buscar por el ícono y texto
    const buttons = document.querySelectorAll('button');
    let shuffleButton = null;
    let resetButton = null;
    
    buttons.forEach(button => {
        const buttonText = button.textContent.trim();
        const hasShuffleIcon = button.querySelector('[class*="shuffle"]') || 
                               button.querySelector('span')?.textContent?.includes('shuffle');
        const hasRestartIcon = button.querySelector('[class*="restart"]') ||
                               button.querySelector('span')?.textContent?.includes('restart_alt');
        
        if (buttonText.includes('Mezclar') || hasShuffleIcon) {
            shuffleButton = button;
        } else if (buttonText.includes('Reiniciar') || hasRestartIcon) {
            resetButton = button;
        }
    });
    
    if (shuffleButton) {
        shuffleButton.addEventListener('click', shufflePuzzleOnly);
        console.log('✅ Botón Mezclar conectado (solo mezclar)');
    } else {
        console.log('⚠️ Botón Mezclar no encontrado');
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetPuzzle);
        console.log('✅ Botón Reiniciar conectado (mezclar + reset)');
    } else {
        console.log('⚠️ Botón Reiniciar no encontrado');
    }
}

/**
 * Limpiar efectos visuales de todas las piezas
 */
function clearAllPieceEffects() {
    const puzzlePieces = document.querySelectorAll('.puzzle-piece');
    const puzzleContainer = document.querySelector('.grid.grid-cols-3');
    
    puzzlePieces.forEach(piece => {
        // Remover clases de estado
        piece.classList.remove('pieza-fija', 'pieza-correcta-anim', 'selected', 'articulada-right', 'articulada-bottom');
        
        // Limpiar estilos inline
        piece.style.border = '';
        piece.style.boxShadow = '';
        piece.style.outline = '';
        piece.style.outlineOffset = '';
        piece.style.transform = '';
        piece.style.borderColor = '';
        piece.style.cursor = '';
        piece.style.opacity = '';
    });
    
    // Remover clase de rompecabezas completo del contenedor
    if (puzzleContainer) {
        puzzleContainer.classList.remove('rompecabezas-completo');
    }
}

/**
 * NUEVA FUNCIÓN: Solo mezclar las piezas (sin resetear temporizador ni movimientos)
 */
function shufflePuzzleOnly() {
    console.log('🔀 Mezclando puzzle (sin resetear contadores)...');
    
    // Limpiar efectos visuales antes de mezclar
    clearAllPieceEffects();
    
    // Reiniciar solo estados relacionados con las posiciones
    gameState.selectedPiece = null;
    gameState.fixedPieces.clear();
    gameState.isCompleted = false;
    
    // NO resetear temporizador ni moveCount
    
    // Obtener todas las piezas del puzzle
    const puzzlePieces = Array.from(document.querySelectorAll('.puzzle-piece'));
    
    // Extraer las posiciones actuales y el contenido visual
    const pieceData = puzzlePieces.map(piece => ({
        position: piece.dataset.position,
        content: piece.innerHTML
    }));
    
    // Mezclar las posiciones usando Fisher-Yates
    for (let i = pieceData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieceData[i], pieceData[j]] = [pieceData[j], pieceData[i]];
    }
    
    // Asignar las posiciones mezcladas de vuelta a las piezas
    puzzlePieces.forEach((piece, index) => {
        piece.dataset.position = pieceData[index].position;
        piece.innerHTML = pieceData[index].content;
    });
    
    // Verificar nuevas posiciones correctas después del mezclado
    setTimeout(() => {
        checkForCorrectPlacements();
    }, 100);
    
    console.log('✅ Puzzle mezclado (contadores preservados)');
}

/**
 * NUEVA FUNCIÓN: Reiniciar completamente (mezclar + reset de temporizador y movimientos)
 */
function resetPuzzle() {
    console.log('🔄 Reiniciando puzzle completamente...');
    
    // Primero mezclar las piezas
    shufflePuzzleOnly();
    
    // Luego resetear contadores y temporizador
    gameState.moveCount = 0;
    gameState.startTime = Date.now();
    
    // Reiniciar temporizador
    startTimer();
    
    // Actualizar interfaz
    updateGameInterface();
    
    console.log('✅ Puzzle reiniciado completamente (mezclado + contadores en cero)');
}

/**
 * Actualizar contador de movimientos en la interfaz
 */
function updateMoveCounter() {
    // Método 1: Buscar por clase específica
    const moveCounterElement = document.querySelector('.move-counter');
    if (moveCounterElement) {
        moveCounterElement.textContent = gameState.moveCount;
        return;
    }
    
    // Método 2: Buscar por la estructura específica del contador
    const centerDivs = document.querySelectorAll('.text-center');
    for (let centerDiv of centerDivs) {
        if (centerDiv.textContent.includes('Movimientos')) {
            const numberElement = centerDiv.querySelector('div:first-child');
            if (numberElement && numberElement.classList.contains('text-3xl')) {
                numberElement.textContent = gameState.moveCount;
                console.log('✅ Contador actualizado a:', gameState.moveCount);
                return;
            }
        }
    }
    
    console.log('⚠️ No se pudo encontrar el contador de movimientos');
}

/**
 * Iniciar el temporizador del juego
 */
function startTimer() {
    // Limpiar temporizador anterior si existe
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(updateTimer, 1000);
    console.log('⏱️ Temporizador iniciado');
}

/**
 * Actualizar el display del temporizador
 */
function updateTimer() {
    if (!gameState.startTime) return;
    
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - gameState.startTime) / 1000);
    
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Buscar el elemento del temporizador
    const timerElement = document.querySelector('.text-lg.font-bold.text-white');
    if (timerElement && timerElement.textContent.includes(':')) {
        timerElement.textContent = timeString;
    }
}

/**
 * Detener el temporizador
 */
function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
        console.log('⏹️ Temporizador detenido');
    }
}

/**
 * Actualizar toda la interfaz del juego
 */
function updateGameInterface() {
    updateMoveCounter();
    updateTimer();
    
    console.log('🔄 Interfaz actualizada - Movimientos:', gameState.moveCount);
}

/**
 * Verificar si el puzzle está completo
 */
function checkPuzzleCompletion() {
    const puzzlePieces = document.querySelectorAll('.puzzle-piece');
    let correctCount = 0;
    
    puzzlePieces.forEach(piece => {
        const currentPos = piece.dataset.position;
        const correctPos = piece.dataset.correctPosition;
        
        if (currentPos === correctPos) {
            correctCount++;
        }
    });
    
    console.log(`🧩 Piezas correctas: ${correctCount}/${puzzlePieces.length}`);
    
    if (correctCount === puzzlePieces.length && !gameState.isCompleted) {
        console.log('🎉 ¡Puzzle completado! Activando estado final...');
        gameState.isCompleted = true;
        handlePuzzleCompletion();
    }
    
    return gameState.isCompleted;
}

/**
 * Manejar la finalización del puzzle
 */
function handlePuzzleCompletion() {
    console.log('🎉 ¡Puzzle completado!');
    
    // Detener el temporizador
    stopTimer();
    
    // Deseleccionar cualquier pieza activa
    deselectPiece();
    
    // Aplicar clase de rompecabezas completo al contenedor
    const puzzleContainer = document.querySelector('.grid.grid-cols-3');
    if (puzzleContainer) {
        puzzleContainer.classList.add('rompecabezas-completo');
        console.log('✨ Clase rompecabezas-completo aplicada');
    }
    
    // Cambiar cursor para indicar que está bloqueado
    const puzzlePieces = document.querySelectorAll('.puzzle-piece');
    puzzlePieces.forEach(piece => {
        piece.style.cursor = 'default';
        piece.style.opacity = '1'; // Mantener opacidad completa para el estado final
    });
    
    const endTime = Date.now();
    const totalTime = Math.round((endTime - gameState.startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Mostrar mensaje de felicitación
    setTimeout(() => {
        alert(`¡Felicitaciones! Completaste el puzzle en ${gameState.moveCount} movimientos y ${timeString}.`);
    }, 500); // Dar tiempo para que se aplique el CSS
}

/**
 * Exportar funciones para uso global
 */
window.PuzzleGame = {
    gameState,
    initializePuzzleGame,
    shufflePuzzleOnly,
    resetPuzzle,
    checkPuzzleCompletion
};