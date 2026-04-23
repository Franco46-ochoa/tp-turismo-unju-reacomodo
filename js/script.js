$(document).ready(function() {

  // ── FLIP DE CARDS ─────────────────────────────
  // Al hacer clic en cualquier .card, toggle de clase .flipped
    $('.card').on('click', function() {
    $(this).toggleClass('flipped');
});

  // ── RATING CON ESTRELLAS ───────────────────────
  // Al pasar el mouse, ilumina las estrellas hasta esa posición
  $('.rating i').on('mouseover', function() {
    const rating = $(this).data('rating');
    $(this).closest('.rating').find('i').each(function() {
            if ($(this).data('rating') <= rating) {
                $(this).removeClass('far').addClass('fas hovered');
            } else {
                $(this).removeClass('fas hovered').addClass('far');
            }
    });
});

  // Al sacar el mouse, vuelve al rating guardado
    $('.rating').on('mouseleave', function() {
    const saved = $(this).data('saved') || 0;
    $(this).find('i').each(function() {
        if ($(this).data('rating') <= saved) {
        $(this).removeClass('far hovered').addClass('fas');
        } else {
        $(this).removeClass('fas hovered').addClass('far');
        }
    });
});

  // Al hacer clic, guarda el rating elegido
    $('.rating i').on('click', function(e) {
        e.stopPropagation(); // evita que se active el flip al mismo tiempo
        const rating = $(this).data('rating');
        const $ratingContainer = $(this).closest('.rating');
        $ratingContainer.data('saved', rating);
        $ratingContainer.find('i').each(function() {
            if ($(this).data('rating') <= rating) {
                $(this).removeClass('far').addClass('fas');
            } else {
            $(this).removeClass('fas').addClass('far');
        }
    });
});

  // ── DARK MODE ──────────────────────────────────
    $('#dark-mode-toggle').on('click', function() {
        $('body').toggleClass('dark-mode');
    // Guarda la preferencia
    if ($('body').hasClass('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

  // Carga la preferencia guardada al iniciar
    if (localStorage.getItem('theme') === 'dark') {
        $('body').addClass('dark-mode');
    }

});