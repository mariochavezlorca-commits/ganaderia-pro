document.getElementById('btnActivarPremium').onclick = async () => {
    const codigo = document.getElementById('codigoPremium').value.trim();
    if (codigo === 'PREMIUM50') {
        await supabase.from('perfiles').update({ plan: 'premium' }).eq('id', usuario.id);
        perfil.plan = 'premium';
        document.getElementById('planActual').innerHTML = 'Premium ✨';
        mostrarToast('Premium activado!');
    } else {
        mostrarToast('Código inválido', true);
    }
};

document.getElementById('btnGenerarDemo').onclick = async () => {
    if (!confirm('¿Generar 310 animales de demostración?')) return;
    // Limpiar datos actuales
    for (let tabla of ['animales','pesos','vacunas','alimentaciones','nacimientos','notas','climas']) {
        const { data } = await supabase.from(tabla).select('id').eq('user_id', usuario.id);
        if (data) for (let item of data) await supabase.from(tabla).delete().eq('id', item.id);
    }
    // Crear animales demo
    const nombres = ['Lola','Max','Lucero','Manchitas','Tormenta','Estrella','Rayo','Brisa','Pinta','Oscuro','Blanco','Gris','Pardo','Careto','Colorao'];
    for (let i = 0; i < 100; i++) await guardarEnTabla('animales', { nombre: nombres[i%15]+' '+(i+1), categoria:'vaca', raza:'Holstein', edad:3+Math.random()*5, peso:400+Math.random()*200, estado:'saludable', lote_id:null });
    for (let i = 0; i < 100; i++) await guardarEnTabla('animales', { nombre:'Cría '+(i+1), categoria:'cria', raza:'Holstein', edad:Math.random(), peso:30+Math.random()*80, estado:'saludable', lote_id:null });
    for (let i = 0; i < 10; i++) await guardarEnTabla('animales', { nombre:'Toro '+(i+1), categoria:'toro', raza:'Angus', edad:4+Math.random()*3, peso:700+Math.random()*300, estado:'saludable', lote_id:null });
    for (let i = 0; i < 100; i++) await guardarEnTabla('animales', { nombre:'Novillo '+(i+1), categoria:'novillo', raza:'Brahman', edad:1.5+Math.random()*2, peso:250+Math.random()*200, estado:'saludable', lote_id:null });
    await guardarEnTabla('lotes', { nombre:'Engorda Norte', descripcion:'Novillos', ubicacion:'Potrero 1' });
    await guardarEnTabla('lotes', { nombre:'Lechero', descripcion:'Vacas', ubicacion:'Establo' });
    await cargarTodosLosDatos();
    // Asignar algunos a lotes (opcional)
    const lote1 = appData.lotes[0];
    const lote2 = appData.lotes[1];
    for (let i = 0; i < 100; i++) if (appData.animales[i]) { appData.animales[i].lote_id = lote1.id; await guardarEnTabla('animales', appData.animales[i]); }
    for (let i = 100; i < 200; i++) if (appData.animales[i]) { appData.animales[i].lote_id = lote2.id; await guardarEnTabla('animales', appData.animales[i]); }
    await cargarTodosLosDatos();
    renderDashboard();
    app.irPagina('dashboard');
    mostrarToast('310 animales generados');
};