let usuario = null;
let perfil = null;

// Verificar sesión al cargar
async function verificarSesion() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        usuario = session.user;
        await cargarPerfil();
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        document.getElementById('userEmailDisplay').textContent = usuario.email;
        await cargarTodosLosDatos();
        renderDashboard();
        app.irPagina('dashboard');
    } else {
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
    }
}

async function cargarPerfil() {
    const { data, error } = await supabase.from('perfiles').select('*').eq('id', usuario.id).single();
    if (data) {
        perfil = data;
    } else {
        const nuevo = { id: usuario.id, email: usuario.email, plan: 'gratis' };
        await supabase.from('perfiles').insert(nuevo);
        perfil = nuevo;
    }
    document.getElementById('planActual').innerHTML = perfil.plan === 'premium' ? 'Premium ✨' : 'Gratis';
}

// Eventos de login/registro
document.getElementById('btnLogin').addEventListener('click', async () => {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) mostrarToast(error.message, true);
    else verificarSesion();
});

document.getElementById('btnRegister').addEventListener('click', async () => {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) mostrarToast(error.message, true);
    else mostrarToast('Registro exitoso. Revisa tu correo si es necesario.');
});

document.getElementById('btnLogout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    usuario = null; perfil = null;
    verificarSesion();
});

// Función para saber si el usuario es premium
function esPremium() {
    return perfil && perfil.plan === 'premium';
}