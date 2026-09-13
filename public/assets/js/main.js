$(document).ready(function() {
    // Mapeamento das rotas
    const routes = {
        // Rotas sem Navbar (Páginas de Login/Auth)
        '': 'src/pages/layouts/auth.html',
        '#landing': 'src/pages/layouts/landing.html',
        '#auth': 'src/pages/layouts/auth.html',
        '#senha': 'src/pages/layouts/recuperacao-senha.html',
        '#termos-e-lgpd': 'src/pages/layouts/termos-e-lgpd.html',
        '#cadastro': 'src/pages/layouts/cadastre-se.html',

        // Rotas com Navbar
        '#feed': 'src/pages/layouts/feed.html',
        '#search-demandas': 'src/pages/layouts/search-demandas.html',
        '#search-talentos': 'src/pages/layouts/search-talentos.html', 
        '#cartas': 'src/pages/layouts/caixa-correio.html',

        // Rotas adicionais (Admin, Painel Empresarial, Studio de Criação)
        '#perfil': 'src/pages/layouts/portfolio.html', 
        '#criacao': 'src/pages/layouts/estudio.html',
        '#admin': 'src/pages/layouts/admin.html',
        '#painel-empresa': 'src/pages/layouts/painel-empresa.html',
        '#config': 'src/pages/layouts/config.html',

        //Imgs
        '#Manaus':'assets/img/fundo-login-manaus.jpg'
    };

    // Elementos principais do DOM
    const $appContent = $('#app-content');
    const $navbarContainer = $('#navbar-container');

    // Inicializa a aplicação injetando a Navbar
    $navbarContainer.load('src/app/layouts/navBar.html', function() {
        console.log("Pro-Link: Navbar carregada com sucesso.");
        // Chama a função de roteamento logo após a Navbar existir na tela
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

    // Motor de renderização das páginas e animação da Navbar
    function loadPage(hash) {
        const pageUrl = routes[hash] || routes['#landing'];

        // Oculta a Navbar e ajusta para tela cheia nas páginas de auth, senha e cadastro
        if (hash === '#auth' || hash === '#senha' || hash === '#cadastro' || hash === '#termos-e-lgpd') {
            $navbarContainer.removeClass('d-flex').addClass('d-none');
            $appContent.removeClass('container mt-4 mb-5 pb-5').addClass('p-0 m-0');
        } else {
            $navbarContainer.removeClass('d-none').addClass('d-flex');
            $appContent.removeClass('p-0 m-0').addClass('container mt-4 mb-5 pb-5');
        }

        // Carrega o HTML da página específica no content principal
        $appContent.hide().load(pageUrl, function(response, status, xhr) {
            if (status === "error") {
                $appContent.html(`<div class="alert alert-danger">Erro 404: Arquivo não encontrado (${pageUrl}).</div>`);
            }
            $appContent.fadeIn(300);
        });

        // Troca a cor dos ícones da Navbar dependendo de onde o usuário clicou
        if ($navbarContainer.children().length > 0) {
            $('.nav-icon-btn').removeClass('nav-icon-active').addClass('nav-icon-outline');
            $(`.nav-icon-btn[href="${hash}"]`).removeClass('nav-icon-outline').addClass('nav-icon-active');
        }
    }
});