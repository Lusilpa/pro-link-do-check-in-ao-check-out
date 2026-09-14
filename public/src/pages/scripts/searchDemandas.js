$(document).ready(function () {

    const allDemands = [
        // ⚠️ MOCK TEMPORÁRIO — campos tipo, modalidade, cidade e prazo NÃO existem na tabela `demandas` do banco.
        // Os filtros por esses campos funcionam apenas com dados mock.
        // Dependem da adição das colunas ao schema (responsabilidade do Backend/BD).
        { id: 1, company: "Tapajós Engenharia", time: "5 min", title: "Emissão de ART para Projeto Estrutural", description: "Profissional habilitado junto ao CREA-AM para projeto detalhado.", area: "Engenharia Civil", tipo: "projeto", modalidade: "presencial", cidade: "Manaus, AM", prazo: "curto", status: "ABERTA", interessados: 12 },
        { id: 2, company: "Amazônia Soluções", time: "2h", title: "EIA/RIMA para Planta Solar", description: "Consultoria para implantação de parque de energia solar no Amazonas.", area: "Agronomia", tipo: "consultoria", modalidade: "hibrido", cidade: "Itacoatiara, AM", prazo: "medio", status: "ABERTA", interessados: 27 },
        { id: 3, company: "Manaus Geotecnia", time: "1d", title: "Laudo de Investigação Geológica", description: "Ensaios SPT e emissão de laudo geológico para terreno urbano.", area: "Geologia e Minas", tipo: "pericia", modalidade: "presencial", cidade: "Manaus, AM", prazo: "curto", status: "FECHADA", interessados: 8 },
        { id: 4, company: "Equatorial Topografia", time: "3d", title: "Georreferenciamento INCRA", description: "Georreferenciamento rural com processo completo para SIGEF/INCRA.", area: "Engenharia Florestal", tipo: "art", modalidade: "presencial", cidade: "Parintins, AM", prazo: "longo", status: "ABERTA", interessados: 5 },
        { id: 5, company: "UFAM", time: "1d", title: "Estágio em Sistemas Embarcados", description: "Vaga para estudante de Engenharia Elétrica com foco em automação.", area: "Engenharia Elétrica", tipo: "estagio", modalidade: "presencial", cidade: "Manaus, AM", prazo: "longo", status: "ABERTA", interessados: 41 },
        { id: 6, company: "CREA-AM", time: "5d", title: "Mentoria para Jovens Profissionais", description: "Mentoria para estagiários em boas práticas da Engenharia de Produção.", area: "Engenharia de Produção", tipo: "mentoria", modalidade: "remoto", cidade: "Manaus, AM", prazo: "medio", status: "ABERTA", interessados: 19 },
        { id: 7, company: "Inst. de Tecnologia", time: "1sem", title: "Pesquisador - Retrofit Histórico", description: "Pesquisa aplicada sobre requalificação energética de edificações tombadas.", area: "Arquitetura", tipo: "pesquisa", modalidade: "hibrido", cidade: "Manaus, AM", prazo: "longo", status: "ABERTA", interessados: 14 }
    ];

    const TIPO_MAP = {
        projeto: { icon: 'bi-diagram-3-fill', label: 'Projeto' },
        consultoria: { icon: 'bi-chat-square-text-fill', label: 'Consultoria' },
        art: { icon: 'bi-file-earmark-check-fill', label: 'ART / CAT' },
        pericia: { icon: 'bi-search', label: 'Perícia' },
        estagio: { icon: 'bi-mortarboard-fill', label: 'Estágio' },
        mentoria: { icon: 'bi-person-check-fill', label: 'Mentoria' },
        pesquisa: { icon: 'bi-book-fill', label: 'Pesquisa' },
        voluntariado: { icon: 'bi-heart-fill', label: 'Voluntariado' },
    };

    // STATUS_MAP — ENUMs alinhados com a coluna `status` da tabela `demandas` no banco (MariaDB)
    const STATUS_MAP = {
        ABERTA:             { icon: 'bi-circle-fill',       label: 'Aberta' },
        FECHADA:            { icon: 'bi-check-circle-fill', label: 'Concluída' },
        CANCELADA:          { icon: 'bi-x-circle-fill',     label: 'Cancelada' },
        SUSPENSA_PELO_CREA: { icon: 'bi-slash-circle-fill', label: 'Suspensa (CREA)' },
    };

    // Inicialização
    loadFilterWidgets();
    renderDemands(allDemands);
    bindTextSearch();
    bindFilterEvent();
    bindDetailCloseEvent();

    function loadFilterWidgets() {
        const url = 'src/entities/demands/layouts/filter-demandas.html';
        const callback = () => { if (typeof initProLinkFilter === 'function') initProLinkFilter(); };
        $('#filterWidgetContainer').load(url, callback);
        $('#mobile-filters-inject-area').load(url, callback);
    }

    function renderDemands(list) {
        const $container = $('#demands-cards-container');
        const count = list.length;
        
        $('#resultsCount').text(`${count} resultado${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`);

        if (count === 0) {
            $container.html('<div class="text-muted py-4">Nenhuma demanda encontrada com estes filtros.</div>');
            return;
        }

        // Monta todos os cards em memória antes de injetar
        let htmlCards = '';
        list.forEach(d => {
            const tipo = TIPO_MAP[d.tipo] || { icon: 'bi-briefcase-fill', label: d.tipo };
            const status = STATUS_MAP[d.status] || { icon: 'bi-circle', label: 'Aberta' };
            const modalidade = d.modalidade ? d.modalidade.charAt(0).toUpperCase() + d.modalidade.slice(1) : 'Presencial';

            htmlCards += `
            <div class="pl-demand-card" data-id="${d.id}">
                <div class="pl-demand-header">
                    <div class="pl-demand-user-info">
                        <div class="pl-demand-avatar"><i class="bi bi-building"></i></div>
                        <div class="pl-demand-meta">
                            <h6 class="pl-demand-company">${d.company}</h6>
                            <span class="pl-demand-time"><i class="bi bi-clock"></i> ${d.time}</span>
                        </div>
                    </div>
                    <button class="pl-demand-menu-btn" onclick="event.stopPropagation()"><i class="bi bi-three-dots-vertical"></i></button>
                </div>
                <div class="pl-demand-badges">
                    <span class="pl-badge pl-badge-status-${d.status}"><i class="bi ${status.icon}"></i> ${status.label}</span>
                    <span class="pl-badge pl-badge-tipo"><i class="bi ${tipo.icon}"></i> ${tipo.label}</span>
                    <span class="pl-badge pl-badge-area"><i class="bi bi-compass"></i> ${d.area}</span>
                </div>
                <div class="pl-demand-body">
                    <h4 class="pl-demand-title">${d.title}</h4>
                    <p class="pl-demand-description">${d.description}</p>
                </div>
                <div class="pl-demand-info-row">
                    <span class="pl-demand-info-item"><i class="bi bi-geo-alt-fill"></i> ${d.cidade}</span>
                    <span class="pl-demand-info-item"><i class="bi bi-laptop"></i> ${modalidade}</span>
                </div>
            </div>`;
        });

        $container.html(htmlCards);
        bindCardClick(list);
    }

    function bindTextSearch() {
        $('#demandSearchInput').on('input', function () {
            const q = $(this).val().toLowerCase().trim();
            if (!q) { renderDemands(allDemands); return; }
            renderDemands(allDemands.filter(d => 
                d.title.toLowerCase().includes(q) || 
                d.company.toLowerCase().includes(q) || 
                d.description.toLowerCase().includes(q)
            ));
        });
    }

    function bindFilterEvent() {
        document.addEventListener('prolink:filter', function (e) {
            const f = e.detail;
            renderDemands(allDemands.filter(d => {
                if (f.area && d.area !== f.area) return false;
                if (f.tipo && d.tipo !== f.tipo) return false;
                if (f.modalidade && d.modalidade !== f.modalidade) return false;
                if (f.prazo && d.prazo !== f.prazo) return false;
                if (f.status && d.status !== f.status) return false;
                return true;
            }));
        });
    }

    function bindCardClick(list) {
        const detailUrl = 'src/entities/demands/layouts/demand-detail.html';
        $('.pl-demand-card').off('click').on('click', function () {
            const demand = list.find(d => d.id === $(this).data('id'));
            if (window.innerWidth <= 1024) {
                $('#mobile-detail-inject-area').load(detailUrl, function () {
                    if (demand && typeof initDemandDetail === 'function') initDemandDetail(demand);
                    new bootstrap.Offcanvas(document.getElementById('mobileDetailOffcanvas')).show();
                });
            } else {
                $('.search-sticky-filter').fadeOut(150, function () {
                    $('.search-main-container').addClass('panel-open');
                    $('#detail-panel-container').load(detailUrl, function () {
                        if (demand && typeof initDemandDetail === 'function') initDemandDetail(demand);
                        $('#detail-panel-container').fadeIn(200);
                    });
                });
            }
        });
    }

    function bindDetailCloseEvent() {
        document.addEventListener('prolink:detail-close', function () {
            $('#detail-panel-container').fadeOut(150, function () { 
                $(this).empty(); 
                $('.search-main-container').removeClass('panel-open'); 
                $('.search-sticky-filter').fadeIn(200);
            });
        });
    }
});