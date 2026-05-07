// Notas
function renderNotas() {
    const tbody = document.getElementById('tablaNotas');
    const ordenadas = [...appData.notas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    tbody.innerHTML = ordenadas.length === 0 ? '<tr><td colspan="4" class="text-center">Sin notas</td></tr>' :
        ordenadas.map(n => `<tr><td>${n.fecha}</td><td>${n.categoria}</td><td>${n.texto}</td><td><button class="btn btn-sm btn-danger" onclick="eliminarNota(${n.id})">🗑️</button></td></tr>`).join('');
}
async function eliminarNota(id) { await eliminarDeTabla('notas', id); await cargarTabla('notas'); renderNotas(); }
document.getElementById('btnAgregarNota').onclick = () => {
    abrirModal(`<h3>📝 Nueva Nota</h3>
        <input type="date" id="notaFecha" value="${new Date().toISOString().split('T')[0]}">
        <select id="notaCat"><option>General</option><option>Sanidad</option><option>Clima</option><option>Alimentación</option></select>
        <textarea id="notaTexto" rows="3" placeholder="Escribe..."></textarea>
        <div class="modal-acciones"><button class="btn btn-cancel" onclick="cerrarModal()">Cancelar</button><button class="btn" id="guardarNotaBtn">Guardar</button></div>`);
    document.getElementById('guardarNotaBtn').onclick = async () => {
        const texto = document.getElementById('notaTexto').value.trim();
        if (!texto) return mostrarToast('Escribe algo', true);
        await guardarEnTabla('notas', { fecha: document.getElementById('notaFecha').value, categoria: document.getElementById('notaCat').value, texto });
        await cargarTabla('notas');
        cerrarModal();
        renderNotas();
    };
};

// Clima
function renderClimas() {
    const tbody = document.getElementById('tablaClima');
    const ordenados = [...appData.climas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    tbody.innerHTML = ordenados.length === 0 ? '<tr><td colspan="5" class="text-center">Sin registros</td></tr>' :
        ordenados.map(c => `<tr><td>${c.fecha}</td><td>${c.temperatura}°C</td><td>${c.humedad}%</td><td>${c.condicion}</td><td><button class="btn btn-sm btn-danger" onclick="eliminarClima(${c.id})">🗑️</button></td></tr>`).join('');
}
async function eliminarClima(id) { await eliminarDeTabla('climas', id); await cargarTabla('climas'); renderClimas(); }
document.getElementById('btnRegistrarClima').onclick = () => {
    abrirModal(`<h3>🌤️ Registro de Clima</h3>
        <input type="date" id="climaFecha" value="${new Date().toISOString().split('T')[0]}">
        <input type="number" id="climaTemp" placeholder="Temperatura °C" step="0.1">
        <input type="number" id="climaHum" placeholder="Humedad %" step="0.1">
        <select id="climaCond"><option>Soleado</option><option>Nublado</option><option>Lluvia</option><option>Tormenta</option></select>
        <div class="modal-acciones"><button class="btn btn-cancel" onclick="cerrarModal()">Cancelar</button><button class="btn" id="guardarClimaBtn">Guardar</button></div>`);
    document.getElementById('guardarClimaBtn').onclick = async () => {
        const temp = parseFloat(document.getElementById('climaTemp').value);
        const hum = parseFloat(document.getElementById('climaHum').value);
        if (isNaN(temp) || isNaN(hum)) return mostrarToast('Valores numéricos', true);
        await guardarEnTabla('climas', { fecha: document.getElementById('climaFecha').value, temperatura: temp, humedad: hum, condicion: document.getElementById('climaCond').value });
        await cargarTabla('climas');
        cerrarModal();
        renderClimas();
    };
};