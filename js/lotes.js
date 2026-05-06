function renderLotes() {
    const tbody = document.getElementById('tablaLotes');
    if (appData.lotes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Sin lotes</td></tr>';
        return;
    }
    tbody.innerHTML = appData.lotes.map(l => {
        const cant = appData.animales.filter(a => a.lote_id === l.id).length;
        return `<tr>
            <td><strong>${l.nombre}</strong></td><td>${l.descripcion || ''}</td><td>${l.ubicacion || ''}</td><td>${cant}</td>
            <td>
                <button class="btn btn-sm btn-lote" onclick="gestionarLote(${l.id})">🐄</button>
                <button class="btn btn-sm btn-warning" onclick="editarLote(${l.id})">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarLote(${l.id})">🗑️</button>
            </td>
        </tr>`;
    }).join('');
}

function abrirModalLote(lote = null) {
    const edit = !!lote;
    abrirModal(`<h3>${edit ? 'Editar' : 'Nuevo'} Lote</h3>
        <input type="hidden" id="loteId" value="${edit ? lote.id : ''}">
        <div class="form-group"><label>Nombre</label><input id="loteNombre" value="${edit ? lote.nombre : ''}"></div>
        <div class="form-group"><label>Descripción</label><input id="loteDesc" value="${edit ? lote.descripcion || '' : ''}"></div>
        <div class="form-group"><label>Ubicación</label><input id="loteUbi" value="${edit ? lote.ubicacion || '' : ''}"></div>
        <div class="modal-acciones"><button class="btn btn-cancel" onclick="cerrarModal()">Cancelar</button><button class="btn" id="guardarLoteBtn">Guardar</button></div>`);
    document.getElementById('guardarLoteBtn').onclick = async () => {
        const nombre = document.getElementById('loteNombre').value.trim();
        if (!nombre) return mostrarToast('Nombre requerido', true);
        const obj = {
            id: edit ? lote.id : undefined,
            nombre,
            descripcion: document.getElementById('loteDesc').value.trim(),
            ubicacion: document.getElementById('loteUbi').value.trim()
        };
        await guardarEnTabla('lotes', obj);
        await cargarTabla('lotes');
        cerrarModal();
        renderLotes();
        renderDashboard();
    };
}

async function gestionarLote(id) {
    const lote = appData.lotes.find(l => l.id === id);
    if (!lote) return;
    const enLote = appData.animales.filter(a => a.lote_id === id);
    const fuera = appData.animales.filter(a => a.lote_id !== id);
    abrirModal(`<h3>Gestionar ${lote.nombre}</h3>
        <p><strong>Animales en lote:</strong></p>
        ${enLote.map(a => `<div style="display:flex;justify-content:space-between;padding:6px 0;">${a.nombre} <button class="btn btn-sm btn-danger" onclick="quitarDeLote(${a.id})">Quitar</button></div>`).join('') || '<p>Vacío</p>'}
        <hr>
        <div class="form-group"><label>Agregar animal</label><select id="addAnimalLote">${fuera.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('')}</select></div>
        <div class="modal-acciones"><button class="btn btn-cancel" onclick="cerrarModal()">Cerrar</button><button class="btn" id="agregarAlLoteBtn">Agregar</button></div>`);
    document.getElementById('agregarAlLoteBtn').onclick = async () => {
        const animalId = parseInt(document.getElementById('addAnimalLote').value);
        const animal = appData.animales.find(a => a.id === animalId);
        if (animal) {
            animal.lote_id = id;
            await guardarEnTabla('animales', animal);
            await cargarTabla('animales');
            cerrarModal();
            renderLotes();
            renderInventario();
        }
    };
}

async function quitarDeLote(animalId) {
    const animal = appData.animales.find(a => a.id === animalId);
    if (animal) {
        animal.lote_id = null;
        await guardarEnTabla('animales', animal);
        await cargarTabla('animales');
        renderLotes();
        renderInventario();
        mostrarToast('Animal removido del lote');
    }
}

async function editarLote(id) {
    const lote = appData.lotes.find(l => l.id === id);
    if (lote) abrirModalLote(lote);
}

async function eliminarLote(id) {
    if (!confirm('¿Eliminar lote? Los animales quedarán sin lote.')) return;
    const animales = appData.animales.filter(a => a.lote_id === id);
    for (let a of animales) {
        a.lote_id = null;
        await guardarEnTabla('animales', a);
    }
    await eliminarDeTabla('lotes', id);
    await cargarTabla('animales');
    await cargarTabla('lotes');
    renderLotes();
    renderInventario();
    renderDashboard();
}

document.getElementById('btnAgregarLote').onclick = () => abrirModalLote();