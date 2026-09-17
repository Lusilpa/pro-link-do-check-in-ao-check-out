(function initCaixaCorreio() {
    const PATH_LIST = 'src/entities/caixa-correio/layouts/card-correio.html';
    const PATH_COMPOSE = 'src/entities/caixa-correio/layouts/card-envio.html';
    const PATH_READ = 'src/entities/caixa-correio/layouts/detail-correio.html';

    const isDesktop = () => window.innerWidth > 1024;

    // Toast Global
    window.prolinkToast = function(message, type = 'success') {
        const container = document.getElementById('pl-toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `pl-toast ${type === 'error' ? 'toast-error' : ''}`;
        const icon = type === 'error' ? 'bi-exclamation-octagon' : 'bi-check-circle';
        
        toast.innerHTML = `<i class="bi ${icon} pl-toast-icon"></i> <span>${message}</span>`;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('toast-fadeout');
            // Remocao por timer, nao por transitionend: a animacao de entrada (toastSlideIn,
            // com fill-mode forwards) prende opacity/transform no valor final, entao o evento
            // as vezes nao dispara mesmo com a transicao de saida aplicada visualmente - o
            // toast ficava invisivel mas nunca era removido do DOM. 300ms bate com a duracao
            // da transition de .toast-fadeout no CSS.
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    // O painel de composição (card-envio.html) usa IDs fixos (chipInput, btnSendEnvio...).
    // Só pode existir UMA cópia no DOM por vez - do contrário getElementById() dentro do
    // card-envio.js pega o primeiro elemento em ordem de documento, que pode não ser o
    // formulário visível, e o clique em "Enviar" não dispara nada. isDesktop() só é checado
    // uma vez no carregamento da página, mas o media query do CSS que mostra/esconde o botão
    // mobile é reavaliado ao vivo (ex: abrir o DevTools estreita o viewport) - por isso
    // limpamos sempre o outro container antes de carregar uma nova cópia.
    function loadCompose(container, onLoaded) {
        const other = container === '#desktop-dynamic-inject-area'
            ? '#mobile-compose-inject-area'
            : '#desktop-dynamic-inject-area';
        $(other).empty();
        $(container).load(PATH_COMPOSE, onLoaded);
    }

    function loadInitialState() {
        $('#mail-list-inject-area').load(PATH_LIST);
        if (isDesktop()) loadCompose('#desktop-dynamic-inject-area');
    }

    $('#btnNewMailMobile').on('click', function() {
        loadCompose('#mobile-compose-inject-area', function() {
            new bootstrap.Offcanvas(document.getElementById('mobileComposeOffcanvas')).show();
        });
    });

    $(document).on('click', '.pl-correio-card', function() {
        const mailId = $(this).data('id');

        if (isDesktop()) {
            $('#desktop-dynamic-inject-area').fadeOut(150, function() {
                $(this).load(PATH_READ, function() {
                    if (typeof window.initDetailCorreio === 'function') window.initDetailCorreio(mailId);
                    $(this).fadeIn(200);
                });
            });
        } else {
            $('#mobile-read-inject-area').load(PATH_READ, function() {
                if (typeof window.initDetailCorreio === 'function') window.initDetailCorreio(mailId);
                new bootstrap.Offcanvas(document.getElementById('mobileReadOffcanvas')).show();
            });
        }
    });

    document.addEventListener('prolink:close-mail-read', function() {
        if (isDesktop()) {
            $('#desktop-dynamic-inject-area').fadeOut(150, function() {
                const el = this;
                $('#mobile-compose-inject-area').empty();
                $(el).load(PATH_COMPOSE, function() { $(el).fadeIn(200); });
            });
        } else {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('mobileReadOffcanvas'));
            if (bsOffcanvas) bsOffcanvas.hide();
        }
    });

    document.addEventListener('prolink:open-mail-compose', function(e) {
        const replyData = e.detail;
        const applyReply = function() {
            if (replyData && replyData.replyTo && typeof window.setComposeRecipients === 'function') {
                window.setComposeRecipients(replyData.replyTo, replyData.originalSubject);
            }
        };

        if (isDesktop()) {
            loadCompose('#desktop-dynamic-inject-area', applyReply);
        } else {
            const bsRead = bootstrap.Offcanvas.getInstance(document.getElementById('mobileReadOffcanvas'));
            if (bsRead) bsRead.hide();
            loadCompose('#mobile-compose-inject-area', function() {
                applyReply();
                new bootstrap.Offcanvas(document.getElementById('mobileComposeOffcanvas')).show();
            });
        }
    });

    document.addEventListener('prolink:close-mail-compose', function() {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('mobileComposeOffcanvas'));
        if (bsOffcanvas) bsOffcanvas.hide();
    });

    $('#mailSearchInput').on('input', function() {
        const term = $(this).val().toLowerCase();
        $('.pl-correio-card').each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.indexOf(term) > -1);
        });
    });

    loadInitialState();
})();