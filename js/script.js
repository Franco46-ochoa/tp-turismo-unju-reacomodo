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

/* =========================================================
   FUNCIONALIDADES DEL FORMULARIO DE CONTACTO
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // Solo ejecutar si estamos en la página de contacto
    if (!document.getElementById('formularioContacto')) {
        return;
    }

    // ====== SELECCIÓN DE ELEMENTOS ======
    const formulario = $('#formularioContacto');
    const nombre = $('#nombre-contacto');
    const email = $('#email-contacto');
    const asunto = $('#asunto-contacto');
    const mensaje = $('#mensaje-contacto');
    const btnEnviar = $('#btnEnviar');
    const spinner = $('#spinnerCarga');
    const charCount = $('#char-count');

    // ====== FUNCIONES DE VALIDACIÓN ======
    function validarEmail(emailValue) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(emailValue);
    }

    function validarNombre(nombreValue) {
        return nombreValue.trim().length >= 3;
    }

    function validarAsunto(asuntoValue) {
        return asuntoValue.trim().length >= 5;
    }

    function validarMensaje(mensajeValue) {
        return mensajeValue.trim().length >= 10 && mensajeValue.trim().length <= 500;
    }

    // ====== VALIDACIÓN EN TIEMPO REAL ======
    nombre.on('input', function() {
        const valor = $(this).val();
        if (valor.length === 0) {
            nombre.removeClass('is-valid is-invalid');
            $('#error-nombre').text('');
        } else if (validarNombre(valor)) {
            nombre.removeClass('is-invalid').addClass('is-valid');
            $('#error-nombre').text('');
        } else {
            nombre.removeClass('is-valid').addClass('is-invalid');
            $('#error-nombre').text('El nombre debe tener al menos 3 caracteres');
        }
        verificarFormulario();
    });

    email.on('input', function() {
        const valor = $(this).val();
        if (valor.length === 0) {
            email.removeClass('is-valid is-invalid');
            $('#error-email').text('');
        } else if (validarEmail(valor)) {
            email.removeClass('is-invalid').addClass('is-valid');
            $('#error-email').text('');
        } else {
            email.removeClass('is-valid').addClass('is-invalid');
            $('#error-email').text('Ingresá un email válido (ej: usuario@ejemplo.com)');
        }
        verificarFormulario();
    });

    asunto.on('input', function() {
        const valor = $(this).val();
        if (valor.length === 0) {
            asunto.removeClass('is-valid is-invalid');
            $('#error-asunto').text('');
        } else if (validarAsunto(valor)) {
            asunto.removeClass('is-invalid').addClass('is-valid');
            $('#error-asunto').text('');
        } else {
            asunto.removeClass('is-valid').addClass('is-invalid');
            $('#error-asunto').text('El asunto debe tener al menos 5 caracteres');
        }
        verificarFormulario();
    });

    mensaje.on('input', function() {
        const valor = $(this).val();
        const longitud = valor.length;
        charCount.text(longitud + '/500');

        if (valor.length === 0) {
            mensaje.removeClass('is-valid is-invalid');
            $('#error-mensaje').text('');
        } else if (validarMensaje(valor)) {
            mensaje.removeClass('is-invalid').addClass('is-valid');
            $('#error-mensaje').text('');
        } else {
            mensaje.removeClass('is-valid').addClass('is-invalid');
            if (longitud < 10) {
                $('#error-mensaje').text('El mensaje debe tener al menos 10 caracteres');
            } else if (longitud > 500) {
                $('#error-mensaje').text('El mensaje no puede exceder 500 caracteres');
            }
        }
        verificarFormulario();
    });

    // ====== VERIFICAR SI TODOS LOS CAMPOS SON VÁLIDOS ======
    function verificarFormulario() {
        const todosValidos =
            validarNombre(nombre.val()) &&
            validarEmail(email.val()) &&
            validarAsunto(asunto.val()) &&
            validarMensaje(mensaje.val());

        btnEnviar.prop('disabled', !todosValidos);
    }

    // ====== ENVÍO DEL FORMULARIO ======
    formulario.on('submit', function(e) {
        e.preventDefault();

        btnEnviar.prop('disabled', true);
        spinner.removeClass('d-none');

        setTimeout(function() {
            spinner.addClass('d-none');

            const modalConfirmacion = new bootstrap.Modal(
                document.getElementById('modalConfirmacion')
            );
            modalConfirmacion.show();

            // Limpiar formulario
            formulario[0].reset();
            nombre.removeClass('is-valid is-invalid');
            email.removeClass('is-valid is-invalid');
            asunto.removeClass('is-valid is-invalid');
            mensaje.removeClass('is-valid is-invalid');
            charCount.text('0/500');
            btnEnviar.prop('disabled', true);

            // Cerrar modal automáticamente a los 3 segundos
            setTimeout(function() {
                modalConfirmacion.hide();
            }, 3000);

        }, 2000);
    });

    // Inicialización
    verificarFormulario();
    });