import {useEffect, useState} from "react";
import {getClients} from "../api/clients.js";

export function useClients(){
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async() => {
        try {
            setLoading(true);
            const data = await getClients();
            setClients(data);
        } catch (e){
            console.log("Error", e)
            setError(e.message);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    return {clients, setClients, loading, error, refetch: fetchData}
}