// Datos locales temporales mientras se sincronizan con Supabase
let appData = {
    animales: [], lotes: [], pesos: [], vacunas: [], alimentaciones: [],
    nacimientos: [], notas: [], climas: []
};

async function cargarTabla(tabla) {
    const { data, error } = await supabase.from(tabla).select('*').eq('user_id', usuario.id);
    if (!error) appData[tabla] = data;
    return appData[tabla];
}

async function cargarTodosLosDatos() {
    await Promise.all([
        cargarTabla('animales'),
        cargarTabla('lotes'),
        cargarTabla('pesos'),
        cargarTabla('vacunas'),
        cargarTabla('alimentaciones'),
        cargarTabla('nacimientos'),
        cargarTabla('notas'),
        cargarTabla('climas')
    ]);
}

async function guardarEnTabla(tabla, objeto) {
    objeto.user_id = usuario.id;
    if (objeto.id) {
        const { error } = await supabase.from(tabla).update(objeto).eq('id', objeto.id);
        if (error) console.error(error);
    } else {
        const { data, error } = await supabase.from(tabla).insert(objeto).select().single();
        if (!error && data) objeto.id = data.id;
    }
}

async function eliminarDeTabla(tabla, id) {
    await supabase.from(tabla).delete().eq('id', id);
    appData[tabla] = appData[tabla].filter(item => item.id !== id);
}

// Utilidad toast
function mostrarToast(mensaje, error = false) {
    const t = document.createElement('div');
    t.className = `toast ${error ? 'error' : ''}`;
    t.textContent = mensaje;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}