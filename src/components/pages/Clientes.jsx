import {useClients} from "../hooks/useClients.js";
import {useState} from "react";
import {createClient} from "../api/clients.js";
import {useNavigate} from "react-router-dom";
import {Toast} from "../ui/Toast.jsx";
import {useToast} from "../hooks/useToast.js";

export function Clientes({role}){
    const {clients, loading, refetch} = useClients();
    const {toast, showToast, hideToast} = useToast();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const navigate = useNavigate();
    const handleCrear = async () => {
        if(!nombre || !apellido || !telefono) {
            showToast("Complete todos los campos", 'warning');
            return;
        }
        try {
            await createClient({clientName: nombre, clientLastName: apellido, phoneNumber: telefono});
            showToast("Cliente añadido");
            refetch();
            setNombre('');
            setApellido('');
            setTelefono('');
        } catch (e){
            showToast(e.message, 'error');
        }
    }
    if(loading) return <div className="p-4 text-zinc-400">Cargando...</div>
    const tipoClass = {
        NEW: "bg-blue-900 text-blue-300",
        REGULAR: "bg-orange-900 text-orange-300",
        FREQUENT: "bg-green-900 text-green-300"
    }
    const tipoLabel = {NEW: "Nuevo", REGULAR: "Regular", FREQUENT: "Frecuente"};
    return (
        <div className="p-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast}/>}
            {role === 'ADMIN' && (
                <div className="bg-zinc-800 rounded-xl p-4 mb-4">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3">Añadir cliente</p>
                    <div className="flex flex-col md:flex-row gap-2 md:items-center">
                        <input value={nombre} onChange={e =>
                            setNombre(e.target.value)} placeholder="Nombre" className="bg-zinc-700 text-zinc-300
                        rounded-lg px-3 py-2 text-sm flex-1 w-full"/>
                        <input value={apellido} onChange={e =>
                            setApellido(e.target.value)} placeholder="Apellido" className="bg-zinc-700 text-zinc-300
                        rounded-lg px-3 py-2 text-sm flex-1 w-full"/>
                        <input value={telefono} onChange={e =>
                            setTelefono(e.target.value)} placeholder="Teléfono" className="bg-zinc-700 text-zinc-300
                        rounded-lg px-3 py-2 text-sm flex-1 w-full"/>
                        <button onClick={handleCrear} className="bg-blue-500 hover:bg-blue-600 text-white
                        rounded-lg px-4 py-2 text-sm transition-colors whitespace-nowrap w-full
                        md:w-auto">Añadir</button>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2">
                {clients.map((c, i) => (
                    <div key={i} onClick={() => navigate(`/clientes/${c.id}`)}
                         className="bg-zinc-800 rounded-xl p-4 border-l-4 border-blue-400 flex
                    justify-between items-center">
                        <div>
                            <p className="text-white font-medium">{c.name} {c.lastName}</p>
                            <p className="text-zinc-400 text-sm">📱 {c.phoneNumber}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-md ${tipoClass[c.type]}`}>
                            {tipoLabel[c.type]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}