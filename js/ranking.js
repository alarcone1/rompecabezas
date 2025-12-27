/**
 * ranking.js - Sistema de gestión de puntuaciones y ranking
 * 
 * Este archivo contiene toda la lógica para:
 * - Almacenamiento de puntajes en localStorage
 * - Algoritmo de ranking (menor movimientos + desempate por tiempo)
 * - Gestión de top 5
 * - Integración con la interfaz de ranking.html
 */

// Clave base para localStorage - ahora será diferente para cada dificultad
const RANKING_STORAGE_BASE = 'puzzleRanking';

// Configuración del ranking
const RANKING_CONFIG = {
    maxEntries: 5,           // Solo top 5
    difficulties: {
        easy: { key: 'puzzleRanking_3x3', name: '3x3', gridSize: 3 },
        medium: { key: 'puzzleRanking_4x4', name: '4x4', gridSize: 4 },
        hard: { key: 'puzzleRanking_5x5', name: '5x5', gridSize: 5 }
    }
};

/**
 * Estructura de un puntaje:
 * {
 *   moves: number,           // Número de movimientos (criterio principal)
 *   timeSeconds: number,     // Tiempo en segundos (criterio de desempate) 
 *   timeString: string,      // Tiempo formateado para mostrar (ej: "1:42")
 *   date: string,           // Fecha del puntaje (YYYY-MM-DD)
 *   timestamp: number       // Timestamp para ordenar por fecha si es necesario
 * }
 */

/**
 * Obtener todos los puntajes guardados
 * @returns {Array} Array de puntajes ordenados por ranking
 */
/**
 * Obtener la clave de storage para una dificultad específica
 * @param {string} difficulty - Dificultad ('easy', 'medium', 'hard') 
 * @returns {string} Clave de localStorage
 */
function getDifficultyStorageKey(difficulty) {
    return RANKING_CONFIG.difficulties[difficulty]?.key || RANKING_CONFIG.difficulties.easy.key;
}

/**
 * Obtener la dificultad actual del juego
 * @returns {string} Dificultad actual
 */
function getCurrentDifficulty() {
    if (window.GameSettings && window.GameSettings.getSettings) {
        const settings = window.GameSettings.getSettings();
        return settings.difficulty || 'easy';
    }
    return 'easy';
}

function getRankingScores(difficulty = null) {
    try {
        const targetDifficulty = difficulty || getCurrentDifficulty();
        const storageKey = getDifficultyStorageKey(targetDifficulty);
        
        const stored = localStorage.getItem(storageKey);
        if (!stored) {
            console.log(`📊 No hay puntajes guardados para ${RANKING_CONFIG.difficulties[targetDifficulty].name}`);
            return [];
        }
        
        const scores = JSON.parse(stored);
        console.log(`📊 Cargados ${scores.length} puntajes para ${RANKING_CONFIG.difficulties[targetDifficulty].name}`);
        return scores;
    } catch (error) {
        console.error('❌ Error al cargar puntajes del localStorage:', error);
        return [];
    }
}

/**
 * Guardar puntajes en localStorage para una dificultad específica
 * @param {Array} scores - Array de puntajes a guardar
 * @param {string} difficulty - Dificultad específica (opcional, usa la actual por defecto)
 */
function saveRankingScores(scores, difficulty = null) {
    try {
        const targetDifficulty = difficulty || getCurrentDifficulty();
        const storageKey = getDifficultyStorageKey(targetDifficulty);
        
        localStorage.setItem(storageKey, JSON.stringify(scores));
        console.log(`✅ Guardados ${scores.length} puntajes para ${RANKING_CONFIG.difficulties[targetDifficulty].name}`);
    } catch (error) {
        console.error('❌ Error al guardar puntajes:', error);
    }
}

/**
 * Algoritmo de ordenación del ranking
 * Criterio 1: Menor número de movimientos (principal)
 * Criterio 2: Si empate -> menor tiempo (desempate)
 * Criterio 3: Si empate total -> más reciente (timestamp)
 * 
 * @param {Object} a - Primer puntaje
 * @param {Object} b - Segundo puntaje
 * @returns {number} Resultado de comparación
 */
function compareScores(a, b) {
    // Criterio principal: menor número de movimientos
    if (a.moves !== b.moves) {
        return a.moves - b.moves;
    }
    
    // Criterio de desempate: menor tiempo
    if (a.timeSeconds !== b.timeSeconds) {
        return a.timeSeconds - b.timeSeconds;
    }
    
    // Si son completamente iguales, el más reciente va primero
    return b.timestamp - a.timestamp;
}

/**
 * Verificar si un puntaje califica para el top 5
 * @param {Object} newScore - Nuevo puntaje a evaluar
 * @returns {Object} { qualifies: boolean, position: number, message: string }
 */
function checkScoreQualification(newScore) {
    const currentScores = getRankingScores();
    
    // Si hay menos de 5 puntajes, siempre califica
    if (currentScores.length < RANKING_CONFIG.maxEntries) {
        const position = currentScores.length + 1;
        console.log(`🎯 Puntaje califica automáticamente (posición ${position})`);
        return {
            qualifies: true,
            position: position,
            message: `¡Entraste al top ${RANKING_CONFIG.maxEntries}! Posición #${position}`
        };
    }
    
    // Crear array temporal para evaluar posición
    const tempScores = [...currentScores, newScore].sort(compareScores);
    const newPosition = tempScores.findIndex(score => score === newScore) + 1;
    
    if (newPosition <= RANKING_CONFIG.maxEntries) {
        let message = '';
        if (newPosition === 1) {
            message = '🏆 ¡NUEVO RÉCORD MUNDIAL! ¡Eres el #1!';
        } else if (newPosition <= 3) {
            message = `🥇 ¡Increíble! Entraste al TOP 3 en posición #${newPosition}`;
        } else {
            message = `🎯 ¡Excelente! Top ${RANKING_CONFIG.maxEntries} - Posición #${newPosition}`;
        }
        
        console.log(`🏆 Puntaje califica para posición ${newPosition}`);
        return {
            qualifies: true,
            position: newPosition,
            message: message
        };
    }
    
    console.log('📉 Puntaje no califica para top 5');
    return {
        qualifies: false,
        position: newPosition,
        message: `Buen intento. Necesitas menos de ${currentScores[RANKING_CONFIG.maxEntries - 1].moves} movimientos para entrar al top ${RANKING_CONFIG.maxEntries}.`
    };
}

/**
 * Agregar un nuevo puntaje al ranking
 * @param {number} moves - Número de movimientos
 * @param {number} timeSeconds - Tiempo en segundos
 * @param {string} timeString - Tiempo formateado
 * @returns {Object} Resultado del intento de agregar puntaje
 */
function addScore(moves, timeSeconds, timeString) {
    console.log(`🎮 Intentando agregar puntaje: ${moves} movimientos, ${timeString}`);
    
    // Crear objeto de puntaje
    const newScore = {
        moves: moves,
        timeSeconds: timeSeconds,
        timeString: timeString,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        timestamp: Date.now()
    };
    
    // Verificar si califica
    const qualification = checkScoreQualification(newScore);
    
    if (qualification.qualifies) {
        // Obtener puntajes actuales
        let currentScores = getRankingScores();
        
        // Agregar el nuevo puntaje
        currentScores.push(newScore);
        
        // Ordenar según algoritmo de ranking
        currentScores.sort(compareScores);
        
        // Mantener solo top 5
        currentScores = currentScores.slice(0, RANKING_CONFIG.maxEntries);
        
        // Guardar en localStorage
        saveRankingScores(currentScores);
        
        console.log(`✅ Puntaje agregado exitosamente en posición ${qualification.position}`);
    }
    
    return {
        success: qualification.qualifies,
        position: qualification.position,
        message: qualification.message,
        scores: getRankingScores()
    };
}

/**
 * Formatear tiempo desde segundos a string MM:SS
 * @param {number} seconds - Segundos totales
 * @returns {string} Tiempo formateado
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Obtener datos formateados para mostrar en la interfaz
 * @returns {Array} Array de puntajes formateados para UI
 */
function getFormattedRankingData() {
    const scores = getRankingScores();
    
    return scores.map((score, index) => ({
        position: index + 1,
        moves: score.moves,
        timeString: score.timeString,
        date: score.date,
        isRecord: index === 0, // El primero es récord
        isPodium: index < 3    // Top 3 es podium
    }));
}

/**
 * Limpiar todo el ranking (para testing)
 * SOLO PARA DESARROLLO - Remover en producción
 */
function clearRanking() {
    localStorage.removeItem(RANKING_STORAGE_KEY);
    console.log('🗑️ Ranking limpiado completamente');
}

/**
 * Agregar puntajes de prueba para desarrollo
 * SOLO PARA DESARROLLO - Remover en producción
 */
function addTestScores() {
    const testScores = [
        { moves: 15, timeSeconds: 135, timeString: "2:15" },
        { moves: 18, timeSeconds: 168, timeString: "2:48" },
        { moves: 22, timeSeconds: 192, timeString: "3:12" },
        { moves: 25, timeSeconds: 225, timeString: "3:45" },
        { moves: 12, timeSeconds: 102, timeString: "1:42" }  // Este será el récord
    ];
    
    // Limpiar ranking actual
    clearRanking();
    
    // Agregar cada puntaje
    testScores.forEach(score => {
        addScore(score.moves, score.timeSeconds, score.timeString);
    });
    
    console.log('🧪 Puntajes de prueba agregados');
}

/**
 * Exportar funciones para uso global
 */
window.RankingSystem = {
    // Funciones principales
    getRankingScores,
    addScore,
    getFormattedRankingData,
    
    // Utilidades
    formatTime,
    
    // Solo para desarrollo
    clearRanking,
    addTestScores,
    
    // Configuración
    config: RANKING_CONFIG
};