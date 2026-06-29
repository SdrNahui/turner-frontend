import {useEffect, useState} from "react";
import {getServiceOffered} from "../api/services.js";

export function useServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchData = async() => {
        try {
            setLoading(true);
            const data = await getServiceOffered();
            setServices(data);
        } catch (e){
            console.log("Error: ", e)
            setError(e.message);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchData();
    },[]);
    return {services, setServices, loading, error, refetch: fetchData}
}