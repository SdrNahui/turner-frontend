import {authHeaders, BASE_URL, handleResponse} from "./config.js";
import {showRateLimitError} from "../hooks/alerts.js";

export async function login(body){
    const res = await fetch(`${BASE_URL}/turner/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });
    if(res.status === 429){
        const data = await res.json();
        showRateLimitError(data.message);
        throw new Error("Límite de intentos excedido");
    }
    if(!res.ok) throw new Error("Credenciales incorrectas");
    return handleResponse(res);
}
export async function changePassword(body) {
    const res = await fetch(`${BASE_URL}/turner/auth/change-password`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Contraseña actual incorrecta');
    return res.text();
}

//1..105 | ForEach-Object {
// >>     try {
// >>         $res = Invoke-WebRequest -Method Post -Uri "http://localhost:8080/turner/auth/login" -ErrorAction Stop
// >>         $status = $res.StatusCode
// >>     } catch {
// >>         # Si el servidor responde con error (401, 429), capturamos el status acá
// >>         $status = [int]$_.Exception.Response.StatusCode
// >>     }
// >>     Write-Host "Intento $_ : Status $status"
// >> }