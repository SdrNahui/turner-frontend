import {useEffect, useState} from "react";
import {getAvailability} from "../api/availability.js";

export function useAvailability(){
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const data = await getAvailability();
            console.log("Availability data: ", data);
            setAvailability(data)
        } catch (e){
            console.log("Error", e.message)
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    return {availability, setAvailability, loading, error, refetch: fetchData}
}