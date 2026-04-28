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

// jQuery: filtro por categorías y comentarios simulados
$(function(){
    // función para mostrar Toasts de Bootstrap
    function showToast(message, type = 'success', delay = 3000) {
        const id = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
              <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
              </div>
            </div>`;
        const $container = $('#toast-container');
        if ($container.length) {
            const $el = $(toastHtml);
            $container.append($el);
            const toast = new bootstrap.Toast($el.get(0), { delay });
            $el.on('hidden.bs.toast', function () { $el.remove(); });
            toast.show();
        } else {
            alert(message);
        }
    }

    // filtro por botones
    $('.filter-btn').on('click', function(){
        const cat = $(this).data('filter');
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        // sincronizar select en móviles
        if($('#filter-select').length) $('#filter-select').val(cat);
        applyFilter(cat);
    });

    // filtro por select (móvil)
    $('#filter-select').on('change', function(){
        const cat = $(this).val();
        // sincronizar botones (si están visibles)
        $('.filter-btn').removeClass('active');
        $(`.filter-btn[data-filter="${cat}"]`).addClass('active');
        applyFilter(cat);
    });

    // función común de filtrado
    function applyFilter(cat){
        if(cat === 'all'){
            $('#articles-row article').fadeIn(200);
        } else {
            $('#articles-row article').each(function(){
                const itemCat = $(this).data('category');
                $(this).toggle(itemCat === cat);
            });
        }
        // mostrar mensaje si no hay resultados visibles
        setTimeout(() => {
            const visible = $('#articles-row article:visible').length;
            if (visible === 0) {
                $('#no-results').removeClass('d-none');
            } else {
                $('#no-results').addClass('d-none');
            }
        }, 220); // coincide con fadeIn timing
    }

    // comentarios simulados con persistencia en localStorage
    const COMMENTS_KEY = 'bh_comments_v1';

    function saveCommentsToStorage(list){
        try{
            localStorage.setItem(COMMENTS_KEY, JSON.stringify(list));
        }catch(e){ console.warn('No se pudo guardar en localStorage', e); }
    }

    function loadCommentsFromStorage(){
        try{
            const raw = localStorage.getItem(COMMENTS_KEY);
            return raw ? JSON.parse(raw) : [];
        }catch(e){ console.warn('Error leyendo localStorage', e); return []; }
    }

    function renderCommentItem(c){
        const safeText = $('<div>').text(c.text).html();
        const html = `
            <div class="card mb-2" data-id-comment="${c.id}">
                <div class="card-body d-flex gap-3">
                    <div class="avatar-css" style="width:48px;height:48px;border-radius:50%;background:#ccc;"></div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-baseline">
                            <div class="d-flex align-items-baseline gap-2">
                                <strong>${c.name}</strong>
                                <small class="text-muted">· ${c.time}</small>
                            </div>
                            <button class="btn btn-sm btn-link text-danger delete-comment" data-id="${c.id}" aria-label="Eliminar">Eliminar</button>
                        </div>
                        <p class="mb-0">${safeText}</p>
                    </div>
                </div>
            </div>`;
        return html;
    }

    // renderizar existentes
    const stored = loadCommentsFromStorage();
    if(stored && stored.length){
        stored.slice().reverse().forEach(c => $('#comments-list').append(renderCommentItem(c)));
    }

    // Autoresize para el textarea de comentarios
    function autoResizeTextarea(el){
        try{
            el.style.height = 'auto';
            el.style.height = (el.scrollHeight) + 'px';
        }catch(e){ /* noop */ }
    }

    $('#comment-text').on('input', function(){ autoResizeTextarea(this); });
    // inicializar tamaño correcto si hay texto previo
    $('#comment-text').each(function(){ autoResizeTextarea(this); });

    $('#comment-form').on('submit', function(e){
        e.preventDefault();
        const name = $('#comment-name').val().trim() || 'Anónimo';
        const text = $('#comment-text').val().trim();
        if(!text) return;
        const time = new Date().toLocaleString();

        const comment = { id: Date.now().toString(), name, text, time };

        // guardar
        const list = loadCommentsFromStorage();
        list.push(comment);
        saveCommentsToStorage(list);

        // renderizar en pantalla (al inicio)
        $('#comments-list').prepend(renderCommentItem(comment));
        this.reset();
        // forzar recalculo del tamaño al limpiar el form
        $('#comment-text').trigger('input');
        showToast('Comentario publicado correctamente.', 'success', 3000);
    });

    // eliminar comentario individual
    $('#comments-list').on('click', '.delete-comment', function(){
        const id = String($(this).data('id'));
        let list = loadCommentsFromStorage();
        list = list.filter(c => String(c.id) !== id);
        saveCommentsToStorage(list);
        // quitar del DOM
        $(this).closest('[data-id-comment]').remove();
    });

    // limpiar todos
    $('#clear-comments').on('click', function(){
        if(!confirm('¿Borrar todos los comentarios? Esta acción no se puede deshacer.')) return;
        try{ localStorage.removeItem(COMMENTS_KEY); }catch(e){ console.warn(e); }
        $('#comments-list').empty();
    });
});