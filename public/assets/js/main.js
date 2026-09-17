$(document).ready(function () {
    // Mapeamento das rotas
    const routes = {
        // Rotas sem Navbar/TopBar (Páginas de Login/Auth)
        '': 'src/pages/layouts/auth.html',
        '#landing': 'src/pages/layouts/landing.html',
        '#auth': 'src/pages/layouts/auth.html',
        '#senha': 'src/pages/layouts/recuperacaoSenha.html',
        '#termos-e-lgpd': 'src/pages/layouts/termosElgpd.html',
        '#cadastro': 'src/pages/layouts/cadastreSe.html',

        // Rotas com Navbar e TopBar
        '#feed': 'src/pages/layouts/feed.html',
        '#search-demandas': 'src/pages/layouts/searchDemandas.html',
        '#search-talentos': 'src/pages/layouts/searchTalentos.html',
        '#cartas': 'src/pages/layouts/caixaCorreio.html',

        // Rotas adicionais
        '#perfil': 'src/pages/layouts/portfolio.html',
        '#criacao': 'src/pages/layouts/estudioProfissional.html',
        '#admin': 'src/pages/layouts/admin.html',
        '#painel-empresa': 'src/pages/layouts/studiEempresa.html',
        '#config': 'src/pages/layouts/config.html',

        // Sub-páginas do Estúdio Profissional
        '#post-criar': 'src/entities/estudio-profissional/layouts/postCriar.html',
        '#post-editar': 'src/entities/estudio-profissional/layouts/postEditar.html',
        '#post-deletar': 'src/entities/estudio-profissional/layouts/postDeletar.html',
        '#portfolio-criar': 'src/entities/estudio-profissional/layouts/portfolioCriar.html',
        '#portfolio-editar': 'src/entities/estudio-profissional/layouts/portfolioEditar.html',
        '#portfolio-validar': 'src/entities/estudio-profissional/layouts/portfolioValidar.html',

        //Imgs
        '#Manaus': 'assets/img/fundo-login-manaus.jpg',
        '#Logo': 'assets/img/logo-pro-link.png',
        '#Brasao': 'assets/img/logo-pl.png'
    };

    // Elementos principais do DOM
    const $appContent = $('#app-content');
    const $navbarContainer = $('#navbar-container');
    const $topbarContainer = $('#topbar-container'); // NOVO: Container do Top Bar

    // Inicializa a aplicação injetando a Navbar e o Top Bar simultaneamente
    $.when(
        $navbarContainer.load('src/app/layouts/navBar.html'),
        $topbarContainer.load('src/app/layouts/topBar.html')
    ).done(function () {
        console.log("Pro-Link: Navbar e TopBar carregadas com sucesso.");
        initRouter();

        $(document).on('click', 'a[href="#perfil"]', async function () {
            if (typeof window.criarPortfolio === 'function') {
                await window.criarPortfolio();
            }
        });
        // Aplica o estado ativo correto após a navbar estar no DOM
        updateNavState(window.location.hash || '#auth');
    });

    // Atualiza o estado ativo da Navbar e TopBar
    function updateNavState(hash) {
        $('.nav-icon-btn').removeClass('nav-icon-active').addClass('nav-icon-outline');
        $(`.nav-icon-btn[href="${hash}"]`).removeClass('nav-icon-outline').addClass('nav-icon-active');

        if (hash === '#config') {
            $('.pl-btn-config').addClass('nav-icon-active');
        } else {
            $('.pl-btn-config').removeClass('nav-icon-active');
        }
    }

    // Lógica de Roteamento
    function initRouter() {
        let currentHash = window.location.hash || '#auth';
        loadPage(currentHash);

        $(window).on('hashchange', function () {
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
        $appContent.hide().load(pageUrl, function (response, status, xhr) {
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
                // Dispara a inicialização da tela de Configurações
                if (hash === '#config') {
                    setTimeout(() => {
                        if (typeof window.initConfig === 'function') {
                            window.initConfig();
                        }
                    }, 50);
                }
            }
            $appContent.fadeIn(300);
        });

        // Atualiza estado ativo da Navbar e TopBar
        updateNavState(hash);
    }
});