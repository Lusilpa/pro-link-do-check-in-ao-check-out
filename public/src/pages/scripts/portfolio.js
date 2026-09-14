(function initPortfolio() {

    // ==========================================
    // DADOS MOCK
    // ==========================================
    const mockPortfolioData = {
        usuario: {
            nome: "Luan da Silva Palma",
            email: "luan.palma@prolink.com",
            telefone: "(92) 99999-9999",
            perfil_acesso: "USUARIO"
            // localizacao: campo não existe na tabela `usuarios` — aguardando decisão de schema
        },
        profissional: {
            categoria_profissional: "Engenharia de Software",
            grau_academico: "GRADUACAO",
            numero_registro_confea_crea: "123456789-AM",
            registro_validado: true
        },
        portfolio: {
            resumo_profissional: "Desenvolvedor e estudante de Engenharia de Software. Focado no desenvolvimento de sistemas web (React, TypeScript) e back-end (Java/Spring, Python/FastAPI), com interesse especial em Inteligência Artificial e sistemas multi-agentes aplicados à automação de processos administrativos.",
            // links_contato: campo JSON no banco (portfolio.links_contato)
            links_contato: {
                linkedin: "https://linkedin.com/in/luanpalma",
                github: "https://github.com/lusilpa"
            }
        },
        // competencias: tabela associativa `profissional_competencias` com campo `nivel`
        competencias: [
            { nome: "Java (Spring Boot)",       nivel: "AVANCADO" },
            { nome: "Python (FastAPI)",         nivel: "AVANCADO" },
            { nome: "C++",                      nivel: "INTERMEDIARIO" },
            { nome: "React / TypeScript",       nivel: "AVANCADO" },
            { nome: "Sistemas Multi-agentes",   nivel: "INTERMEDIARIO" },
            { nome: "MariaDB",                  nivel: "INTERMEDIARIO" }
        ],
        // acervo_tecnico: derivado de COUNT via JOIN com tabelas `arts` e `cats`
        acervo_tecnico: {
            arts_aprovadas: 3,
            cats_validas: 1
        },
        // experiencias: tabela `experiencias` com FK para `portfolio`
        experiencias: [
            {
                id: 1,
                titulo_posicao_servico: "Auxiliar de Recursos Humanos",
                organizacao_cliente: "Tapajós Perfumaria",
                data_inicio: "Jan 2026",
                data_fim: "Presente",
                descricao_atividades: "Atuação na modernização do departamento de Recursos Humanos, implementando integrações sistêmicas e rotinas de automação para o Departamento Pessoal.",
                // projetos: tabela `projetos` com FK para `portfolio` (relacionado via `projeto_experiencia`)
                projetos: [
                    {
                        titulo: "Projeto Lhumos",
                        descricao: "Desenvolvimento e arquitetura de um sistema chatbot multi-agente alimentado por IA (NLP) para automatizar triaçens e demandas do RH."
                    }
                ]
            },
            {
                id: 2,
                titulo_posicao_servico: "Diretor Estadual",
                organizacao_cliente: "UEE-AM (União Estadual dos Estudantes)",
                data_inicio: "Out 2025",
                data_fim: "Presente",
                descricao_atividades: "Liderança na coordenação de projetos estudantis e organização de eventos voltados à juventude, cultura e tecnologia em âmbito estadual.",
                projetos: [
                    {
                        titulo: "2º Encontro Nacional de Comunicadores",
                        descricao: "Articulação de redes e coordenação tecnológica de painéis focados em ativismo digital e novas mídias."
                    }
                ]
            }
        ]
    };

    // ==========================================
    // FUNÇÕES DE RENDERIZAÇÃO
    // ==========================================

    function renderSidebar(data) {
        $('#portfolioName').text(data.usuario.nome);
        $('#portfolioTitle').text(data.profissional.categoria_profissional);
        $('#portfolioEmail').text(data.usuario.email);

        if (data.profissional.registro_validado) {
            $('#portfolioBadges').html(`
                <span class="pl-badge-crea" title="Registro: ${data.profissional.numero_registro_confea_crea}">
                    <i class="bi bi-patch-check-fill"></i> CREA VALIDADO
                </span>
            `);
        }

        let socialHtml = '';
        if(data.portfolio.links_contato.linkedin) socialHtml += `<a href="${data.portfolio.links_contato.linkedin}" target="_blank"><i class="bi bi-linkedin"></i></a>`;
        if(data.portfolio.links_contato.github)   socialHtml += `<a href="${data.portfolio.links_contato.github}" target="_blank"><i class="bi bi-github"></i></a>`;
        $('#portfolioSocialLinks').html(socialHtml);
    }

    function renderContent(data) {
        $('#portfolioSummary').text(data.portfolio.resumo_profissional);

        let skillsHtml = '';
        // competencias: array de objetos {nome, nivel} — tabela `profissional_competencias`
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

    // Executa imediatamente
    renderSidebar(mockPortfolioData);
    renderContent(mockPortfolioData);

})();