/* =========================================================
   DARK MODE
   ========================================================= */
const toggle = document.getElementById('dark-mode-toggle');
if (toggle) {
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}

/* =========================================================
   FUNCIÓN GLOBAL: FILTRADO POR HASH DE URL
   ========================================================= */
function activarFiltroPorHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const botonAClickear = $(`.filtro-btn[data-filtro="${hash}"]`);
        if (botonAClickear.length > 0) {
            botonAClickear.click();
            $('html, body').animate({
                scrollTop: $(".text-center.mb-4").offset().top - 100
            }, 500);
        }
    }
}

/* =========================================================
   JQUERY: FILTROS + TOOLTIPS + TABLA
   ========================================================= */
$(document).ready(function () {

    $(".filtro-btn").click(function () {
        let filtro = $(this).data("filtro");
        $(".filtro-btn").removeClass("btn-primary").addClass("btn-outline-primary");
        $(this).removeClass("btn-outline-primary").addClass("btn-primary");
        if (filtro === "all") {
            $(".destino-item").fadeIn(300);
        } else {
            $(".destino-item").hide();
            $("." + filtro).fadeIn(300);
        }
    });

    activarFiltroPorHash();

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    $('.tabla-precios tbody tr').hover(
        function () { $(this).addClass('table-active shadow-sm'); },
        function () { $(this).removeClass('table-active shadow-sm'); }
    );
});

window.addEventListener('hashchange', activarFiltroPorHash);

/* =========================================================
   FORMULARIO DE CONTACTO
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

    if (!document.getElementById('formularioContacto')) return;

    const formulario = $('#formularioContacto');
    const nombre = $('#nombre-contacto');
    const email = $('#email-contacto');
    const asunto = $('#asunto-contacto');
    const mensaje = $('#mensaje-contacto');
    const btnEnviar = $('#btnEnviar');
    const spinner = $('#spinnerCarga');
    const charCount = $('#char-count');

    function validarEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function validarNombre(v) { return v.trim().length >= 3; }
    function validarAsunto(v) { return v.trim().length >= 5; }
    function validarMensaje(v) { return v.trim().length >= 10 && v.trim().length <= 500; }

    nombre.on('input', function () {
        const v = $(this).val();
        if (!v.length) { nombre.removeClass('is-valid is-invalid'); $('#error-nombre').text(''); }
        else if (validarNombre(v)) { nombre.removeClass('is-invalid').addClass('is-valid'); $('#error-nombre').text(''); }
        else { nombre.removeClass('is-valid').addClass('is-invalid'); $('#error-nombre').text('El nombre debe tener al menos 3 caracteres'); }
        verificarFormulario();
    });

    email.on('input', function () {
        const v = $(this).val();
        if (!v.length) { email.removeClass('is-valid is-invalid'); $('#error-email').text(''); }
        else if (validarEmail(v)) { email.removeClass('is-invalid').addClass('is-valid'); $('#error-email').text(''); }
        else { email.removeClass('is-valid').addClass('is-invalid'); $('#error-email').text('Ingresá un email válido (ej: usuario@ejemplo.com)'); }
        verificarFormulario();
    });

    asunto.on('input', function () {
        const v = $(this).val();
        if (!v.length) { asunto.removeClass('is-valid is-invalid'); $('#error-asunto').text(''); }
        else if (validarAsunto(v)) { asunto.removeClass('is-invalid').addClass('is-valid'); $('#error-asunto').text(''); }
        else { asunto.removeClass('is-valid').addClass('is-invalid'); $('#error-asunto').text('El asunto debe tener al menos 5 caracteres'); }
        verificarFormulario();
    });

    mensaje.on('input', function () {
        const v = $(this).val();
        charCount.text(v.length + '/500');
        if (!v.length) { mensaje.removeClass('is-valid is-invalid'); $('#error-mensaje').text(''); }
        else if (validarMensaje(v)) { mensaje.removeClass('is-invalid').addClass('is-valid'); $('#error-mensaje').text(''); }
        else {
            mensaje.removeClass('is-valid').addClass('is-invalid');
            $('#error-mensaje').text(v.length < 10 ? 'El mensaje debe tener al menos 10 caracteres' : 'El mensaje no puede exceder 500 caracteres');
        }
        verificarFormulario();
    });

    function verificarFormulario() {
        btnEnviar.prop('disabled', !(validarNombre(nombre.val()) && validarEmail(email.val()) && validarAsunto(asunto.val()) && validarMensaje(mensaje.val())));
    }

    formulario.on('submit', function (e) {
        e.preventDefault();
        btnEnviar.prop('disabled', true);
        spinner.removeClass('d-none');
        setTimeout(function () {
            spinner.addClass('d-none');
            const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
            modal.show();
            formulario[0].reset();
            nombre.removeClass('is-valid is-invalid');
            email.removeClass('is-valid is-invalid');
            asunto.removeClass('is-valid is-invalid');
            mensaje.removeClass('is-valid is-invalid');
            charCount.text('0/500');
            btnEnviar.prop('disabled', true);
            setTimeout(function () { modal.hide(); }, 3000);
        }, 2000);
    });

    verificarFormulario();
});

/* =========================================================
   FILTRO DEL BLOG
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

    if (!document.getElementById('articles-row')) return;

    const articulos = document.querySelectorAll('#articles-row article');
    const btnsFiltro = document.querySelectorAll('.filter-btn');
    const selectFiltro = document.getElementById('filter-select');
    const noResults = document.getElementById('no-results');

    function filtrar(categoria) {
        let visibles = 0;
        articulos.forEach(function (art) {
            const cat = art.getAttribute('data-category');
            if (categoria === 'all' || cat === categoria) { art.style.display = ''; visibles++; }
            else { art.style.display = 'none'; }
        });
        noResults.classList.toggle('d-none', visibles > 0);
    }

    btnsFiltro.forEach(function (btn) {
        btn.addEventListener('click', function () {
            btnsFiltro.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.getAttribute('data-filter');
            if (selectFiltro) selectFiltro.value = cat;
            filtrar(cat);
        });
    });

    if (selectFiltro) {
        selectFiltro.addEventListener('change', function () {
            const cat = this.value;
            btnsFiltro.forEach(function (btn) {
                btn.classList.remove('active');
                if (btn.getAttribute('data-filter') === cat) btn.classList.add('active');
            });
            filtrar(cat);
        });
    }
});