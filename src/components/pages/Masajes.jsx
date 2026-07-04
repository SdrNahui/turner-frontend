import {useServices} from "../hooks/useServices.js";
import {useState} from "react";
import {createServiceOffered} from "../api/services.js";
import {formaterPrice} from "../utils/formatters.js";
import {useNavigate} from "react-router-dom";
import {Toast} from "../ui/Toast.jsx";
import {useToast} from "../hooks/useToast.js";

export function Masajes({role}){
    const {services, loading, refetch} = useServices();
    const {toast, showToast, hideToast} = useToast();
    const [nombreService, setNombreService] = useState('');
    const [price, setPrice] = useState('');
    const [tiempoEstimado, setTiempoEstimado] = useState('');
    const navigate = useNavigate();

    const handleCrear = async  () => {
        if(!nombreService || !price || !tiempoEstimado) {
            showToast("Completar todos los campos", 'warning');
            return;
        }
        try {
            await createServiceOffered({serviceName: nombreService, price: price,
                estimatedDuration: tiempoEstimado});
            showToast("Masaje añadido");
            refetch();
            setNombreService('');
            setPrice('');
            setTiempoEstimado('');
        } catch (e) {
            showToast(e.message, 'error');
        }
    }
    if(loading) return (<div className="px-4 text-zinc-400">Cargando...</div>)

    return (
        <div className="p-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast}/>}
            {role === 'ADMIN' && (
                <div className="bg-zinc-800 rounded-xl p-4 mb-4">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3">Añadir Masaje</p>
                    <div className="flex flex-col md:flex-row gap-2 md:items-center">
                        <input value={nombreService} onChange={e =>
                            setNombreService(e.target.value)} placeholder="Nombre" className="bg-zinc-700
                            text-zinc-300 rounded-lg px-3 py-2 text-sm flex-1 w-full"/>
                        <input value={price} onChange={e =>
                            setPrice(e.target.value)} placeholder="Precio" className="bg-zinc-700 text-zinc-300
                        rounded-lg px-3 py-2 text-sm flex-1 w-full"/>
                        <input value={tiempoEstimado} onChange={e =>
                            setTiempoEstimado(e.target.value)} placeholder="Tiempo estimado" className="bg-zinc-700
                        text-zinc-300 rounded-lg px-3 py-2 text-sm flex-1 w-full"/>
                        <button onClick={handleCrear} className="bg-blue-500 hover:bg-blue-600 text-white
                        rounded-lg px-4 py-2 text-sm transition-colors whitespace-nowrap w-full
                        md:w-auto">Añadir</button>
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-2">
                {services.map((s, i) => (
                    <div key={i} onClick={() => navigate(`/masajes/${s.id}`)} className="bg-zinc-800
                    rounded-xl p-4 border-l-4 border-blue-400 flex justify-between items-center">
                        <div>
                            <p className="text-white font-medium">{s.serviceName}</p>
                            <p className="text-zinc-400 text-sm">{formaterPrice(s.price)}</p>
                            <p className="text-zinc-500 text-xs">{s.estimatedDuration} min</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}