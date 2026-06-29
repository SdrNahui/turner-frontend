import {authHeaders, BASE_URL, handleResponse} from "./config.js";

export async function getClients(){
    const res = await fetch(`${BASE_URL}/turner/clients?ts=${new Date().getTime()}`, {
        headers: authHeaders()
    });
    return handleResponse(res);
}
export async function createClient(body){
    const res = await fetch(`${BASE_URL}/turner/clients/create`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    return handleResponse(res);
}
export async function getClientById(id) {
    const res = await fetch(`${BASE_URL}/turner/clients/${id}`, {
        headers: authHeaders()
    });
    return handleResponse(res);
}
export async function updateClient(id, body) {
    console.log("Mandado body: ", body);
    const res = await fetch(`${BASE_URL}/turner/clients/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    return handleResponse(res);
}

export async function deleteClient(id) {
    const res = await fetch(`${BASE_URL}/turner/clients/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
    if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || `Error ${res.status}`);
    }
}

