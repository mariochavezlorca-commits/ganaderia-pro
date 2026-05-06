// Pesos
function renderPesos() {
    const tbody = document.getElementById('tablaPesos');
    const ordenados = [...appData.pesos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    tbody.innerHTML = ordenados.length === 0 ? '<tr><td colspan="5" class="text-center">Sin registros</td></tr>' :
        ordenados.map(p => {
            const animal = appData.animales.find(a => a.id === p.animal_id);
            return `<tr><td>${animal ? animal.nombre : '?'}</td><td>${p.fecha}</td><td>${p.peso} kg</td><td>${p.observaciones || ''}</td><td><button class="btn btn-sm btn-danger" onclick="eliminarPeso(${p.id})">🗑️</button></td></tr>`;
        }).join('');
}
async function eliminarPeso(id) {
    await eliminarDeTabla('pesos', id);
    await cargarTabla('pesos');
    renderPesos();
}
function abrirModalPeso() {
    if (appData.animales.length === 0) { mostrarToast('Sin animales', true); return; }
    abrirModal(`<h3>Nuevo Pesaje</h3>
        <select id="pAnimal">${appData.animales.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('')}</select>
        <input type="date" id="pFecha" value="${new Date().toISOString().split('T')[0]}">
        <input type="number" id="pPeso" placeholder="kg" step="0.1">
        <input id="pObs" placeholder="Observaciones">
        <div class="modal-acciones"><button class="btn btn-cancel" onclick="cerrarModal()">Cancelar</button><button class="btn" id="guardarPesoBtn">Guardar</button></div>`);
    document.getElementById('guardarPesoBtn').onclick = async () => {
        const animalId = parseInt(document.getElementById('pAnimal').value);
        const fecha = document.getElementById('pFecha').value;
        const peso = parseFloat(document.getElementById('pPeso').value);
        if (!fecha || isNaN(peso)) { mostrarToast('Completa los datos', true); return; }
        const obj = { animal_id: animalId, fecha, peso, observaciones: document.getElementById('pObs').value };
        await guardarEnTabla('pesos', obj);
        // Actualizar peso en animal
        const animal = appData.animales.find(a => a.id === animalId);
        if (animal) {
            animal.peso = peso;
            await guardarEnTabla('animales', animal);
        }
        await cargarTabla('pesos');
        await cargarTabla('animales');
        cerrarModal();
        renderPesos();
        renderInventario();
        renderDashboard();
    };
}
document.getElementById('btnRegistrarPeso').onclick = abrirModalPeso;

// Vacunación (estructura similar)
function renderVacunas() {
    const tbody = document.getElementById('tablaVacunas');
    const ordenados = [...appData.vacunas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    tbody.innerHTML = ordenados.length === 0 ? '<tr><td colspan="6" class="text-center">Sin vacunas</td></tr>' :
        ordenados.map(v => {
            const animal = appData.animales.find(a => a.id === v.animal_id);
            return `<tr><td>${animal ? animal.nombre : '?'}</td><td>${v.fecha}</td><td>${v.vacuna}</td><td>${v.dosis || ''}</td><td>${v.proxima || ''}</td><td><button class="btn btn-sm btn-danger" onclick="eliminarVacuna(${v.id})">🗑️</button></td></tr>`;
        }).join('');
}
async function eliminarVacuna(id) { await eliminarDeTabla('vacunas', id); await cargarTabla('vacunas'); renderVacunas(); }
function abrirModalVacuna() { /* similar */ }
document.getElementById('btnRegistrarVacuna').onclick = abrirModalVacuna;

// Alimentación
function renderAlimentaciones() {
    const tbody = document.getElementById('tablaAlimentacion');
    const ordenados = [...appData.alimentaciones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    tbody.innerHTML = ordenados.length === 0 ? '<tr><td colspan="5" class="text-center">Sin registros</td></tr>' :
        ordenados.map(al => {
            const animal = appData.animales.find(a => a.id === al.animal_id);
            return `<tr><td>${animal ? animal.nombre : '?'}</td><td>${al.fecha}</td><td>${al.tipo}</td><td>${al.cantidad} kg</td><td><button class="btn btn-sm btn-danger" onclick="eliminarAlimentacion(${al.id})">🗑️</button></td></tr>`;
        }).join('');
}
async function eliminarAlimentacion(id) { await eliminarDeTabla('alimentaciones', id); await cargarTabla('alimentaciones'); renderAlimentaciones(); }
function abrirModalAlimentacion() { /* similar */ }
document.getElementById('btnRegistrarAlimentacion').onclick = abrirModalAlimentacion;