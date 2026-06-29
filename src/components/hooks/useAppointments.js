import {useEffect, useState} from "react";
import {getAppointments} from "../api/appointments.js";

export function useAppointments(){
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async() => {
        try {
            setLoading(true);
            const data = await getAppointments();
            setAppointments(data);
        } catch (e){
            console.log("Error: ", e)
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    return {appointments, setAppointments, loading, error, refetch: fetchData}
}