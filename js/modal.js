/**
 * modal.js - Sistema de ventanas modales estilizadas
 * 
 * Reemplaza los alert() y confirm() nativos con versiones
 * visuales acordes al ESTILO.md del proyecto.
 */

const ModalSystem = {
    /**
     * Inicializar estilos e inyectar contenedor si no existe
     */
    init() {
        if (document.getElementById('custom-modal-container')) return;

        const container = document.createElement('div');
        container.id = 'custom-modal-container';
        // Agregamos 'hidden' para que no bloquee nada al inicio
        container.className = 'fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 hidden opacity-0';
        container.innerHTML = `
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" id="modal-backdrop"></div>
            
            <!-- Modal Content -->
            <div id="modal-content" class="relative w-full max-w-sm mx-4 transform scale-95 transition-all duration-300">
                <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700 overflow-hidden">
                    <!-- Icon Header -->
                    <div class="bg-gradient-to-r from-indigo-500 to-pink-600 p-4 flex justify-center">
                        <span id="modal-icon" class="material-symbols-outlined text-4xl text-white drop-shadow-md">info</span>
                    </div>
                    
                    <!-- Body -->
                    <div class="p-6 text-center">
                        <h3 id="modal-title" class="text-xl font-bold text-slate-800 dark:text-white mb-2">Título</h3>
                        <p id="modal-message" class="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">Mensaje del modal</p>
                        
                        <!-- Actions -->
                        <div id="modal-actions" class="flex gap-3 justify-center">
                            <!-- Buttons will be injected here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container); // Agregamos al body
    },

    /**
     * Mostrar una alerta (reemplazo de alert)
     * @param {string} title - Título del mensaje
     * @param {string} message - Contenido del mensaje
     * @param {string} icon - Icono de Material Symbols (default: 'info')
     * @param {Function} onOk - Callback al cerrar
     */
    showAlert(title, message, icon = 'info', onOk = null) {
        this.init();
        this.updateContent(title, message, icon);

        const actions = document.getElementById('modal-actions');
        actions.innerHTML = `
            <button class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                Entendido
            </button>
        `;

        const btn = actions.querySelector('button');
        btn.onclick = () => {
            this.close();
            if (onOk) onOk();
        };

        this.open();
    },

    /**
     * Mostrar confirmación (reemplazo de confirm)
     * @param {string} title - Título
     * @param {string} message - Mensaje
     * @param {Function} onConfirm - Callback al confirmar
     * @param {Function} onCancel - Callback al cancelar
     * @param {string} confirmText - Texto botón confirmar
     * @param {string} cancelText - Texto botón cancelar
     */
    showConfirm(title, message, onConfirm, onCancel = null, confirmText = 'Aceptar', cancelText = 'Cancelar') {
        this.init();
        this.updateContent(title, message, 'help');

        const actions = document.getElementById('modal-actions');
        actions.innerHTML = `
            <button id="btn-cancel" class="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                ${cancelText}
            </button>
            <button id="btn-confirm" class="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                ${confirmText}
            </button>
        `;

        actions.querySelector('#btn-cancel').onclick = () => {
            this.close();
            if (onCancel) onCancel();
        };

        actions.querySelector('#btn-confirm').onclick = () => {
            this.close();
            if (onConfirm) onConfirm();
        };

        this.open();
    },

    updateContent(title, message, icon) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').innerHTML = message.replace(/\n/g, '<br>');
        document.getElementById('modal-icon').textContent = icon;
    },

    hideTimeout: null,

    open() {
        const container = document.getElementById('custom-modal-container');
        const content = document.getElementById('modal-content');

        // Cancelar cualquier cierre pendiente para evitar que el modal desaparezca si se abre justo después de cerrarse
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        // Quitamos hidden primero para que se renderice
        container.classList.remove('hidden');

        console.log('✨ Abriendo modal...');

        // Usamos un timeout algo mayor para asegurar que el navegador ha procesado el removal de 'hidden'
        // y la transición de opacity funcione correctamente.
        setTimeout(() => {
            container.classList.remove('opacity-0');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 50);
    },

    close() {
        console.log('👋 Cerrando modal...');
        const container = document.getElementById('custom-modal-container');
        const content = document.getElementById('modal-content');

        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        container.classList.add('opacity-0');

        // Esperar a que termine la transición para ocultar (300ms según transition duration)
        this.hideTimeout = setTimeout(() => {
            container.classList.add('hidden');
            this.hideTimeout = null;
        }, 300);
    }
};

// Exportar globalmente
window.ModalSystem = ModalSystem;

// Auto-inicializar al cargar
document.addEventListener('DOMContentLoaded', () => ModalSystem.init());
