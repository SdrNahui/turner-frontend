import {useEffect, useState} from "react";
import {generateReporte} from "../api/appointments.js";
import {formaterPrice} from "../utils/formatters.js";

export function ReportDay({ diaSeleccionado}){
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const pad = n => String(n).padStart(2, "0");
    const y = diaSeleccionado.getFullYear();
    const m = pad(diaSeleccionado.getMonth() + 1);
    const d = pad(diaSeleccionado.getDate());
    const start = `${y}-${m}-${d}T00:00:00`;
    const end = `${y}-${m}-${d}T23:59:59`;

    useEffect(() => {
        const loadReport = async() =>{
            try {
                const data = await generateReporte({ start, end });
                setReport(data);
            } catch(e){
                console.log("Error: ", e.message)
                setError(e.message)
            } finally {
                setLoading(false);
            }
        }
        loadReport();
    }, [diaSeleccionado]);
    if(loading) return <div className="text-zinc-400 text-sm">Cargando reporte...</div>
    return (
        <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Ingresos brutos</p>
                <p className="text-white text-xl font-medium">{formaterPrice(report.totalGross)}</p>
            </div>
            <div className="bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Comisión</p>
                <p className="text-yellow-400 text-xl font-medium">{formaterPrice(report.totalCommission)}</p>
            </div>
            <div className="bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Neto</p>
                <p className="text-green-400 text-xl font-medium">{formaterPrice(report.totalNet)}</p>
            </div>
            <div className="bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Finalizados</p>
                <p className="text-white text-xl font-medium">{report.totalAppointment}</p>
            </div>
        </div>
    )
}