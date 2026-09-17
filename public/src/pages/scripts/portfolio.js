// ================================================================
// Script de Página: Portfólio
// Local sugerido: pages/scripts/portfolio.js (substitui o atual)
// Depende de shared/api/portfolio.js já carregado antes deste
// script no portfolio.html (usa a função fetchPortfolio)
// ================================================================
(function initPortfolio() {

    // ==========================================
    // FUNÇÕES DE RENDERIZAÇÃO
    // (idênticas às originais — só a origem dos dados muda)
    // ==========================================

    function renderSidebar(data) {
        $('#portfolioName').text(data.usuario.nome);
        $('#portfolioTitle').text(data.profissional.categoria_profissional);
        $('#portfolioEmail').text(data.usuario.email);
        const cidade = (data.usuario?.cidade || '').trim();
        const estado = (data.usuario?.estado || '').trim();
        const localizacao = [cidade, estado].filter(Boolean).join(' - ');
        $('#portfolioLocation').text(localizacao || 'Não informada');

        if (data.profissional.registro_validado) {
            $('#portfolioBadges').html(`
                <span class="pl-badge-crea" title="Registro: ${data.profissional.numero_registro_confea_crea}">
                    <i class="bi bi-patch-check-fill"></i> CREA VALIDADO
                </span>
            `);
        } else {
            $('#portfolioBadges').empty();
        }

        let socialHtml = '';
        if (data.portfolio.links_contato.linkedin) socialHtml += `<a href="${data.portfolio.links_contato.linkedin}" target="_blank"><i class="bi bi-linkedin"></i></a>`;
        if (data.portfolio.links_contato.github) socialHtml += `<a href="${data.portfolio.links_contato.github}" target="_blank"><i class="bi bi-github"></i></a>`;
        // ID real do container em portfolio.html é #portfolioLinks (não #portfolioSocialLinks
        // - esse ID não existe na página, então os links nunca apareciam).
        $('#portfolioLinks').html(socialHtml);
    }

    function renderContent(data) {
        // ID real do parágrafo em portfolio.html é #portfolioAbout (não #portfolioSummary
        // - esse ID não existe na página, então o resumo nunca aparecia).
        $('#portfolioAbout').text(data.portfolio.resumo_profissional || 'Nenhuma informação adicionada ainda.');

        let skillsHtml = '';
        data.competencias.forEach(skill => {
            skillsHtml += `<span class="pl-skill-badge" title="Nível: ${skill.nivel}">${skill.nome}</span>`;
        });
        $('#portfolioSkills').html(skillsHtml);

        $('#portfolioAcervo').html(`
            <div class="pl-acervo-card">
                <h4>${data.acervo_tecnico.arts_aprovadas}</h4>
                <span>ARTs Aprovadas</span>
            </div>
            <div class="pl-acervo-card">
                <h4>${data.acervo_tecnico.cats_validas}</h4>
                <span>CATs Válidas</span>
            </div>
        `);

        // Projetos do portfólio (nível principal, não exige vínculo com uma experiência
        // - ver PortfolioController::show(), campo "projetos"). Os vinculados a uma
        // experiência específica continuam aparecendo também dentro dela, mais abaixo.
        renderProjetos(data.projetos || []);

        let expHtml = '';
        data.experiencias.forEach(exp => {
            let projHtml = '';
            if (exp.projetos && exp.projetos.length > 0) {
                projHtml += `<div class="pl-project-list">`;
                exp.projetos.forEach(proj => {
                    projHtml += `
                        <div class="pl-project-item">
                            <h5 class="pl-project-title"><i class="bi bi-rocket-takeoff"></i> ${proj.titulo}</h5>
                            <p class="pl-project-desc">${proj.descricao}</p>
                        </div>
                    `;
                });
                projHtml += `</div>`;
            }

            expHtml += `
                <div class="pl-experience-card">
                    <div class="pl-exp-header">
                        <h4 class="pl-exp-title">${exp.titulo_posicao_servico}</h4>
                        <span class="pl-exp-company">${exp.organizacao_cliente}</span>
                        <div class="pl-exp-date">${exp.data_inicio} — ${exp.data_fim}</div>
                    </div>
                    <p class="pl-section-text">${exp.descricao_atividades}</p>
                    ${projHtml}
                </div>
            `;
        });
        $('#portfolioExperience').html(expHtml);
    }

    // Renderiza a lista de projetos do portfólio, com a galeria de imagens (se houver
    // - ver ProjetoController::store()/update() e projeto_imagens).
    function renderProjetos(projetos) {
        const $container = $('#portfolioProjects');
        if (!$container.length) return;

        if (!projetos || projetos.length === 0) {
            $container.html('<p class="pl-section-text" style="opacity: 0.6;">Nenhum projeto cadastrado ainda.</p>');
            return;
        }

        let html = '';
        projetos.forEach(proj => {
            const galeriaHtml = (proj.imagens && proj.imagens.length > 0)
                ? `<div class="pl-project-gallery">${proj.imagens.map(url => `<img src="${url}" alt="Imagem do projeto ${proj.titulo}">`).join('')}</div>`
                : '';

            html += `
                <div class="pl-project-item">
                    <h5 class="pl-project-title"><i class="bi bi-rocket-takeoff"></i> ${proj.titulo}</h5>
                    <p class="pl-project-desc">${proj.descricao || ''}</p>
                    ${galeriaHtml}
                </div>
            `;
        });
        $container.html(html);
    }

    // ==========================================
    // ESTADO DE ERRO
    // ==========================================

    function renderError(message) {
        $('#portfolioName').text('Erro ao carregar');
        $('#portfolioTitle').text('');
        // ID real e #portfolioAbout - ver mesma correcao em renderContent().
        $('#portfolioAbout').text(message);
    }

    // ==========================================
    // CARREGAMENTO REAL DOS DADOS
    // ==========================================

    async function loadPortfolio() {
        // Se a URL tiver ?id=123, busca o portfólio PÚBLICO desse usuário.
        // Se não tiver, busca o portfólio do usuário LOGADO (o "meu perfil").
        // Ajuste este trecho se o projeto usar outro esquema de rota
        // (ex: hash tipo #portfolio/123) — o importante é extrair o ID aqui.
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('id');

        const result = await fetchPortfolio(userId);

        if (!result.success) {
            renderError(result.message);
            return;
        }

        renderSidebar(result.data);
        renderContent(result.data);
    }

    loadPortfolio();

})();