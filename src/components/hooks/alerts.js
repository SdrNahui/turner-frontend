import Swal from 'sweetalert2';

// Configuración base para mantener la consistencia visual
const baseConfig = {
    background: '#020617',
    iconColor: '#f59e0b',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
        popup: 'rounded-3xl border border-slate-800 shadow-2xl',
        confirmButton: 'bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-semibold ' +
            'transition-all mx-2',
        cancelButton: 'bg-slate-800 hover:bg-slate-700 text-slate-300 px-8 py-2.5 rounded-xl font-semibold ' +
            'transition-all mx-2'
    }
};

/**
 * Alerta genérica de confirmación
 */
export const confirmDialog = async ({ title, text, html, icon = 'warning', confirmText = 'Confirmar' }) => {
    return await Swal.fire({
        ...baseConfig,
        title: `<span class="text-white font-bold text-2xl">${title}</span>`,
        text: text,
        html: html ? `<div class="text-slate-300">${html}</div>` : undefined,
        icon: icon,
        confirmButtonText: confirmText,
        cancelButtonText: 'Cancelar',
    });
};

/**
 * Alerta específica para Eliminación (Botón rojo)
 */
export const confirmDelete = async (title = "¿Eliminar registro?",
                                    text = "Esta acción no se puede deshacer") => {
    return await Swal.fire({
        ...baseConfig,
        title: `<span class="text-white font-bold text-2xl">${title}</span>`,
        text: text,
        icon: 'error',
        confirmButtonText: 'Sí, eliminar',
        customClass: {
            ...baseConfig.customClass,
            confirmButton: 'bg-red-600 hover:bg-red-500 text-white px-8 py-2.5 rounded-xl font-semibold ' +
                'transition-all mx-2',
        }
    });
};

/**
 * Alerta para conflictos (como la de tus turnos)
 */
export const confirmConflict = async (itemsAffected) => {
    const turnosHtml = `
        <div class="text-left">
            <p class="mb-3 text-slate-300">Se verán afectados 
            <span class="font-semibold text-amber-400">${itemsAffected.length} turno(s)</span>:</p>
            <ul class="bg-slate-800 border border-slate-700 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 
            custom-scrollbar">
                ${itemsAffected.map(t => `
                    <li class="text-sm text-slate-300 flex items-start">
                        <span class="mr-2 text-amber-500">•</span>
                        <span><strong class="text-white">${t.clientName}</strong> 
                        <span class="text-slate-400">(${t.offeredName})</span></span>
                    </li>
                `).join('')}
            </ul>
        </div>`;

    return await confirmDialog({
        title: 'Conflicto de turnos',
        html: turnosHtml,
        confirmText: 'Actualizar de todos modos'
    });
};
export const showRateLimitError = (message) => {
    return Swal.fire({
        ...baseConfig,
        title: `<span class="text-white font-bold text-2xl">¡Demasiadas peticiones!</span>`,
        html: `<div class="text-slate-300">${message || 'Por favor, intentá más tarde.'}</div>`,
        icon: 'warning',
        confirmButtonText: 'Entendido',
        timer: 7000,
        timerProgressBar: true,
    });
};