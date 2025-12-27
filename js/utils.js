/**
 * utils.js - Funciones auxiliares y utilidades
 * 
 * Este archivo contiene funciones helper que se pueden usar
 * en cualquier parte de la aplicación:
 * - Manipulación del DOM
 * - Formateo de datos
 * - Validaciones
 * - Funciones matemáticas
 */

/**
 * UTILIDADES PARA EL DOM
 */

/**
 * Buscar un elemento por selector con mensaje de error útil
 * @param {string} selector - Selector CSS del elemento
 * @param {HTMLElement} parent - Elemento padre (opcional)
 * @returns {HTMLElement|null} - Elemento encontrado o null
 */
function findElement(selector, parent = document) {
    const element = parent.querySelector(selector);
    if (!element) {
        console.warn(`⚠️ Elemento no encontrado: ${selector}`);
    }
    return element;
}

/**
 * Buscar múltiples elementos por selector
 * @param {string} selector - Selector CSS de los elementos
 * @param {HTMLElement} parent - Elemento padre (opcional)
 * @returns {NodeList} - Lista de elementos encontrados
 */
function findElements(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * Agregar una clase CSS con animación suave
 * @param {HTMLElement} element - Elemento al que agregar la clase
 * @param {string} className - Nombre de la clase CSS
 */
function addClassWithAnimation(element, className) {
    if (!element) return;
    
    element.classList.add(className);
    
    // Forzar repaint para animaciones CSS
    element.offsetHeight;
}

/**
 * Remover una clase CSS después de un delay
 * @param {HTMLElement} element - Elemento del que remover la clase
 * @param {string} className - Nombre de la clase CSS
 * @param {number} delay - Retraso en milisegundos
 */
function removeClassWithDelay(element, className, delay = 300) {
    if (!element) return;
    
    setTimeout(() => {
        element.classList.remove(className);
    }, delay);
}

/**
 * UTILIDADES PARA DATOS
 */

/**
 * Formatear tiempo en segundos a formato MM:SS
 * @param {number} seconds - Tiempo en segundos
 * @returns {string} - Tiempo formateado como "01:23"
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formatear número grande con separadores de miles
 * @param {number} number - Número a formatear
 * @returns {string} - Número formateado como "1,234"
 */
function formatNumber(number) {
    return new Intl.NumberFormat('es-ES').format(number);
}

/**
 * Generar un ID único
 * @returns {string} - ID único generado
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * UTILIDADES PARA ARRAYS Y OBJETOS
 */

/**
 * Mezclar un array de forma aleatoria (algoritmo Fisher-Yates)
 * @param {Array} array - Array a mezclar
 * @returns {Array} - Nuevo array mezclado
 */
function shuffleArray(array) {
    const newArray = [...array]; // Crear copia para no modificar el original
    
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    
    return newArray;
}

/**
 * Obtener un elemento aleatorio de un array
 * @param {Array} array - Array del que obtener elemento
 * @returns {any} - Elemento aleatorio del array
 */
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Verificar si un objeto está vacío
 * @param {Object} obj - Objeto a verificar
 * @returns {boolean} - true si el objeto está vacío
 */
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * UTILIDADES MATEMÁTICAS
 */

/**
 * Generar número aleatorio entre min y max (inclusive)
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} - Número aleatorio generado
 */
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Limitar un número entre un rango mínimo y máximo
 * @param {number} number - Número a limitar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} - Número limitado al rango
 */
function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

/**
 * UTILIDADES PARA LOCAL STORAGE
 */

/**
 * Guardar datos en localStorage de forma segura
 * @param {string} key - Clave para guardar
 * @param {any} data - Datos a guardar
 * @returns {boolean} - true si se guardó correctamente
 */
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('❌ Error guardando en localStorage:', error);
        return false;
    }
}

/**
 * Cargar datos de localStorage de forma segura
 * @param {string} key - Clave a cargar
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any} - Datos cargados o valor por defecto
 */
function loadFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('❌ Error cargando de localStorage:', error);
        return defaultValue;
    }
}

/**
 * UTILIDADES DE VALIDACIÓN
 */

/**
 * Verificar si una cadena es un email válido
 * @param {string} email - Email a verificar
 * @returns {boolean} - true si es un email válido
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Verificar si un valor no está vacío
 * @param {any} value - Valor a verificar
 * @returns {boolean} - true si el valor no está vacío
 */
function isNotEmpty(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return !isEmptyObject(value);
    return true;
}

/**
 * Exportar todas las utilidades para uso global
 */
window.Utils = {
    // DOM utilities
    findElement,
    findElements,
    addClassWithAnimation,
    removeClassWithDelay,
    
    // Data formatting
    formatTime,
    formatNumber,
    generateUniqueId,
    
    // Array utilities
    shuffleArray,
    getRandomElement,
    isEmptyObject,
    
    // Math utilities
    randomBetween,
    clamp,
    
    // Storage utilities
    saveToStorage,
    loadFromStorage,
    
    // Validation utilities
    isValidEmail,
    isNotEmpty
};