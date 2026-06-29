import {authHeaders, BASE_URL, handleResponse} from "./config.js";

export async function getServiceOffered(){
    const res = await fetch(`${BASE_URL}/turner/offered?ts=${new Date().getTime()}`, {
        headers: authHeaders()
    });
    return handleResponse(res);
}
export async function getServiceById(id){
    const res = await fetch(`${BASE_URL}/turner/offered/${id}`, {
        headers: authHeaders()
    });
    return handleResponse(res);
}
export async function createServiceOffered(body){
    const res = await fetch(`${BASE_URL}/turner/offered/create`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    return handleResponse(res);
}
export async function updateService(id, body) {
    console.log("Mandado body: ", body);
    const res = await fetch(`${BASE_URL}/turner/offered/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    return handleResponse(res);
}

export async function deleteService(id) {
    const res = await fetch(`${BASE_URL}/turner/offered/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
    if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || `Error ${res.status}`);
    }
}