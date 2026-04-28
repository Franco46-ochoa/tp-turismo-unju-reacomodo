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
$(document).ready(function() {
    // Inicializar Tooltips de Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });


    // Hover dinámico con jQuery en la tabla
    $('.tabla-precios tbody tr').on('mouseenter', function() {
        $(this).addClass('table-active shadow-sm'); // Resalta la fila sutilmente
        $(this).css('transition', 'all 0.3s ease');
    }).on('mouseleave', function() {
        $(this).removeClass('table-active shadow-sm');
    });
});


window.addEventListener('DOMContentLoaded', activarFiltroPorHash);
window.addEventListener('hashchange', activarFiltroPorHash);