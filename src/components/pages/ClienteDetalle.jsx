import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteClient, getClientById, updateClient} from "../api/clients.js";
import {useToast} from "../hooks/useToast.js";
import {Toast} from "../ui/Toast.jsx";
import {confirmDelete} from "../hooks/alerts.js";

export function ClienteDetalle({role}) {
    const {id} = useParams();
    const {toast, showToast, hideToast} = useToast();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    useEffect(() => {
        getClientById(id).then(data => {
            setCliente(data);
            setNombre(data.name);
            setApellido(data.lastName);
            setTelefono(data.phoneNumber);
        }).catch(e => showToast(e.message, 'error')).finally(() => setLoading(false));

    }, [id]);
    const handleEditar = async () => {
        try {
            await updateClient(id, {clientName: nombre, lastName: apellido, phoneNumber: telefono})
            showToast("Cliente actualizado");
            setEditando(false);
            getClientById(id).then(setCliente);
        } catch (e){
            showToast(e.message, 'error');
        }
    }
    const handleEliminar = async () => {
        const { isConfirmed } = await confirmDelete(
            "¿Dar de baja cliente?",
            `¿Seguro que quiere dar de baja a ${cliente.name} ${cliente.lastName}?`
        );
        if (!isConfirmed) return;
        try {
            await deleteClient(id);
            showToast("Cliente eliminado");
            navigate('/clientes');
        } catch (e) {
            showToast(e.message, 'error');
        }
    }
    const tipoClass = {NEW: "bg-blue-900 text-blue-300",
        REGULAR: "bg-orange-900 text-orange-300", FREQUENT: "bg-green-900 text-green-300"};
    const tipoLabel = {NEW: "Nuevo", REGULAR: "Regular", FREQUENT: "Frecuente"};
    if(loading) return <div className="p-4 text-zinc-400 ">Cargando...</div>
    if(!cliente) return <div className="p-4 text-zinc-400 ">Cliente no encontrado</div>
    return (
        <div className="p-4 max-w-lg">
            <button onClick={() => navigate('/clientes')}
                    className="text-zinc-400 hover:text-white text-sm mb-4 flex items-center gap-1">
                ← Volver
            </button>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast}/>}
            <div className="bg-zinc-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-white text-xl font-medium">{cliente.name} {cliente.lastName}</h2>
                        <p className="text-zinc-400 text-sm">📱 {cliente.phoneNumber}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-md ${tipoClass[cliente.type]}`}>
                        {tipoLabel[cliente.type]}
                    </span>
                </div>
                {role === 'ADMIN' && editando ? (
                    <div className="flex flex-col gap-2 mb-4">
                        <input value={nombre} onChange={e =>
                            setNombre(e.target.value)}
                               className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm"/>
                        <input value={apellido} onChange={e =>
                            setApellido(e.target.value)}
                               className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm"/>
                        <input value={telefono} onChange={e =>
                            setTelefono(e.target.value)}
                               className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm"/>
                        <div className="flex gap-2">
                            <button onClick={handleEditar}
                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2
                                    text-sm flex-1">Guardar</button>
                            <button onClick={() => setEditando(false)}
                                    className="bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg px-4 py-2
                                    text-sm flex-1">Cancelar</button>
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