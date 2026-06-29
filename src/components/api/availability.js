import {authHeaders, BASE_URL, handleResponse} from "./config.js";


export async function getAvailability(){
    const res = await fetch(`${BASE_URL}/turner/availabilities?ts=${new Date().getTime()}`, {
        headers: authHeaders()
    });
    return handleResponse(res);
}
export async function createAvailability(body){
    const res = await fetch(`${BASE_URL}/turner/availabilities/create`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error("Añada un bloque de disponibilidad", error);
    }
    return handleResponse(res);
}
export async function updateAvailability(id, body) {
    console.log("Que mandan chat(body): ", body)
    const res = await fetch(`${BASE_URL}/turner/availabilities/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    return handleResponse(res);
}

export async function deleteAvailability(id) {
    const res = await fetch(`${BASE_URL}/turner/availabilities/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
    if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || `Error ${res.status}`);
    }
}
export async function forceUpdateAvailability(id, body) {
    const res = await fetch(`${BASE_URL}/turner/availabilities/${id}/force`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    return handleResponse(res);
}

