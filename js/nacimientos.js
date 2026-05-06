function renderNacimientos() {
    const tbody = document.getElementById('tablaNacimientos');
    const ordenados = [...appData.nacimientos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    if (ordenados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Sin nacimientos</td></tr>';
        return;
    }
    tbody.innerHTML = ordenados.map(n => {
        const madre = appData.animales.find(a => a.id === n.madre_id);
        const padre = appData.animales.find(a => a.id === n.padre_id);
        const cria = n.cria_id ? appData.animales.find(a => a.id === n.cria_id) : null;
        return `<tr>
            <td>${n.fecha}</td><td>${madre ? madre.nombre : '?'}</td><td>${padre ? padre.nombre : '—'}</td>
            <td>${n.sexo}</td><td>${n.peso_nacer} kg</td><td>${cria ? cria.nombre : '—'}</td>
            <td><button class="btn btn-sm btn-danger" onclick="eliminarNacimiento(${n.id})">🗑️</button></td>
        </tr>`;
    }).join('');
}

function abrirModalNacimiento() {
    const vacas = appData.animales.filter(a => a.categoria === 'vaca');
    const toros = appData.animales.filter(a => a.categoria === 'toro');
    if (vacas.length === 0) { mostrarToast('No hay vacas registradas', true); return; }
    abrirModal(`<h3>🐣 Registrar Nacimiento</h3>
        <div class="form-group"><label>Fecha</label><input type="date" id="nacFecha" value="${new Date().toISOString().split('T')[0]}"></div>
        <div class="form-group"><label>Madre</label><select id="nacMadre">${vacas.map(v => `<option value="${v.id}">${v.nombre}</option>`).join('')}</select></div>
        <div class="form-group"><label>Padre (opcional)</label><select id="nacPadre"><option value="">Desconocido</option>${toros.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('')}</select></div>
        <div class="form-group"><label>Sexo</label><select id="nacSexo"><option>Macho</option><option>Hembra</option></select></div>
        <div class="form-group"><label>Peso al nacer (kg)</label><input type="number" id="nacPeso" step="0.1" value="30"></div>
        <div class="form-group"><label>¿Crear cría automáticamente?</label><select id="nacCrear"><option value="si">Sí</option><option value="no">No</option></select></div>
        <div class="modal-acciones"><button class="btn btn-cancel" onclick="cerrarModal()">Cancelar</button><button class="btn" id="guardarNacBtn">Guardar</button></div>`);
    document.getElementById('guardarNacBtn').onclick = async () => {
        const fecha = document.getElementById('nacFecha').value;
        const madreId = parseInt(document.getElementById('nacMadre').value);
        const padreId = document.getElementById('nacPadre').value ? parseInt(document.getElementById('nacPadre').value) : null;
        const sexo = document.getElementById('nacSexo').value;
        const peso = parseFloat(document.getElementById('nacPeso').value) || 0;
        const crear = document.getElementById('nacCrear').value === 'si';
        let criaId = null;
        if (crear) {
            const madre = appData.animales.find(a => a.id === madreId);
            const nombreCria = `Cría de ${madre ? madre.nombre : '?'} (${sexo})`;
            const nuevaCria = { nombre: nombreCria, categoria: 'cria', raza: madre ? madre.raza : '', edad: 0, peso, estado: 'saludable', lote_id: null };
            await guardarEnTabla('animales', nuevaCria);
            await cargarTabla('animales');
            criaId = nuevaCria.id;
        }
        const nacimiento = { fecha, madre_id: madreId, padre_id: padreId, sexo, peso_nacer: peso, cria_id: criaId };
        await guardarEnTabla('nacimientos', nacimiento);
        await cargarTabla('nacimientos');
        cerrarModal();
        renderNacimientos();
        renderInventario();
        renderDashboard();
    };
}

async function eliminarNacimiento(id) {
    if (!confirm('¿Eliminar este nacimiento?')) return;
    const nac = appData.nacimientos.find(n => n.id === id);
    if (nac && nac.cria_id) {
        await eliminarDeTabla('animales', nac.cria_id);
    }
    await eliminarDeTabla('nacimientos', id);
    await cargarTodosLosDatos();
    renderNacimientos();
    renderInventario();
    renderDashboard();
}

document.getElementById('btnRegistrarNacimiento').onclick = abrirModalNacimiento;