$(document).ready(function() {
    // Mapeamento das rotas
    const routes = {
        // Rotas sem Navbar (Páginas de Login/Auth)
        '': 'src/pages/auth.html',
        '#landing': 'src/pages/landing.html',
        '#auth': 'src/pages/auth.html',
        '#senha': 'src/pages/recuperacao-senha.html',
        '#termos-e-lgpd': 'src/pages/termos-e-lgpd.html',
        '#cadastro': 'src/pages/cadastre-se.html',

        // Rotas com Navbar
        '#feed': 'src/pages/feed.html',
        '#search-demandas': 'src/pages/search-demandas.html',
        '#search-talentos': 'src/pages/search-talentos.html',
        '#cartas': 'src/pages/carta-virtual.html',

        // Rotas adicionais (Admin, Painel Empresarial, Studio de Criação)
        '#perfil': 'src/pages/perfil.html',
        '#criacao': 'src/pages/criacao.html',
        '#admin': 'src/pages/admin.html',
        '#painel-empresa': 'src/pages/painel-empresa.html',
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
                $appContent.html(`<div class="alert alert-danger">Erro 404: Arquivo não encontrado.</div>`);
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