(function initSearchTalents() {

    const allTalents = [
        {
            id: 1,
            nome: "Luan da Silva Palma",
            titulo: "Estudante de Engenharia de Software",
            resumo: "Desenvolvedor de sistemas web (React, TypeScript) e back-end (Java/Spring, Python/FastAPI), com interesse em Inteligência Artificial e sistemas multi-agentes aplicados a RH.",
            is_student: true,
            registro_crea: null,
            area: "Engenharia de Software",
            instituicao: "Tapajós Perfumaria",
            nivel_semestre: "4º Período",
            localizacao: "Manaus, AM",
            habilidades: ["Python", "Java", "React", "Sistemas Multi-agentes", "C++"],
            acervo_tecnico: null, 
            experiencias: [
                {
                    cargo: "Auxiliar de Recursos Humanos", empresa: "Tapajós Perfumaria", data_inicio: "Jan 2026", data_fim: "Presente",
                    descricao: "Implementação de integrações sistêmicas e rotinas de automação para o Departamento Pessoal.",
                    projetos: [{ titulo: "Projeto Lhumos", descricao: "Chatbot multi-agente alimentado por IA (NLP) para automatizar rotinas de RH." }]
                },
                {
                    cargo: "Diretor Estadual", empresa: "UEE-AM", data_inicio: "Out 2025", data_fim: "Presente",
                    descricao: "Liderança na coordenação de projetos estudantis e eventos de tecnologia em âmbito estadual."
                }
            ]
        },
        {
            id: 2,
            nome: "Hanna Reis",
            titulo: "Engenheira Civil Sênior",
            resumo: "Especialista em cálculo estrutural e laudos técnicos de grandes obras de infraestrutura no Polo Industrial de Manaus.",
            is_student: false,
            registro_crea: "Ativo",
            area: "Engenharia Civil",
            instituicao: "Amazon Construções",
            nivel_semestre: "Sênior",
            localizacao: "Manaus, AM",
            habilidades: ["AutoCAD", "Eberick", "Fundações Profundas"],
            acervo_tecnico: { arts_aprovadas: 45, cats_validas: 12 },
            experiencias: [
                {
                    cargo: "Engenheira Responsável", empresa: "Amazon Construções", data_inicio: "Jan 2020", data_fim: "Presente",
                    descricao: "Assinatura técnica de galpões logísticos e laudos estruturais.",
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
            const identityBadge = t.is_student 
                ? `<span class="pl-badge pl-badge-student"><i class="bi bi-mortarboard-fill"></i> UNIVERSITÁRIO</span>`
                : `<span class="pl-badge pl-badge-crea"><i class="bi bi-patch-check-fill"></i> CREA ${t.registro_crea}</span>`;

            const institutionIcon = t.is_student ? 'bi-building' : 'bi-briefcase-fill';
            const skillsHtml = t.habilidades.slice(0, 4).map(skill => `<span class="pl-skill-tag">${skill}</span>`).join('');

            htmlCards += `
            <div class="pl-talent-card" data-id="${t.id}">
                <div class="pl-talent-header">
                    <div class="pl-talent-user-info">
                        <div class="pl-talent-avatar"><i class="bi bi-person-bounding-box"></i></div>
                        <div class="pl-talent-meta">
                            <h6 class="pl-talent-name">${t.nome}</h6>
                            <span class="pl-talent-title">${t.titulo}</span>
                        </div>
                    </div>
                </div>
                <div class="pl-talent-badges">
                    ${identityBadge}
                    <span class="pl-badge pl-badge-area"><i class="bi bi-compass"></i> ${t.area}</span>
                </div>
                <div class="pl-talent-body">
                    <p class="pl-talent-summary">${t.resumo}</p>
                    <div class="pl-talent-skills">${skillsHtml}</div>
                </div>
                <div class="pl-talent-info-row">
                    <span class="pl-talent-info-item"><i class="bi bi-geo-alt-fill"></i> ${t.localizacao}</span>
                    <span class="pl-talent-info-item"><i class="bi ${institutionIcon}"></i> ${t.instituicao}</span>
                    <span class="pl-talent-info-item"><i class="bi bi-bar-chart-fill"></i> ${t.nivel_semestre}</span>
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
                t.habilidades.some(h => h.toLowerCase().includes(q)) || 
                t.titulo.toLowerCase().includes(q)
            ));
        });
    }

    function bindFilterEvent() {
        document.addEventListener('prolink:filter-talents', function (e) {
            const f = e.detail;
            renderTalentsCards(allTalents.filter(t => {
                if (f.area && t.area !== f.area) return false;
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