const toggle = document.getElementById('dark-mode-toggle');

if (toggle) {
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}

// Filtro por hash (#cultural, #naturaleza, etc.)
function activarFiltroPorHash() {
    const hash = window.location.hash.replace('#', '');
    const categorias = ['todos', 'cultural', 'naturaleza', 'playa', 'gastronomico', 'religioso'];
    
    if (hash && categorias.includes(hash)) {
        const input = document.getElementById(hash);
        if (input) {
            input.checked = true;
        }
    }
}

window.addEventListener('DOMContentLoaded', activarFiltroPorHash);
window.addEventListener('hashchange', activarFiltroPorHash);