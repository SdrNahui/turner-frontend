export const BASE_URL =  import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8080`;
export function authHeaders(){
    const token = localStorage.getItem('token');
    return {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
    };
}
export async function handleResponse(res){
    if(res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = "/";
        throw new Error("Sesión expirada. Iniciá sesión nuevamente");
    }
    if(!res.ok){
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || `Error ${res.status}`);
    }
    return res.json();
}
