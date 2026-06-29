import {useState} from "react";
import {deleteAvailability, forceUpdateAvailability, updateAvailability} from "../api/availability.js";
import {useToast} from "../hooks/useToast.js";
import {Toast} from "./Toast.jsx";
import {confirmConflict, confirmDelete} from "../hooks/alerts.js";

export function ModalDispo({bloque, onClose, onRefresh}) {
    const {toast, showToast, hideToast} = useToast();
    const [inicio, setInicio] = useState(bloque.startDate.slice(0,16));
    const [fin, setFin] = useState(bloque.endDate.slice(0,16));

    const handleGuardar = async () => {
        try {
            const result = await updateAvailability(bloque.id, {
                start: `${inicio}:00`,
                end: `${fin}:00`
            });

            if (result.hasConflict) {
                // Usamos la función centralizada de conflicto
                const { isConfirmed } = await confirmConflict(result.affectedAppointment);

                if (isConfirmed) {
                    await forceUpdateAvailability(bloque.id, { start: `${inicio}:00`, end: `${fin}:00` });
                    showToast("Actualizado con éxito");
                    onRefresh(); onClose();
                }
            } else {
                showToast("Disponibilidad actualizada");
                onRefresh(); onClose();
            }
        } catch (e) {
            showToast(e.message, 'error');
        }
    };
    const handleEliminar = async() => {
        const { isConfirmed } =
            await confirmDelete("Dar de baja?", "Esta disponibilidad no estará visible")
        if(isConfirmed) {
            try {
                await deleteAvailability(bloque.id);
                showToast("Disponibilidad dada baja");
                onRefresh();
                onClose();
            } catch (e) {
                showToast(e.message, 'error')
            }
        }
    }
    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}/>

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                bg-zinc-800 rounded-xl p-6 z-50 w-80">
                {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast}/>}
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-4"> Editar disponibilidad </p>
                <div className="flex flex-col gap-3 mb-4">
                    <div>
                        <p className="text-zinc-400 text-xs mb-1">Inicio</p>
                        <input type="datetime-local" value={inicio}
                               onChange={e => setInicio(e.target.value)}
                               className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm w-full"/>
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs mb-1">Fin</p>
                        <input type="datetime-local" value={fin}
                               onChange={e => setFin(e.target.value)}
                               className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm w-full"/>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <button onClick={handleGuardar}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm">
                        Guardar
                    </button>
                    <button onClick={onClose}
                            className="bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg px-4 py-2 text-sm">
                        Cancelar
                    </button>
                    <button onClick={handleEliminar}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm">
                        Dar de baja
                    </button>
                </div>
            </div>
        </>
    )



}