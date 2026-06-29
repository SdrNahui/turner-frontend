import {authHeaders, BASE_URL, handleResponse} from "./config.js";

export async function getAppointments(){
    const res = await fetch(`${BASE_URL}/turner/appointments?ts=${new Date().getTime()}`, {
        headers: authHeaders()
    });
    return handleResponse(res);
}
export async function getAppointmentById(id){
    const res = await  fetch(`${BASE_URL}/turner/appointments/${id}`, {
        headers: authHeaders()
    });
    return handleResponse(res);
}
export async function createAppointment(body) {
    const res = await  fetch(`${BASE_URL}/turner/appointments/create`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    return handleResponse(res);
}
export async function confirmAppointment(id, body){
    const res = await fetch(`${BASE_URL}/turner/appointments/confirm/${id}`,{
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body)
    })
    return handleResponse(res);
}
export async function finishedAppointment(id, confirm){
    const res = await fetch(`${BASE_URL}/turner/appointments/finished/${id}?confirm=${confirm}`, {
        method: "POST",
        headers: authHeaders()
    });
    return handleResponse(res);
}
export async function cancelAppointment(id, confirm){
    const res = await fetch(`${BASE_URL}/turner/appointments/canceled/${id}?confirm=${confirm}`, {
        method: "POST",
        headers: authHeaders()
    });
    return handleResponse(res);
}
export async function generateReporte(body){
    const res = await fetch(`${BASE_URL}/turner/appointments/report`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    return handleResponse(res);
}
export async function reorganizeAppointment(id, newStart) {
    console.log("Que mandan chat(new start) ", newStart);
    const res = await fetch(`${BASE_URL}/turner/appointments/reorganize/${id}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ start: newStart + ":00"})
    });
    return handleResponse(res);
}