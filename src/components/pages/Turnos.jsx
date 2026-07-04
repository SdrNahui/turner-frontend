import { useAppointments } from '../hooks/useAppointments.js';
import { useClients } from '../hooks/useClients.js';
import { useServices } from '../hooks/useServices.js';
import {
    cancelAppointment,
    confirmAppointment,
    createAppointment,
    finishedAppointment,
    reorganizeAppointment
} from '../api/appointments.js';
import { useState } from 'react';
import {formatearFecha} from "../utils/formatters.js";
import {useToast} from "../hooks/useToast.js";
import {Toast} from "../ui/Toast.jsx";
import {confirmDelete, confirmDialog} from "../hooks/alerts.js";

export function Turnos({role}) {
    const { appointments, loading, refetch} = useAppointments();
    const { clients, refetch: refetchClients } = useClients();
    const { services} = useServices();
    const {toast, showToast, hideToast} = useToast();

    const [clienteId, setClienteId] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [servicio, setServicio] = useState('');

    const handleClienteChange = (e) => {
        const id = e.target.value;
        setClienteId(id);
        if (id) {
            const cliente = clients.find(c => String(c.id) === id);
            if (cliente) {
                setNombre(cliente.name);
                setApellido(cliente.lastName);
                setTelefono(cliente.phoneNumber);
            }
        } else {
            setNombre('');
            setApellido('');
            setTelefono('');
        }
    }

    const handleCrear = async () => {
        if (!servicio) {
            showToast("Seleccione un servicio", 'warning');
            return;
        }
        const body = { offeredId: parseInt(servicio) };
        if (clienteId) {
            body.clientId = parseInt(clienteId);
        } else {
            if (!nombre || !apellido || !telefono) {
                showToast("Complete nombre, apellido y teléfono", 'warning');
                return;
            }
            body.clientName = nombre;
            body.clientLastName = apellido;
            body.phoneNumber = telefono;
        }
        try {
            await createAppointment(body);
            showToast("Turno creado");
            refetch();
            refetchClients();
            setNombre('');
            setApellido('');
            setTelefono('');
            setServicio('');
            setClienteId('');
        } catch (e) {
            showToast(e.message, 'error');
        }
    }

    const handleConfirmar = async (id, fechaInput, hasAtHome) => {
        if (!fechaInput) {
            showToast("Selecciona una fecha");
            return;
        }
        try {
            await confirmAppointment(id, { startDate: fechaInput, hasAtHome });
            showToast("Turno confirmado");
            refetch();
        } catch (e) {
            showToast(e.message, 'error');
        }
    }

    const handleFinalizar = async (id, clientName) => {
        // Reemplazo de confirm nativo
        const { isConfirmed } = await confirmDialog({
            title: "Finalizar Turno",
            text: `¿Deseas marcar como finalizado el turno de ${clientName}?`,
            confirmText: "Sí, finalizar",
            icon: "info"
        });
        if (!isConfirmed) return;
        try {
            await finishedAppointment(id, true);
            showToast("Turno finalizado");
            refetch();
        } catch (e) {
            showToast(e.message, 'error');
        }
    }

    const handleCancelar = async (id, clientName) => {
        // Reemplazo por confirmDelete (que ya tiene el botón rojo)
        const { isConfirmed } = await confirmDelete(
            "¿Cancelar turno?",
            `El turno de ${clientName} será cancelado definitivamente.`
        );

        if (!isConfirmed) return;
        try {
            await cancelAppointment(id, true);
            showToast("Turno cancelado");
            refetch(); // Añadido refetch que faltaba
        } catch (e) {
            showToast(e.message, 'error');
        }
    }

    const handleReorganizar = async(id, newStart) => {
        if(!newStart) {
            showToast("Seleecione una fecha", 'warning');
            return;
        }
        try {
            await reorganizeAppointment(id, newStart);
            showToast("Turno reorganizado");
            refetch();
        } catch (e){
            showToast(e.message, 'error');
        }
    }

    if (loading) return <div className="p-4 text-zinc-400">Cargando...</div>

    const estados = { PENDING: "Pendiente", RESERVED: "Reservado", CANCELLED: "Cancelado", FINISHED: "Finalizado"};
    const tipos = { NEW: "Nuevo", FREQUENT: "Frecuente", REGULAR: "Regular" };
    const borderColor = { PENDING: "border-yellow-400", RESERVED: "border-blue-400", CANCELLED: "border-red-400",
        FINISHED: "border-green-400"};

    return (
        <div className="p-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast}/>}
            {/* Formulario */}
            {role === 'ADMIN' && (
                <div className="bg-zinc-800 rounded-xl p-4 mb-4">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3">Crear turno</p>
                    <div className="flex flex-col md:flex-row gap-2 md:items-center">
                        <select value={clienteId} onChange={handleClienteChange}
                                className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm flex-1">
                            <option value="">-- Cliente nuevo --</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name} {c.lastName}</option>
                            ))}
                        </select>
                        <input value={nombre}
                               onChange={e => setNombre(e.target.value)}
                               disabled={!!clienteId} placeholder="Nombre"
                               className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm w-full md:w-32
                           disabled:opacity-50"/>
                        <input value={apellido}
                               onChange={e => setApellido(e.target.value)}
                               disabled={!!clienteId} placeholder="Apellido"
                               className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm w-full md:w-32
                           disabled:opacity-50"/>
                        <input value={telefono}
                               onChange={e => setTelefono(e.target.value)}
                               disabled={!!clienteId} placeholder="Teléfono"
                               className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm w-full md:w-32
                           disabled:opacity-50"/>
                        <select value={servicio}
                                onChange={e => setServicio(e.target.value)}
                                className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm flex-1">
                            <option value="">-- Masaje --</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.serviceName}</option>
                            ))}
                        </select>
                        <button onClick={handleCrear}
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm
                            transition-colors whitespace-nowrap w-full md:w-auto">Crear</button>
                    </div>
                </div>
            )}

            {/* Lista de turnos */}
            <div className="flex flex-col gap-2">
                {appointments
                    .sort((a, b) => {
                        if (a.status === "CANCELLED") return 1;
                        if (b.status === "CANCELLED") return -1;
                        if (!a.startDate) return -1;
                        if (!b.startDate) return 1;
                        return new Date(b.startDate) - new Date(a.startDate);
                    })
                    .map((a, i) => {
                        const fecha = a.startDate ? formatearFecha(a.startDate) : "Sin fecha";
                        return (
                            <div key={i} className={`bg-zinc-800 rounded-xl p-4 border-l-4 ${borderColor[a.status]}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white font-medium">
                                            {a.clientName} {a.clientLastName}
                                            <span className="text-zinc-400 text-xs ml-1">({tipos[a.clientType]})</span>
                                        </p>
                                        <p className="text-zinc-400 text-sm">{a.offeredName}</p>
                                        <p className="text-zinc-500 text-xs">{fecha}</p>
                                    </div>
                                    <span className="text-xs text-zinc-400">{estados[a.status]}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:items-center">
                                    {role === 'ADMIN' && a.status === "PENDING" && (
                                        <>
                                            <input type="datetime-local"
                                                   className="bg-zinc-700 text-zinc-300 rounded-lg px-2 py-1 text-xs
                                                    w-full sm:flex-1"
                                                   id={`fecha-${a.id}`}/>
                                            <label className="text-zinc-300 text-xs flex items-center gap-1">
                                                <input type="checkbox" id={`domicilio-${a.id}`}/> Domicilio </label>
                                            <button onClick={() => {
                                                const f = document.getElementById(`fecha-${a.id}`).value;
                                                const h = document
                                                    .getElementById(`domicilio-${a.id}`).checked;
                                                handleConfirmar(a.id, f, h);
                                            }} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3
                                            py-1 text-xs w-full sm:w-auto">Confirmar</button>
                                        </>
                                    )}
                                    {role === 'ADMIN' && a.status === "RESERVED" && (
                                        <>
                                            <input type="datetime-local"
                                                   className="bg-zinc-700 text-zinc-300 rounded-lg px-2 py-1 text-xs
                                                   w-full sm:flex-1"
                                                   id={`reorganize-${a.id}`}/>
                                            <button onClick={() => {
                                                const f =
                                                    document.getElementById(`reorganize-${a.id}`).value;
                                                handleReorganizar(a.id, f);
                                            }} className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg
                                            px-3 py-1 text-xs w-full sm:w-auto">Reorganizar</button>
                                            <button onClick={() => handleFinalizar(a.id, a.clientName)}
                                                    className="bg-green-600 hover:bg-green-700 text-white
                                                    rounded-lg px-3 py-1 text-xs w-full sm:w-auto">Finalizar</button>
                                        </>
                                    )}
                                    {role === 'ADMIN' && (a.status === "PENDING" || a.status === "RESERVED") && (
                                        <button onClick={() => handleCancelar(a.id, a.clientName)}
                                                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3
                                                py-1 text-xs w-full sm:w-auto">Cancelar</button>
                                    )}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}