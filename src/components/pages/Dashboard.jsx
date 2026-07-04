import {useAppointments} from "../hooks/useAppointments.js";
import {useState} from "react";
import {useAvailability} from "../hooks/useAvailability.js";
import {ReportDay} from "../ui/ReportDay.jsx";
import {ModalDispo} from "../ui/ModalDispo.jsx";
import {createAvailability} from "../api/availability.js";
import {useToast} from "../hooks/useToast.js";
import {Toast} from "../ui/Toast.jsx";

export function Dashboard({role}){
    const {appointments, loading} = useAppointments();
    const {availability, refetch: reftechAvailability} = useAvailability();
    const {toast, showToast, hideToast} = useToast();
    const [inicio, setInicio] = useState('');
    const [fin, setFin] = useState('');
    const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());
    const [calFecha, setCalFecha] = useState(new Date());
    const [modalDispo, setModalDispo] = useState(null);
    const meses = ["Enero", "Febrero", "Marzo", "Abril","Mayo", "Junio", "Julio", "Agosto", "Septiembre",
        "Octubre", "Noviembre", "Diciembre"];
    const estadoClass = {PENDING: "text-yellow-400", RESERVED: "text-blue-400", FINISHED: "text-green-400",
        CANCELLED: "text-red-400"};
    const estados = {PENDING: "Pendiente", RESERVED: "Reservado", FINISHED: "Finalizado", CANCELLED: "Cancelado"};
    const turnosDelDia = appointments
        .filter(a => {
            if (!a.startDate || a.status === "CANCELLED") return false;
            const fd = new Date(a.startDate);
            return fd.getDate() === diaSeleccionado.getDate() &&
                fd.getMonth() === diaSeleccionado.getMonth() &&
                fd.getFullYear() === diaSeleccionado.getFullYear();
        })
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    const handleCrear = async()=>{
        try {
            await createAvailability({startDate: inicio, endDate: fin})
            showToast("Disponibilidad añadida correctamente")
            reftechAvailability();
            setInicio('');
            setFin('');
        } catch (e){
            showToast(e.message, 'error')
        }
    }

    if(loading) return <div className="p-4 text-zinc-400">Cargando...</div>

    return (
        <div className="p-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast}/>}
            {role === 'ADMIN' && (
                <div className="bg-zinc-800 rounded-xl p-3 mb-4 max-w-sm">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Añadir Disponibilidad</p>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-zinc-400 text-xs w-16">Inicio</p>
                            <input type="datetime-local" value={inicio}
                                   onChange={e => setInicio(e.target.value)}
                                   className="bg-zinc-700 text-zinc-300 rounded-lg px-2 py-1 text-xs flex-1"/>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-zinc-400 text-xs w-16">Fin</p>
                            <input type="datetime-local" value={fin}
                                   onChange={e => setFin(e.target.value)}
                                   className="bg-zinc-700 text-zinc-300 rounded-lg px-2 py-1 text-xs flex-1"/>
                        </div>
                        <button onClick={handleCrear}
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-1 text-xs
                            transition-colors">
                            Añadir
                        </button>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Disponibilidad */}
                <div className="bg-zinc-800 rounded-xl p-4">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3">Disponibilidad</p>
                    <div className="flex flex-col gap-2">
                        {availability
                            .filter(a => {
                                const fecha = new Date(a.startDate);
                                const hoy = new Date();
                                const lunes = new Date(hoy);
                                const dia = hoy.getDay();
                                lunes.setDate(hoy.getDate() - (dia === 0 ? -1 : dia - 1));
                                lunes.setHours(0, 0, 0, 0);
                                const proximoDomingo = new Date(lunes);
                                proximoDomingo.setDate(lunes.getDate() + 12);
                                proximoDomingo.setHours(23, 59, 59, 999);
                                return fecha >= lunes && fecha <= proximoDomingo;
                            })
                            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                            .map((a, i) => {
                                const dias = ["Domingo", "Lunes", "Martes", "Miércoles",
                                    "Jueves", "Viernes", "Sábado"];
                                const inicio = new Date(a.startDate);
                                const fin = new Date(a.endDate);
                                const hi = String(inicio.getHours()).padStart(2,"0") + ":" +
                                    String(inicio.getMinutes()).padStart(2,"0");
                                const hf = String(fin.getHours()).padStart(2,"0") + ":" +
                                    String(fin.getMinutes()).padStart(2,"0");
                                return (
                                    <div key={i} className="flex items-center gap-2 text-sm py-2 border-b
                                    border-zinc-700 last:border-0">
                                        <span className="text-white font-medium flex-1">
                                            {dias[inicio.getDay()]} {inicio.getDate()}/
                                            {String(inicio.getMonth()+1).padStart(2,"0")}
                                        </span>
                                        <span className="text-zinc-400">{hi} — {hf} hs</span>
                                        {role === 'ADMIN' && (
                                            <button onClick={() => setModalDispo(a)}
                                                    className="text-zinc-400 hover:text-white text-xs">✏️</button>
                                        )}
                                    </div>
                                )
                            })
                        }
                        {availability.length === 0 &&
                            <p className="text-zinc-500 text-sm">Sin disponibilidad esta semana</p>
                        }
                    </div>
                </div>

                {/* Calendario */}
                <div className="bg-zinc-800 rounded-xl p-4">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3">Calendario</p>
                    <div className="flex justify-between items-center mb-3">
                        <button onClick={() =>
                            setCalFecha(new Date(calFecha.getFullYear(), calFecha.getMonth() - 1, 1))}
                                className="text-zinc-400 hover:text-white px-2 text-xl">‹</button>
                        <span className="text-white text-sm font-medium">
                            {meses[calFecha.getMonth()]} {calFecha.getFullYear()}
                        </span>
                        <button onClick={() =>
                            setCalFecha(new Date(calFecha.getFullYear(), calFecha.getMonth() + 1, 1))}
                                className="text-zinc-400 hover:text-white px-2 text-xl">›</button>
                    </div>
                    <div className="grid grid-cols-7 text-center mb-1">
                        {["L","M","M","J","V","S","D"].map((dia, i) => (
                            <span key={i} className="text-zinc-500 text-xs py-1">{dia}</span>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 text-center">
                        {Array.from({ length: (() => {
                                const offset = new Date(calFecha.getFullYear(), calFecha.getMonth(), 1)
                                    .getDay() - 1;
                                return offset < 0 ? 6 : offset;
                            })() }).map((_, i) => <span key={`empty-${i}`} />)}
                        {Array.from({ length: new Date(calFecha.getFullYear(),
                                calFecha.getMonth() + 1, 0).getDate() }).map((_, i) => {
                            const dia = i + 1;
                            const estaFecha = new Date(calFecha.getFullYear(), calFecha.getMonth(), dia);
                            const esHoy = estaFecha.toDateString() === new Date().toDateString();
                            const esSeleccionado = estaFecha.toDateString() === diaSeleccionado.toDateString();
                            const tieneTurno = appointments.some(a => {
                                if (!a.startDate || a.status === "CANCELLED") return false;
                                const fd = new Date(a.startDate);
                                return fd.getDate() === dia &&
                                    fd.getMonth() === calFecha.getMonth() &&
                                    fd.getFullYear() === calFecha.getFullYear();
                            });
                            return (
                                <button
                                    key={dia}
                                    onClick={() => setDiaSeleccionado(estaFecha)}
                                    className={`relative aspect-square text-xs rounded-full transition-colors
                                        ${esSeleccionado ? 'bg-blue-500 text-white' : ''}
                                        ${esHoy && !esSeleccionado ? 'text-blue-400 font-bold' : 'text-zinc-300'}
                                        hover:bg-zinc-700`}>{dia}{tieneTurno && !esSeleccionado &&
                                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1
                                        bg-blue-400 rounded-full"/>
                                }
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Turnos del día */}
            <div className="bg-zinc-800 rounded-xl p-4 mt-4">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3">
                    Turnos — {diaSeleccionado.toLocaleDateString("es-AR",
                    {weekday: "long", day: "numeric", month: "long"})}
                </p>
                <div>
                    {turnosDelDia.map((a, i) => {
                        const hora = new Date(a.startDate);
                        const fueraDeDisponibilidad = a.status === "RESERVED" && !availability.some(av => {
                            const avStart = new Date(av.startDate);
                            const avEnd = new Date(av.endDate);
                            const turnoStart = new Date(a.startDate);
                            const turnoEnd = new Date(a.endDate);
                            return turnoStart >= avStart && turnoEnd <= avEnd;
                        });
                        return (
                            <div key={i} className="flex items-center gap-3 py-2 border-b
                            border-zinc-700 bg-zinc-700 rounded-lg mb-1 px-2 last:mb-0">
                                <span className="text-zinc-400 text-sm w-16">
                                    {String(hora.getHours()).padStart(2,"0")}:
                                    {String(hora.getMinutes()).padStart(2,"0")} hs
                                </span>
                                <div className="flex-1">
                                    <p className="text-white text-sm font-medium">
                                        {a.clientName} {a.clientLastName}</p>
                                    <p className="text-zinc-400 text-xs">{a.offeredName}</p>
                                    {fueraDeDisponibilidad && (
                                        <span className="text-red-400 text-xs">⚠️ Requiere cambio de horario</span>
                                    )}
                                </div>
                                <span className={`text-xs font-medium ${estadoClass[a.status]}`}>
                                    {estados[a.status]}</span>
                            </div>
                        )
                    })}
                    {turnosDelDia.length === 0 &&
                        <p className="text-zinc-500 text-sm">Sin turnos para este día</p>
                    }
                </div>
            </div>
            {role === 'ADMIN' && <ReportDay diaSeleccionado={diaSeleccionado}/>}
            {modalDispo && (
                <ModalDispo bloque={modalDispo} onClose={() => setModalDispo(null)}
                            onRefresh={reftechAvailability}/>
            )}
        </div>
    )
}