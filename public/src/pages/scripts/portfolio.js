(function initPortfolio() {

    // ==========================================
    // DADOS MOCK
    // ==========================================
    const mockPortfolioData = {
        usuario: {
            nome: "Luan da Silva Palma",
            email: "luan.palma@prolink.com",
            telefone: "(92) 99999-9999",
            localizacao: "Manaus, AM",
            perfil_acesso: "USUARIO"
        },
        profissional: {
            categoria: "Engenharia de Software",
            grau: "GRADUACAO",
            registro_confea: "123456789-AM",
            registro_validado: true
        },
        portfolio: {
            resumo: "Desenvolvedor e estudante de Engenharia de Software. Focado no desenvolvimento de sistemas web (React, TypeScript) e back-end (Java/Spring, Python/FastAPI), com interesse especial em Inteligência Artificial e sistemas multi-agentes aplicados à automação de processos administrativos.",
            links: {
                linkedin: "https://linkedin.com/in/luanpalma",
                github: "https://github.com/lusilpa"
            }
        },
        competencias: [
            "Java (Spring Boot)", "Python (FastAPI)", "C++", 
            "React / TypeScript", "Sistemas Multi-agentes", "MariaDB"
        ],
        acervo_tecnico: {
            arts_aprovadas: 3,
            cats_validas: 1
        },
        experiencias: [
            {
                id: 1,
                cargo: "Auxiliar de Recursos Humanos",
                empresa: "Tapajós Perfumaria",
                data_inicio: "Jan 2026",
                data_fim: "Presente",
                descricao: "Atuação na modernização do departamento de Recursos Humanos, implementando integrações sistêmicas e rotinas de automação para o Departamento Pessoal.",
                projetos: [
                    {
                        titulo: "Projeto Lhumos",
                        descricao: "Desenvolvimento e arquitetura de um sistema chatbot multi-agente alimentado por IA (NLP) para automatizar triagens e demandas do RH."
                    }
                ]
            },
            {
                id: 2,
                cargo: "Diretor Estadual",
                empresa: "UEE-AM (União Estadual dos Estudantes)",
                data_inicio: "Out 2025",
                data_fim: "Presente",
                descricao: "Liderança na coordenação de projetos estudantis e organização de eventos voltados à juventude, cultura e tecnologia em âmbito estadual.",
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
        $('#portfolioTitle').text(data.profissional.categoria);
        $('#portfolioLocation').text(data.usuario.localizacao);
        $('#portfolioEmail').text(data.usuario.email);

        if (data.profissional.registro_validado) {
            $('#portfolioBadges').html(`
                <span class="pl-badge-crea" title="Registro: ${data.profissional.registro_confea}">
                    <i class="bi bi-patch-check-fill"></i> CREA VALIDADO
                </span>
            `);
        }

        let socialHtml = '';
        if(data.portfolio.links.linkedin) socialHtml += `<a href="${data.portfolio.links.linkedin}" target="_blank"><i class="bi bi-linkedin"></i></a>`;
        if(data.portfolio.links.github) socialHtml += `<a href="${data.portfolio.links.github}" target="_blank"><i class="bi bi-github"></i></a>`;
        $('#portfolioSocialLinks').html(socialHtml);
    }

    function renderContent(data) {
        $('#portfolioSummary').text(data.portfolio.resumo);

        let skillsHtml = '';
        data.competencias.forEach(skill => {
            skillsHtml += `<span class="pl-skill-badge">${skill}</span>`;
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
                        <h4 class="pl-exp-title">${exp.cargo}</h4>
                        <span class="pl-exp-company">${exp.empresa}</span>
                        <div class="pl-exp-date">${exp.data_inicio} — ${exp.data_fim}</div>
                    </div>
                    <p class="pl-section-text">${exp.descricao}</p>
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