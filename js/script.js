// ── MODO OSCURO ──
const toggle = document.getElementById('dark-mode-toggle');
if (toggle) {
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}

// ── FILTRO DE DESTINOS ──
function filtrarDestinos(filtro) {
    const items = document.querySelectorAll('.destino-item');
    const botones = document.querySelectorAll('.filtro-btn');

    // Actualizar botón activo
    botones.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
    });
    const btnActivo = document.querySelector(`.filtro-btn[data-filtro="${filtro}"]`);
    if (btnActivo) {
        btnActivo.classList.add('btn-primary');
        btnActivo.classList.remove('btn-outline-primary');
    }

    // Mostrar/ocultar cards
    items.forEach(item => {
        if (filtro === 'all' || item.classList.contains(filtro)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Asignar click a cada botón de filtro
document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filtro = btn.getAttribute('data-filtro');
        filtrarDestinos(filtro);
        // Actualizar el hash en la URL
        if (filtro === 'all') {
            history.pushState(null, '', window.location.pathname);
        } else {
            history.pushState(null, '', '#' + filtro);
        }
    });
});

// ── FILTRO POR HASH (desde el navbar) ──
function activarFiltroPorHash() {
    const hash = window.location.hash.replace('#', '');
    const categorias = ['cultural', 'naturaleza', 'playa', 'gastronomico', 'religioso'];

    if (hash && categorias.includes(hash)) {
        filtrarDestinos(hash);
    } else {
        filtrarDestinos('all');
    }
}

window.addEventListener('DOMContentLoaded', activarFiltroPorHash);
window.addEventListener('hashchange', activarFiltroPorHash);