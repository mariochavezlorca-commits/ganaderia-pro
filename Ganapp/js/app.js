// Navegación y Dashboard
const app = {
    paginaActual: 1,
    cambiarPaginaInv: function(delta) {
        this.paginaActual += delta;
        renderInventario();
    },
    irPagina: function(nombre) {
        document.querySelectorAll('.pagina').forEach(p => p.classList.remove('activa'));
        document.querySelectorAll('.sidebar-nav button').forEach(b => b.classList.remove('activo'));
        const pagina = document.getElementById('pagina-' + nombre);
        if (pagina) pagina.classList.add('activa');
        const btn = document.querySelector(`.sidebar-nav button[data-pagina="${nombre}"]`);
        if (btn) btn.classList.add('activo');
        const titulos = {
            dashboard: '📊 Dashboard', inventario: '🐮 Inventario', lotes: '🐂 Lotes',
            nacimientos: '🐣 Nacimientos', peso: '⚖️ Pesaje', vacunacion: '💉 Vacunación',
            alimentacion: '🌾 Alimentación', notas: '📝 Notas', clima: '🌤️ Clima', configuracion: '⚙️ Config'
        };
        document.getElementById('tituloPagina').textContent = titulos[nombre] || 'GanadApp';
        if (nombre === 'dashboard') renderDashboard();
        if (nombre === 'inventario') { app.paginaActual = 1; renderInventario(); }
        if (nombre === 'lotes') renderLotes();
        if (nombre === 'nacimientos') renderNacimientos();
        if (nombre === 'peso') renderPesos();
        if (nombre === 'vacunacion') renderVacunas();
        if (nombre === 'alimentacion') renderAlimentaciones();
        if (nombre === 'notas') renderNotas();
        if (nombre === 'clima') renderClimas();
        if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('abierta');
    }
};

// Reloj
function actualizarReloj() {
    const ahora = new Date();
    document.getElementById('fechaHora').textContent = ahora.toLocaleDateString('es-MX', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}
actualizarReloj();
setInterval(actualizarReloj, 30000);

// Eventos de navegación
document.querySelectorAll('.sidebar-nav button').forEach(btn => {
    btn.addEventListener('click', () => app.irPagina(btn.dataset.pagina));
});

document.getElementById('btnHamburguesa').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('abierta');
});

// Dashboard
function renderDashboard() {
    const total = appData.animales.length;
    const salud = appData.animales.filter(a => a.estado === 'saludable').length;
    const aten = total - salud;
    const pesoProm = total > 0 ? (appData.animales.reduce((s, a) => s + (a.peso || 0), 0) / total).toFixed(1) : '0';
    document.getElementById('cardsDashboard').innerHTML = `
        <div class="card"><div class="icono">🐄</div><div class="info"><div class="numero">${total}</div><div class="etiqueta">Animales</div></div></div>
        <div class="card"><div class="icono">✅</div><div class="info"><div class="numero">${salud}</div><div class="etiqueta">Saludables</div></div></div>
        <div class="card"><div class="icono">⚠️</div><div class="info"><div class="numero">${aten}</div><div class="etiqueta">Atención</div></div></div>
        <div class="card"><div class="icono">⚖️</div><div class="info"><div class="numero">${pesoProm}</div><div class="etiqueta">Peso prom.</div></div></div>
        <div class="card"><div class="icono">🐂</div><div class="info"><div class="numero">${appData.lotes.length}</div><div class="etiqueta">Lotes</div></div></div>
    `;
    const criticos = appData.animales.filter(a => a.estado !== 'saludable');
    document.getElementById('tablaAtencion').innerHTML = criticos.length === 0 ?
        '<tr><td colspan="4" class="text-center">✅ Todos saludables</td></tr>' :
        criticos.map(a => {
            const l = appData.lotes.find(l => l.id === a.lote_id);
            return `<tr><td>${a.nombre}</td><td>${a.categoria || ''}</td><td><span class="badge ${a.estado === 'critico' ? 'badge-red' : 'badge-warn'}">${a.estado}</span></td><td>${l ? l.nombre : '—'}</td></tr>`;
        }).join('');
}

// Modal
function cerrarModal() { document.getElementById('modalOverlay').classList.add('oculto'); }
function abrirModal(html) { document.getElementById('modalContenido').innerHTML = html; document.getElementById('modalOverlay').classList.remove('oculto'); }
document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) cerrarModal(); });

// Iniciar
verificarSesion();