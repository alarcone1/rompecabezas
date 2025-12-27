/**
 * settings.js - Sistema de gestión de configuraciones
 * 
 * Este archivo contiene toda la lógica para:
 * - Almacenamiento de configuraciones en localStorage
 * - Gestión de toggles de audio/vibración
 * - Selector de dificultad (3x3, 4x4, 5x5)
 * - Funciones de reseteo de datos
 * - Aplicación automática de configuraciones
 */

// Clave para localStorage
const SETTINGS_STORAGE_KEY = 'puzzleGameSettings';

// Configuraciones por defecto
const DEFAULT_SETTINGS = {
    // Audio y efectos
    soundEnabled: true,
    vibrationEnabled: false, // Por defecto OFF para no molestar
    
    // Dificultad del juego
    difficulty: 'easy', // 'easy', 'medium', 'hard'
    gridSize: 3,        // 3, 4, 5
    
    // Meta-configuraciones
    version: '1.0',
    lastUpdated: null
};

// Mapeo de dificultades
const DIFFICULTY_CONFIG = {
    easy: {
        gridSize: 3,
        name: 'Fácil',
        description: '3×3 - 9 piezas'
    },
    medium: {
        gridSize: 4,
        name: 'Medio', 
        description: '4×4 - 16 piezas'
    },
    hard: {
        gridSize: 5,
        name: 'Difícil',
        description: '5×5 - 25 piezas'
    }
};

/**
 * Obtener configuraciones actuales
 * @returns {Object} Configuraciones con fallback a defaults
 */
function getSettings() {
    try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (!stored) {
            console.log('⚙️ No hay configuraciones guardadas, usando defaults');
            return { ...DEFAULT_SETTINGS };
        }
        
        const settings = JSON.parse(stored);
        
        // Merge con defaults para asegurar todas las propiedades
        const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };
        
        console.log('⚙️ Configuraciones cargadas:', mergedSettings);
        return mergedSettings;
    } catch (error) {
        console.error('❌ Error al cargar configuraciones:', error);
        return { ...DEFAULT_SETTINGS };
    }
}

/**
 * Guardar configuraciones en localStorage
 * @param {Object} settings - Configuraciones a guardar
 */
function saveSettings(settings) {
    try {
        settings.lastUpdated = Date.now();
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        console.log('✅ Configuraciones guardadas:', settings);
    } catch (error) {
        console.error('❌ Error al guardar configuraciones:', error);
    }
}

/**
 * Actualizar una configuración específica
 * @param {string} key - Clave de la configuración
 * @param {*} value - Nuevo valor
 */
function updateSetting(key, value) {
    const currentSettings = getSettings();
    currentSettings[key] = value;
    
    // Si se cambia la dificultad, actualizar gridSize
    if (key === 'difficulty' && DIFFICULTY_CONFIG[value]) {
        currentSettings.gridSize = DIFFICULTY_CONFIG[value].gridSize;
    }
    
    saveSettings(currentSettings);
    console.log(`⚙️ Setting actualizado: ${key} = ${value}`);
    
    // Disparar evento personalizado para notificar cambios
    dispatchSettingsChangeEvent(key, value);
}

/**
 * Disparar evento cuando cambian las configuraciones
 * @param {string} key - Clave que cambió
 * @param {*} value - Nuevo valor
 */
function dispatchSettingsChangeEvent(key, value) {
    const event = new CustomEvent('settingsChanged', {
        detail: { key, value, settings: getSettings() }
    });
    document.dispatchEvent(event);
    console.log(`📡 Evento settingsChanged disparado: ${key} = ${value}`);
}

/**
 * Obtener configuración de dificultad actual
 * @returns {Object} Configuración de dificultad
 */
function getCurrentDifficultyConfig() {
    const settings = getSettings();
    return DIFFICULTY_CONFIG[settings.difficulty] || DIFFICULTY_CONFIG.easy;
}

/**
 * Resetear solo las puntuaciones
 */
function clearScores() {
    try {
        // Limpiar rankings de todas las dificultades
        const difficulties = ['easy', 'medium', 'hard'];
        let clearedCount = 0;
        
        difficulties.forEach(difficulty => {
            const difficultyConfig = {
                easy: { key: 'puzzleRanking_3x3', name: '3x3' },
                medium: { key: 'puzzleRanking_4x4', name: '4x4' },
                hard: { key: 'puzzleRanking_5x5', name: '5x5' }
            };
            
            const key = difficultyConfig[difficulty].key;
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                clearedCount++;
                console.log(`🗑️ Rankings eliminados para ${difficultyConfig[difficulty].name}`);
            }
        });
        
        // También limpiar el ranking legacy por si existe
        if (localStorage.getItem('puzzleRanking')) {
            localStorage.removeItem('puzzleRanking');
            clearedCount++;
            console.log('🗑️ Ranking legacy eliminado');
        }
        
        console.log(`✅ Total: ${clearedCount} rankings eliminados`);
        return true;
    } catch (error) {
        console.error('❌ Error al eliminar puntuaciones:', error);
        return false;
    }
}

/**
 * Resetear completamente todas las configuraciones y datos
 */
function resetAllData() {
    try {
        // Eliminar configuraciones
        localStorage.removeItem(SETTINGS_STORAGE_KEY);
        
        // Eliminar puntuaciones
        localStorage.removeItem('puzzleRanking');
        
        // Eliminar cualquier otro dato relacionado
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('puzzle') || key.startsWith('game')) {
                localStorage.removeItem(key);
            }
        });
        
        console.log('🧹 Todos los datos eliminados');
        return true;
    } catch (error) {
        console.error('❌ Error al resetear datos:', error);
        return false;
    }
}

/**
 * Inicializar la página de configuraciones
 */
function initializeSettingsPage() {
    console.log('⚙️ Inicializando página de configuraciones...');
    
    const currentSettings = getSettings();
    
    // Configurar toggles de audio
    setupAudioToggles(currentSettings);
    
    // Configurar selector de dificultad
    setupDifficultySelector(currentSettings);
    
    // Configurar botones de datos
    setupDataButtons();
    
    console.log('✅ Página de configuraciones inicializada');
}

/**
 * Configurar toggles de audio y vibración
 * @param {Object} settings - Configuraciones actuales
 */
function setupAudioToggles(settings) {
    // Toggle de sonidos
    const soundToggle = document.querySelector('input[type="checkbox"]');
    if (soundToggle) {
        soundToggle.checked = settings.soundEnabled;
        soundToggle.addEventListener('change', (e) => {
            updateSetting('soundEnabled', e.target.checked);
            console.log(`🔊 Sonidos ${e.target.checked ? 'activados' : 'desactivados'}`);
        });
    }
    
    // Toggle de vibración (segundo checkbox)
    const vibrationToggle = document.querySelectorAll('input[type="checkbox"]')[1];
    if (vibrationToggle) {
        vibrationToggle.checked = settings.vibrationEnabled;
        vibrationToggle.addEventListener('change', (e) => {
            updateSetting('vibrationEnabled', e.target.checked);
            console.log(`📳 Vibración ${e.target.checked ? 'activada' : 'desactivada'}`);
        });
    }
}

/**
 * Configurar selector de dificultad
 * @param {Object} settings - Configuraciones actuales
 */
function setupDifficultySelector(settings) {
    const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
    
    difficultyRadios.forEach(radio => {
        // Establecer estado inicial
        radio.checked = radio.value === settings.difficulty;
        
        // Agregar evento de cambio
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                updateSetting('difficulty', e.target.value);
                console.log(`🎯 Dificultad cambiada a: ${DIFFICULTY_CONFIG[e.target.value].name}`);
            }
        });
    });
}

/**
 * Configurar botones de gestión de datos
 */
function setupDataButtons() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        const buttonText = button.textContent.trim();
        
        if (buttonText.includes('Borrar Puntuaciones')) {
            button.addEventListener('click', handleClearScores);
        } else if (buttonText.includes('Reiniciar Todo')) {
            button.addEventListener('click', handleResetAll);
        }
    });
}

/**
 * Manejar borrado de puntuaciones
 */
function handleClearScores() {
    const confirmed = confirm(
        '¿Estás seguro de que quieres borrar todas tus puntuaciones?\n\n' +
        'Esta acción no se puede deshacer.'
    );
    
    if (confirmed) {
        const success = clearScores();
        if (success) {
            alert('✅ Puntuaciones eliminadas correctamente.');
        } else {
            alert('❌ Error al eliminar puntuaciones. Inténtalo de nuevo.');
        }
    }
}

/**
 * Manejar reseteo completo
 */
function handleResetAll() {
    const confirmed = confirm(
        '⚠️ ATENCIÓN: Esto eliminará TODOS tus datos:\n\n' +
        '• Todas las puntuaciones\n' +
        '• Todas las configuraciones\n' +
        '• Todo progreso guardado\n\n' +
        '¿Estás completamente seguro?'
    );
    
    if (confirmed) {
        const doubleConfirm = confirm(
            '🚨 ÚLTIMA ADVERTENCIA 🚨\n\n' +
            'Esta acción es IRREVERSIBLE.\n' +
            '¿Realmente quieres continuar?'
        );
        
        if (doubleConfirm) {
            const success = resetAllData();
            if (success) {
                alert('✅ Todos los datos han sido eliminados.\n\nLa página se recargará.');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                alert('❌ Error al resetear datos. Inténtalo de nuevo.');
            }
        }
    }
}

/**
 * Funciones de utilidad para efectos de sonido
 */
function playSound(soundName) {
    const settings = getSettings();
    if (!settings.soundEnabled) {
        return; // Sonidos desactivados
    }
    
    // TODO: Implementar reproducción de sonidos reales
    console.log(`🔊 Reproduciendo sonido: ${soundName}`);
}

/**
 * Funciones de utilidad para vibración
 */
function vibrate(pattern = [100]) {
    const settings = getSettings();
    if (!settings.vibrationEnabled) {
        return; // Vibración desactivada
    }
    
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
        console.log(`📳 Vibración activada: ${pattern}`);
    }
}

/**
 * Inicialización automática cuando se carga la página
 */
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si estamos en la página de settings
    if (document.querySelector('h1')?.textContent?.includes('Configuración')) {
        initializeSettingsPage();
    }
});

/**
 * Exportar funciones para uso global
 */
window.GameSettings = {
    // Funciones principales
    getSettings,
    updateSetting,
    getCurrentDifficultyConfig,
    
    // Gestión de datos
    clearScores,
    resetAllData,
    
    // Utilidades
    playSound,
    vibrate,
    
    // Configuraciones
    DIFFICULTY_CONFIG,
    DEFAULT_SETTINGS
};