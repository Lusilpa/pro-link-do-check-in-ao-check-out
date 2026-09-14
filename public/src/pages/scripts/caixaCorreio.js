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
            toast.addEventListener('transitionend', () => toast.remove());
        }, 4000);
    };

    function loadInitialState() {
        $('#mail-list-inject-area').load(PATH_LIST);
        if (isDesktop()) $('#desktop-dynamic-inject-area').load(PATH_COMPOSE);
    }

    $('#btnNewMailMobile').on('click', function() {
        $('#mobile-compose-inject-area').load(PATH_COMPOSE, function() {
            new bootstrap.Offcanvas(document.getElementById('mobileComposeOffcanvas')).show();
        });
    });

    $(document).on('click', '.pl-correio-card', function() {
        const mailId = $(this).data('id');
        $(this).removeClass('unread');
        $(this).find('.pl-unread-dot').fadeOut(200);

        if (isDesktop()) {
            $('#desktop-dynamic-inject-area').fadeOut(150, function() {
                $(this).load(PATH_READ, function() {
                    if (typeof window.initDetailCorreio === 'function') window.initDetailCorreio();
                    $(this).fadeIn(200);
                });
            });
        } else {
            $('#mobile-read-inject-area').load(PATH_READ, function() {
                if (typeof window.initDetailCorreio === 'function') window.initDetailCorreio();
                new bootstrap.Offcanvas(document.getElementById('mobileReadOffcanvas')).show();
            });
        }
    });

    document.addEventListener('prolink:close-mail-read', function() {
        if (isDesktop()) {
            $('#desktop-dynamic-inject-area').fadeOut(150, function() {
                $(this).load(PATH_COMPOSE, function() { $(this).fadeIn(200); });
            });
        } else {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('mobileReadOffcanvas'));
            if (bsOffcanvas) bsOffcanvas.hide();
        }
    });

    document.addEventListener('prolink:open-mail-compose', function(e) {
        const replyData = e.detail; 
        if (isDesktop()) {
            $('#desktop-dynamic-inject-area').load(PATH_COMPOSE, function() {
                if (replyData && replyData.replyTo && typeof window.setComposeRecipients === 'function') {
                    window.setComposeRecipients(replyData.replyTo, replyData.originalSubject);
                }
            });
        } else {
            const bsRead = bootstrap.Offcanvas.getInstance(document.getElementById('mobileReadOffcanvas'));
            if (bsRead) bsRead.hide();
            $('#mobile-compose-inject-area').load(PATH_COMPOSE, function() {
                if (replyData && replyData.replyTo && typeof window.setComposeRecipients === 'function') {
                    window.setComposeRecipients(replyData.replyTo, replyData.originalSubject);
                }
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