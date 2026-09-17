<<<<<<< Updated upstream
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
        $('#portfolioSocialLinks').html(socialHtml);
=======
window.initPortfolio = function() {
    if (window._portfolioInitialized) return;
    window._portfolioInitialized = true;

    console.log('[Portfolio] Inicializando Perfil Público...');

    // ==========================================
    // DADOS MOCK
    // ==========================================
    const mockPortfolioData = {
        usuario: {
            nome: "Luan da Silva Palma",
            email: "luan.palma@prolink.com",
            telefone: "(92) 99999-9999",
            perfil_acesso: "USUARIO"
        },
        profissional: {
            categoria_profissional: "Engenharia de Software",
            grau_academico: "GRADUACAO",
            numero_registro_confea_crea: "123456789-AM",
            registro_validado: true
        },
        portfolio: {
            resumo_profissional: "Desenvolvedor e estudante de Engenharia de Software. Focado no desenvolvimento de sistemas web (React, TypeScript) e back-end (Java/Spring, Python/FastAPI), com interesse especial em Inteligência Artificial e sistemas multi-agentes aplicados à automação de processos administrativos.",
            links_contato: {
                linkedin: "https://linkedin.com/in/luanpalma",
                github: "https://github.com/lusilpa"
            }
        },
        competencias: [
            { nome: "Java (Spring Boot)",       nivel: "AVANCADO" },
            { nome: "Python (FastAPI, AI)",     nivel: "AVANCADO" },
            { nome: "React / TypeScript",       nivel: "INTERMEDIARIO" },
            { nome: "PostgreSQL / Docker",      nivel: "INTERMEDIARIO" },
            { nome: "UI/UX Design",             nivel: "BASICO" }
        ],
        experiencia: [
            {
                organizacao_cliente: "TechSolutions Inc.",
                titulo_posicao_servico: "Desenvolvedor Full Stack Sênior",
                data_inicio: "Jan/2024",
                data_fim: "Atual",
                descricao_atividades: "Liderança técnica no desenvolvimento de aplicações web empresariais. Implementação de arquiteturas de microserviços e migração de sistemas legados para Cloud (AWS).",
                projetos_realizados: [
                    {
                        titulo_projeto: "Portal do Cliente (B2B)",
                        descricao_projeto: "Plataforma self-service para clientes B2B acompanharem faturamento e métricas em tempo real.",
                        url_referencia: "https://github.com/exemplo/portal-b2b"
                    }
                ]
            },
            {
                organizacao_cliente: "CENATEC Educacional",
                titulo_posicao_servico: "Desenvolvedor Backend (Estágio)",
                data_inicio: "Fev/2023",
                data_fim: "Dez/2023",
                descricao_atividades: "Desenvolvimento de APIs RESTful usando Spring Boot para o sistema acadêmico. Integração com banco de dados PostgreSQL e geração de relatórios PDF automatizados."
            }
        ]
    };

    renderSidebar(mockPortfolioData);
    renderContent(mockPortfolioData);
};

// ==========================================
// FUNÇÕES DE RENDERIZAÇÃO
// ==========================================

function renderSidebar(data) {
    // Info Principal
    $('#portfolioName').text(data.usuario.nome);
    $('#portfolioTitle').text(data.profissional.categoria_profissional);

    // Badges (CREA, Validação)
    let badgesHtml = '';
    if (data.profissional.registro_validado) {
        badgesHtml += `<span class="pl-badge-success"><i class="bi bi-patch-check-fill"></i> CREA Validado</span>`;
    } else {
        badgesHtml += `<span class="pl-badge-primary"><i class="bi bi-info-circle"></i> Em Análise</span>`;
>>>>>>> Stashed changes
    }
    $('#portfolioBadges').html(badgesHtml);

    // Links Sociais
    const links = data.portfolio.links_contato;
    let linksHtml = '';
    if (links) {
        if (links.linkedin) {
            linksHtml += `<a href="${links.linkedin}" target="_blank" class="pl-portfolio-link"><i class="bi bi-linkedin"></i></a>`;
        }
        if (links.github) {
            linksHtml += `<a href="${links.github}" target="_blank" class="pl-portfolio-link"><i class="bi bi-github"></i></a>`;
        }
        if (links.instagram) {
            linksHtml += `<a href="${links.instagram}" target="_blank" class="pl-portfolio-link"><i class="bi bi-instagram"></i></a>`;
        }
    }
    // Adiciona e-mail como link padrão
    linksHtml += `<a href="mailto:${data.usuario.email}" class="pl-portfolio-link"><i class="bi bi-envelope"></i></a>`;
    
    $('#portfolioLinks').html(linksHtml);
}

<<<<<<< Updated upstream
        let skillsHtml = '';
        data.competencias.forEach(skill => {
            skillsHtml += `<span class="pl-skill-badge" title="Nível: ${skill.nivel}">${skill.nome}</span>`;
=======
function renderContent(data) {
    // Sobre Mim
    $('#portfolioAbout').text(data.portfolio.resumo_profissional || 'Nenhum resumo fornecido.');

    // Competências
    let skillsHtml = '';
    if (data.competencias && data.competencias.length > 0) {
        data.competencias.forEach(comp => {
            const nivelClass = comp.nivel ? `pl-skill-level-${comp.nivel.toLowerCase()}` : '';
            skillsHtml += `<div class="pl-skill-badge ${nivelClass}">${comp.nome}</div>`;
>>>>>>> Stashed changes
        });
    } else {
        skillsHtml = '<p class="pl-section-text">Nenhuma competência registrada.</p>';
    }
    $('#portfolioSkills').html(skillsHtml);

    // Experiências e Projetos
    let expHtml = '';
    if (data.experiencia && data.experiencia.length > 0) {
        data.experiencia.forEach(exp => {
            let projHtml = '';
            if (exp.projetos_realizados && exp.projetos_realizados.length > 0) {
                exp.projetos_realizados.forEach(proj => {
                    let link = proj.url_referencia ? ` <a href="${proj.url_referencia}" target="_blank" style="color:var(--prolink-primary)"><i class="bi bi-link-45deg"></i> Ver Projeto</a>` : '';
                    projHtml += `
                        <div class="pl-exp-project">
                            <strong>${proj.titulo_projeto}</strong><br>
                            ${proj.descricao_projeto}
                            ${link}
                        </div>
                    `;
                });
            }

            expHtml += `
                <div class="pl-experience-card">
                    <div class="pl-exp-header">
                        <h4 class="pl-exp-title">${exp.titulo_posicao_servico}</h4>
                        <span class="pl-exp-company">${exp.organizacao_cliente}</span>
                        <div class="pl-exp-date"><i class="bi bi-calendar-event"></i> ${exp.data_inicio} — ${exp.data_fim}</div>
                    </div>
                    <p class="pl-section-text" style="margin-bottom: 1rem;">${exp.descricao_atividades}</p>
                    ${projHtml}
                </div>
            `;
        });
    } else {
        expHtml = '<p class="pl-section-text">Nenhuma experiência registrada.</p>';
    }
    $('#portfolioExperience').html(expHtml);
}

<<<<<<< Updated upstream
    // ==========================================
    // ESTADO DE ERRO
    // ==========================================

    function renderError(message) {
        $('#portfolioName').text('Erro ao carregar');
        $('#portfolioTitle').text('');
        $('#portfolioSummary').text(message);
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
=======
// Reseta a flag para recarregar se sair da página
window.addEventListener('hashchange', function() {
    if (window.location.hash !== '#perfil') {
        window._portfolioInitialized = false;
    }
});
>>>>>>> Stashed changes
