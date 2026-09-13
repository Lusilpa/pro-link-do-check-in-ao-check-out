$(document).ready(function() {
    // Mapeamento das rotas
    const routes = {
        // Rotas sem Navbar/TopBar (Páginas de Login/Auth)
        '': 'src/pages/layouts/auth.html',
        '#landing': 'src/pages/layouts/landing.html',
        '#auth': 'src/pages/layouts/auth.html',
        '#senha': 'src/pages/layouts/recuperacao-senha.html',
        '#termos-e-lgpd': 'src/pages/layouts/termos-e-lgpd.html',
        '#cadastro': 'src/pages/layouts/cadastre-se.html',

        // Rotas com Navbar e TopBar
        '#feed': 'src/pages/layouts/feed.html',
        '#search-demandas': 'src/pages/layouts/search-demandas.html',
        '#search-talentos': 'src/pages/layouts/search-talentos.html', 
        '#cartas': 'src/pages/layouts/caixa-correio.html',

        // Rotas adicionais
        '#perfil': 'src/pages/layouts/portfolio.html', 
        '#criacao': 'src/pages/layouts/estudioProfissional.html',
        '#admin': 'src/pages/layouts/admin.html',
        '#painel-empresa': 'src/pages/layouts/studio-empresa.html',
        '#config': 'src/pages/layouts/config.html',

        //Imgs
        '#Manaus':'assets/img/fundo-login-manaus.jpg'
    };

    // Elementos principais do DOM
    const $appContent = $('#app-content');
    const $navbarContainer = $('#navbar-container');
    const $topbarContainer = $('#topbar-container'); // NOVO: Container do Top Bar

    // Inicializa a aplicação injetando a Navbar e o Top Bar simultaneamente
    $.when(
        $navbarContainer.load('src/app/layouts/navBar.html'),
        $topbarContainer.load('src/app/layouts/topBar.html') // Carrega o componente superior
    ).done(function() {
        console.log("Pro-Link: Navbar e TopBar carregadas com sucesso.");
        // Chama a função de roteamento logo após as barras existirem na tela
        initRouter(); 
    });

    // Lógica de Roteamento
    function initRouter() {
        let currentHash = window.location.hash || '#landing';
        loadPage(currentHash);

        $(window).on('hashchange', function() {
            loadPage(window.location.hash);
        });
    }

    // Motor de renderização das páginas e animação das barras
    function loadPage(hash) {
        const pageUrl = routes[hash] || routes['#landing'];

        // Oculta a Navbar e o Top Bar (Ajusta tela cheia para auth/cadastro)
        if (hash === '#auth' || hash === '#senha' || hash === '#cadastro' || hash === '#termos-e-lgpd' || hash === '#landing') {
            $navbarContainer.removeClass('d-flex').addClass('d-none');
            $topbarContainer.addClass('d-none');
            $appContent.removeClass('container mt-2 pt-3 mb-5 pb-5').addClass('p-0 m-0');
            $('body').css('padding-top', '0');
        } else {
            $navbarContainer.removeClass('d-none').addClass('d-flex');
            $topbarContainer.removeClass('d-none');
            $appContent.removeClass('p-0 m-0').addClass('container mt-2 pt-3 mb-5 pb-5');
            $('body').css('padding-top', '60px');
        }

        // Carrega o HTML da página específica no content principal
        $appContent.hide().load(pageUrl, function(response, status, xhr) {
            if (status === "error") {
                $appContent.html(`<div class="alert alert-danger">Erro 404: Arquivo não encontrado (${pageUrl}).</div>`);
            } else {
                // Dispara renderização dos cartões internos do Estúdio Profissional
                if (hash === '#criacao') {
                    setTimeout(() => {
                        if (typeof window.initEstudioProfissional === 'function') {
                            window.initEstudioProfissional();
                        }
                    }, 50);
                }
            }
            $appContent.fadeIn(300);
        });

        // Estado ativo da Navbar
        if ($navbarContainer.children().length > 0) {
            $('.nav-icon-btn').removeClass('nav-icon-active').addClass('nav-icon-outline');
            $(`.nav-icon-btn[href="${hash}"]`).removeClass('nav-icon-outline').addClass('nav-icon-active');
        }

        // Estado ativo do botão de config na TopBar
        if (hash === '#config') {
            $('.pl-btn-config').addClass('nav-icon-active');
        } else {
            $('.pl-btn-config').removeClass('nav-icon-active');
        }
    }
});