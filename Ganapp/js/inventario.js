const porPagina = 20;

function animalesFiltrados() {
    const nombre = document.getElementById('buscarNombre').value.toLowerCase().trim();
    const cat = document.getElementById('filtroCategoria').value;
    const est = document.getElementById('filtroEstado').value;
    return appData.animales.filter(a => {
        if (nombre && !a.nombre.toLowerCase().includes(nombre)) return false;
        if (cat !== 'todas' && a.categoria !== cat) return false;
        if (est !== 'todos' && a.estado !== est) return false;
        return true;
    });
}

function renderInventario() {
    const filtrados = animalesFiltrados();
    const totalPaginas = Math.ceil(filtrados.length / porPagina) || 1;
    if (app.paginaActual > totalPaginas) app.paginaActual = totalPaginas;
    const inicio = (app.paginaActual - 1) * porPagina;
    const pagina = filtrados.slice(inicio, inicio + porPagina);
    document.getElementById('tablaInventario').innerHTML = pagina.map(a => {
        const lote = appData.lotes.find(l => l.id === a.lote_id);
        const badge = a.estado === 'saludable' ? 'badge-ok' : (a.estado === 'critico' ? 'badge-red' : 'badge-warn');
        return `<tr>
            <td>#${a.id}</td><td><strong>${a.nombre}</strong></td><td>${a.categoria || ''}</td><td>${a.raza || ''}</td>
            <td>${a.peso || '—'} kg</td><td><span class="badge ${badge}">${a.estado}</span></td><td>${lote ? lote.nombre : '—'}</td>
            <td><button class="btn btn-sm btn-warning" onclick="editarAnimal(${a.id})">✏️</button><button class="btn btn-sm btn-danger" onclick="eliminarAnimal(${a.id})">🗑️</button></td>
        </tr>`;
    }).join('');
    document.getElementById('paginadorInventario').innerHTML = `
        <button ${app.paginaActual === 1 ? 'disabled' : ''} onclick="app.cambiarPaginaInv(-1)">◀</button>
        <span>Pág. ${app.paginaActual} / ${totalPaginas} (${filtrados.length})</span>
        <button ${app.paginaActual === totalPaginas ? 'disabled' : ''} onclick="app.cambiarPaginaInv(1)">▶</button>
    `;
}

document.getElementById('buscarNombre').addEventListener('input', () => { app.paginaActual = 1; renderInventario(); });
document.getElementById('filtroCategoria').addEventListener('change', () => { app.paginaActual = 1; renderInventario(); });
document.getElementById('filtroEstado').addEventListener('change', () => { app.paginaActual = 1; renderInventario(); });

// Modal agregar/editar animal
function abrirModalAnimal(animal = null) {
    const edit = !!animal;
    const lotesOpt = appData.lotes.map(l => `<option value="${l.id}" ${animal && animal.lote_id === l.id ? 'selected' : ''}>${l.nombre}</option>`).join('');
    abrirModal(`<h3>${edit ? '✏️ Editar' : '➕ Nuevo'} Animal</h3>
        <input type="hidden" id="animId" value="${edit ? animal.id : ''}">
        <div class="form-group"><label>Nombre</label><input id="animNombre" value="${edit ? animal.nombre : ''}"></div>
        <div class="form-group"><label>Categoría</label><select id="animCat">
            <option value="vaca" ${edit && animal.categoria === 'vaca' ? 'selected' : ''}>Vaca</option>
            <option value="toro" ${edit && animal.categoria === 'toro' ? 'selected' : ''}>Toro</option>
            <option value="cria" ${edit && animal.categoria === 'cria' ? 'selected' : ''}>Cría</option>
            <option value="novillo" ${edit && animal.categoria === 'novillo' ? 'selected' : ''}>Novillo</option>
        </select></div>
        <div class="form-group"><label>Raza</label><input id="animRaza" value="${edit ? animal.raza || '' : ''}"></div>
        <div class="form-group"><label>Edad</label><input type="number" id="animEdad" value="${edit ? animal.edad || '' : ''}"></div>
        <div class="form-group"><label>Peso (kg)</label><input type="number" id="animPeso" value="${edit ? animal.peso || '' : ''}"></div>
        <div class="form-group"><label>Estado</label><select id="animEstado">
            <option value="saludable" ${edit && animal.estado === 'saludable' ? 'selected' : ''}>Saludable</option>
            <option value="atencion" ${edit && animal.estado === 'atencion' ? 'selected' : ''}>Atención</option>
            <option value="critico" ${edit && animal.estado === 'critico' ? 'selected' : ''}>Crítico</option>
        </select></div>
        <div class="form-group"><label>Lote</label><select id="animLote"><option value="">Sin lote</option>${lotesOpt}</select></div>
        <div class="modal-acciones"><button class="btn btn-cancel" onclick="cerrarModal()">Cancelar</button><button class="btn" id="guardarAnimalBtn">Guardar</button></div>`);
    document.getElementById('guardarAnimalBtn').onclick = async () => {
        const nombre = document.getElementById('animNombre').value.trim();
        if (!nombre) return mostrarToast('Nombre requerido', true);
        const obj = {
            id: edit ? animal.id : undefined,
            nombre,
            categoria: document.getElementById('animCat').value,
            raza: document.getElementById('animRaza').value.trim(),
            edad: parseFloat(document.getElementById('animEdad').value) || 0,
            peso: parseFloat(document.getElementById('animPeso').value) || 0,
            estado: document.getElementById('animEstado').value,
            lote_id: document.getElementById('animLote').value ? parseInt(document.getElementById('animLote').value) : null
        };
        await guardarEnTabla('animales', obj);
        await cargarTabla('animales');
        cerrarModal();
        renderInventario();
        renderDashboard();
        renderLotes();
    };
}

async function editarAnimal(id) {
    const animal = appData.animales.find(a => a.id === id);
    if (animal) abrirModalAnimal(animal);
}

async function eliminarAnimal(id) {
    if (!confirm('¿Eliminar animal y sus registros?')) return;
    await eliminarDeTabla('animales', id);
    // Eliminar registros relacionados (pesos, etc.)
    ['pesos', 'vacunas', 'alimentaciones', 'nacimientos'].forEach(async tabla => {
        const relacionados = appData[tabla].filter(r => r.animal_id === id);
        for (let r of relacionados) await eliminarDeTabla(tabla, r.id);
    });
    await cargarTodosLosDatos();
    renderInventario();
    renderDashboard();
    renderLotes();
}

document.getElementById('btnAgregarAnimal').onclick = () => abrirModalAnimal();