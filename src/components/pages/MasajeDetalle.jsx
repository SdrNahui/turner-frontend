import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteService, getServiceById, updateService} from "../api/services.js";
import {formaterPrice} from "../utils/formatters.js";
import {Toast} from "../ui/Toast.jsx";
import {useToast} from "../hooks/useToast.js";
import {confirmDelete} from "../hooks/alerts.js";


export function MasajeDetalle({role}) {
    const {id} = useParams();
    const {toast, showToast, hideToast} = useToast();
    const navigate = useNavigate();
    const [masaje, setMasaje] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [tiempo, setTiempo] = useState('');
    useEffect(() => {
        getServiceById(id).then(data => {
            setMasaje(data);
            setNombre(data.serviceName);
            setPrecio(data.price);
            setTiempo(data.estimatedDuration);
        }).catch(e => showToast(e.message, 'error')).finally(() => setLoading(false));
    }, [id]);

    const handleEditar = async() => {
        try {
            await updateService(id,{serviceName: nombre, price: precio, estimatedDuration: tiempo})
            showToast("Masaje editado correctamente");
            setEditando(false);
            getServiceById(id).then(setMasaje);
        } catch (e){
            showToast(e.message, 'error');
        }
    }

    const handleEliminar = async() => {
        const { isConfirmed } = await confirmDelete(
            "¿Eliminar Masaje?",
            `Se dará de baja el servicio: ${masaje.serviceName}`
        );
        if (!isConfirmed) return;
        try {
            await deleteService(id);
            showToast("Masaje eliminado");
            navigate('/masajes');
        } catch (e) {
            showToast(e.message, 'error');
        }
    }

    if(loading) return <div className="p-4 text-zinc-400 ">Cargando...</div>
    if(!masaje) return <div className="p-4 text-zinc-400 ">Masaje no encontrado</div>
    return (
        <div className="p-4 max-w-lg">
            <button onClick={() => navigate('/masajes')}
                    className="text-zinc-400 hover:text-white text-sm mb-4 flex items-center gap-1">
                ← Volver
            </button>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast}/>}
            <div className="bg-zinc-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-white font-medium">{masaje.serviceName}</p>
                        <p className="text-zinc-400 text-sm">{formaterPrice(masaje.price)}</p>
                        <p className="text-zinc-500 text-xs">{masaje.estimatedDuration} min</p>
                    </div>
                </div>
                { role === 'ADMIN' && editando ? (
                    <div className="flex flex-col gap-2 mb-4">
                        <input value={nombre} onChange={e =>
                            setNombre(e.target.value)}
                               className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm"/>

                        <div className="relative">
                            <input value={precio} onChange={e =>
                                setPrecio(e.target.value)}
                                   className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm w-full pr-8"/>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">k</span>
                        </div>

                        <div className="relative">
                            <input value={tiempo} onChange={e =>
                                setTiempo(e.target.value)}
                                   className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm w-full pr-12"/>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400
                            text-xs">min</span>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={handleEditar}
                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2
                                    text-sm flex-1">
                                Guardar
                            </button>
                            <button onClick={() => setEditando(false)}
                                    className="bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg px-4 py-2
                                    text-sm flex-1">
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        {role === 'ADMIN' && (
                            <>
                                <button onClick={() => setEditando(true)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2
                                    text-sm flex-1">Editar</button>
                                <button onClick={handleEliminar}
                                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2
                                        text-sm flex-1">Dar de baja</button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}