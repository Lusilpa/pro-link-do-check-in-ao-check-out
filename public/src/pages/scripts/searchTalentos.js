(function initSearchTalents() {

    // AVISO: campos `titulo`, `is_student`, `area`, `instituicao`, `nivel_semestre` e `localizacao`
    // NÃO existem como colunas diretas no banco. São derivados/calculados pelo backend.
    // `habilidades` reestruturado para [{nome, nivel}] conforme tabela `profissional_competencias`.
    const allTalents = [
        {
            id: 1,
            nome: "Luan da Silva Palma",
            // titulo: derivado de `curso` pelo backend
            resumo_profissional: "Desenvolvedor de sistemas web (React, TypeScript) e back-end (Java/Spring, Python/FastAPI), com interesse em Inteligência Artificial e sistemas multi-agentes aplicados a RH.",
            // is_student: calculado (EXISTS em `universitarios`) pelo backend
            numero_registro_confea_crea: null,
            categoria_profissional: "Engenharia de Software",
            // instituicao: via JOIN com `universidades.nome`
            semestre_atual: 4,
            // localizacao: não existe no banco
            competencias: [
                { nome: "Python",                nivel: "AVANCADO" },
                { nome: "Java",                  nivel: "AVANCADO" },
                { nome: "React",                 nivel: "AVANCADO" },
                { nome: "Sistemas Multi-agentes",nivel: "INTERMEDIARIO" },
                { nome: "C++",                   nivel: "INTERMEDIARIO" }
            ],
            acervo_tecnico: null,
            experiencias: [
                {
                    titulo_posicao_servico: "Auxiliar de Recursos Humanos", organizacao_cliente: "Tapajós Perfumaria", data_inicio: "Jan 2026", data_fim: "Presente",
                    descricao_atividades: "Implementação de integrações sistêmicas e rotinas de automação para o Departamento Pessoal.",
                    projetos: [{ titulo: "Projeto Lhumos", descricao: "Chatbot multi-agente alimentado por IA (NLP) para automatizar rotinas de RH." }]
                },
                {
                    titulo_posicao_servico: "Diretor Estadual", organizacao_cliente: "UEE-AM", data_inicio: "Out 2025", data_fim: "Presente",
                    descricao_atividades: "Liderança na coordenação de projetos estudantis e eventos de tecnologia em âmbito estadual."
                }
            ]
        },
        {
            id: 2,
            nome: "Hanna Reis",
            // titulo: derivado de `categoria_profissional` pelo backend
            resumo_profissional: "Especialista em cálculo estrutural e laudos técnicos de grandes obras de infraestrutura no Polo Industrial de Manaus.",
            // is_student: false (calculado pelo backend)
            numero_registro_confea_crea: "Ativo",
            categoria_profissional: "Engenharia Civil",
            // instituicao: via `experiencias.organizacao_cliente`
            // localizacao: não existe no banco
            competencias: [
                { nome: "AutoCAD",             nivel: "AVANCADO" },
                { nome: "Eberick",             nivel: "AVANCADO" },
                { nome: "Fundações Profundas", nivel: "AVANCADO" }
            ],
            acervo_tecnico: { arts_aprovadas: 45, cats_validas: 12 },
            experiencias: [
                {
                    titulo_posicao_servico: "Engenheira Responsável", organizacao_cliente: "Amazon Construções", data_inicio: "Jan 2020", data_fim: "Presente",
                    descricao_atividades: "Assinatura técnica de galpões logísticos e laudos estruturais.",
                    projetos: []
                }
            ]
        }
    ];

    loadFilterWidgets();
    renderTalentsCards(allTalents);
    bindTextSearch();
    bindFilterEvent();
    bindTalentDetailCloseEvent();

    function loadFilterWidgets() {
        const url = 'src/entities/talentos/layouts/filter-talentos.html';
        
        $('#filterWidgetContainer').load(url, function(response, status, xhr) {
            if (status == "error") {
                console.error("Erro ao carregar o filtro lateral. O arquivo não foi encontrado no caminho: " + url);
                $('#filterWidgetContainer').html('<div style="color:red; padding:20px;">Filtro não encontrado. Verifique o console.</div>');
            } else {
                if (typeof initTalentsFilter === 'function') initTalentsFilter();
            }
        });
    }

    function renderTalentsCards(list) {
        const $container = $('#talents-cards-container');
        const count = list.length;
        
        $('#resultsCount').text(`${count} talento${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`);

        if (count === 0) {
            $container.html('<div class="text-muted py-4">Nenhum talento encontrado com os critérios informados.</div>');
            return;
        }

        let htmlCards = '';
        list.forEach(t => {
            // `is_student` e `numero_registro_confea_crea` são campos derivados/calculados pelo backend
            const temRegistro = t.numero_registro_confea_crea && t.numero_registro_confea_crea !== 'null';
            const identityBadge = !temRegistro
                ? `<span class="pl-badge pl-badge-student"><i class="bi bi-mortarboard-fill"></i> UNIVERSITÁRIO</span>`
                : `<span class="pl-badge pl-badge-crea"><i class="bi bi-patch-check-fill"></i> CREA ${t.numero_registro_confea_crea}</span>`;

            // competencias: array de objetos {nome, nivel} — tabela `profissional_competencias`
            const skillsHtml = (t.competencias || []).slice(0, 4).map(c =>
                `<span class="pl-skill-tag" title="Nível: ${c.nivel}">${c.nome}</span>`
            ).join('');

            htmlCards += `
            <div class="pl-talent-card" data-id="${t.id}">
                <div class="pl-talent-header">
                    <div class="pl-talent-user-info">
                        <div class="pl-talent-avatar"><i class="bi bi-person-bounding-box"></i></div>
                        <div class="pl-talent-meta">
                            <h6 class="pl-talent-name">${t.nome}</h6>
                            <span class="pl-talent-title">${t.categoria_profissional}</span>
                        </div>
                    </div>
                </div>
                <div class="pl-talent-badges">
                    ${identityBadge}
                    <span class="pl-badge pl-badge-area"><i class="bi bi-compass"></i> ${t.categoria_profissional}</span>
                </div>
                <div class="pl-talent-body">
                    <p class="pl-talent-summary">${t.resumo_profissional}</p>
                    <div class="pl-talent-skills">${skillsHtml}</div>
                </div>
            </div>`;
        });

        $container.html(htmlCards);
        bindCardClick(list);
    }

    function bindTextSearch() {
        $('#talentSearchInput').on('input', function () {
            const q = $(this).val().toLowerCase().trim();
            if (!q) { renderTalentsCards(allTalents); return; }
            renderTalentsCards(allTalents.filter(t => 
                t.nome.toLowerCase().includes(q) || 
                (t.competencias || []).some(c => c.nome.toLowerCase().includes(q)) ||
                t.categoria_profissional.toLowerCase().includes(q)
            ));
        });
    }

    function bindFilterEvent() {
        document.addEventListener('prolink:filter-talents', function (e) {
            const f = e.detail;
            renderTalentsCards(allTalents.filter(t => {
                // `area` mapeado para `categoria_profissional` (coluna real do banco)
                if (f.area && t.categoria_profissional !== f.area) return false;
                return true;
            }));
        });
    }

    function bindCardClick(list) {
        const detailUrl = 'src/entities/talentos/layouts/detail-talentos.html';
        $('.pl-talent-card').off('click').on('click', function () {
            const talent = list.find(t => t.id === $(this).data('id'));
            
            if (window.innerWidth <= 1024) {
                $('#mobile-detail-inject-area').load(detailUrl, function () {
                    if (talent && typeof initTalentDetail === 'function') initTalentDetail(talent);
                    new bootstrap.Offcanvas(document.getElementById('mobileDetailOffcanvas')).show();
                });
            } else {
                $('.search-sticky-filter').fadeOut(150, function () {
                    $('.search-main-container').addClass('panel-open');
                    $('#detail-panel-container').load(detailUrl, function () {
                        if (talent && typeof initTalentDetail === 'function') initTalentDetail(talent);
                        $('#detail-panel-container').fadeIn(200);
                    });
                });
            }
        });
    }

    function bindTalentDetailCloseEvent() {
        document.addEventListener('prolink:talent-detail-close', function () {
            $('#detail-panel-container').fadeOut(150, function () { 
                $(this).empty(); 
                $('.search-main-container').removeClass('panel-open'); 
                $('.search-sticky-filter').fadeIn(200);
            });
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('mobileDetailOffcanvas'));
            if (bsOffcanvas) bsOffcanvas.hide();
        });
    }
})();