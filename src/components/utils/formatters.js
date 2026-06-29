export const formaterPrice = (precio) => {
    if(precio >= 1000) {
        return `$${(precio / 1000).toFixed(0)}k`;
    }
    return `$${precio}k`;
}
export const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = String(fecha.getFullYear()).slice(-2);
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${anio} ${horas}:${minutos} hs`;
}