/**
 * main.js - Lógica principal de la aplicación de rompecabezas
 * 
 * Este archivo contiene funciones generales que se usan en toda la aplicación:
 * - Navegación entre páginas
 * - Configuraciones globales
 * - Utilidades compartidas
 */

// Configuración global de la aplicación
const CONFIG = {
    // Versión de la aplicación
    version: '1.0.0',
    
    // Configuraciones de juego por defecto
    defaultDifficulty: '3x3',
    
    // Sonidos habilitados por defecto
    soundEnabled: true,
    
    // Vibración habilitada por defecto
    vibrationEnabled: true
};

/**
 * Función que se ejecuta cuando se carga cualquier página
 * Inicializa configuraciones básicas
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Rompecabezas App iniciada - Versión', CONFIG.version);
    
    // Cargar configuraciones guardadas del usuario
    loadUserSettings();
    
    // Inicializar elementos comunes en todas las páginas
    initializeCommonElements();
});

/**
 * Cargar configuraciones del usuario desde localStorage
 */
function loadUserSettings() {
    // Obtener configuraciones guardadas
    const savedSettings = localStorage.getItem('puzzleSettings');
    
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            CONFIG.soundEnabled = settings.soundEnabled ?? CONFIG.soundEnabled;
            CONFIG.vibrationEnabled = settings.vibrationEnabled ?? CONFIG.vibrationEnabled;
            CONFIG.defaultDifficulty = settings.defaultDifficulty ?? CONFIG.defaultDifficulty;
            
            console.log('⚙️ Configuraciones cargadas:', settings);
        } catch (error) {
            console.log('❌ Error cargando configuraciones:', error);
        }
    }
}

/**
 * Guardar configuraciones del usuario en localStorage
 */
function saveUserSettings() {
    const settings = {
        soundEnabled: CONFIG.soundEnabled,
        vibrationEnabled: CONFIG.vibrationEnabled,
        defaultDifficulty: CONFIG.defaultDifficulty
    };
    
    localStorage.setItem('puzzleSettings', JSON.stringify(settings));
    console.log('💾 Configuraciones guardadas:', settings);
}

/**
 * Inicializar elementos comunes en todas las páginas
 */
function initializeCommonElements() {
    // Agregar efectos de hover a botones si están disponibles
    const buttons = document.querySelectorAll('button, a');
    
    buttons.forEach(button => {
        // Agregar efecto de sonido al hacer click (si está habilitado)
        button.addEventListener('click', function() {
            if (CONFIG.soundEnabled) {
                playClickSound();
            }
            
            if (CONFIG.vibrationEnabled && navigator.vibrate) {
                navigator.vibrate(50); // Vibración corta de 50ms
            }
        });
    });
}

/**
 * Reproducir sonido de click (placeholder para futura implementación)
 */
function playClickSound() {
    // TODO: Implementar reproducción de sonido
    console.log('🔊 *click*');
}

/**
 * Funciones de utilidad exportadas para usar en otros archivos
 */
window.PuzzleApp = {
    CONFIG,
    saveUserSettings,
    loadUserSettings,
    playClickSound
};