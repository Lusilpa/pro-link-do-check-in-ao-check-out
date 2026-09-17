$(document).ready(function () {

    // Estado combinado da busca textual + filtros do widget, para que aplicar um
    // não descarte o outro (mesmo padrão usado no feed e na busca de talentos).
    let currentFilters = { busca: '', area: '', tipo: '', modalidade: '', prazo: '', status: '' };
    let currentList = [];

    const TIPO_MAP = {
        PROJETO: { icon: 'bi-diagram-3-fill', label: 'Projeto' },
        CONSULTORIA: { icon: 'bi-chat-square-text-fill', label: 'Consultoria' },
        ART: { icon: 'bi-file-earmark-check-fill', label: 'ART / CAT' },
        PERICIA: { icon: 'bi-search', label: 'Perícia' },
        ESTAGIO: { icon: 'bi-mortarboard-fill', label: 'Estágio' },
        MENTORIA: { icon: 'bi-person-check-fill', label: 'Mentoria' },
        PESQUISA: { icon: 'bi-book-fill', label: 'Pesquisa' },
        VOLUNTARIADO: { icon: 'bi-heart-fill', label: 'Voluntariado' },
    };

    // STATUS_MAP — ENUMs alinhados com a coluna `status` da tabela `demandas` no banco (MariaDB)
    const STATUS_MAP = {
        ABERTA:             { icon: 'bi-circle-fill',       label: 'Aberta' },
        FECHADA:            { icon: 'bi-check-circle-fill', label: 'Concluída' },
        CANCELADA:          { icon: 'bi-x-circle-fill',     label: 'Cancelada' },
        SUSPENSA_PELO_CREA: { icon: 'bi-slash-circle-fill', label: 'Suspensa (CREA)' },
    };

    // Formata data_publicacao (vinda do backend como "YYYY-MM-DD HH:MM:SS") como tempo
    // relativo abreviado, no mesmo estilo do mock original ("5 min", "2h", "1d", "1sem").
    function formatTempoAbreviado(dataIso) {
        if (!dataIso) return '';
        const diffMs = Date.now() - new Date(dataIso.replace(' ', 'T')).getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'agora';
        if (diffMin < 60) return `${diffMin} min`;
        const diffH = Math.floor(diffMin / 60);
        if (diffH < 24) return `${diffH}h`;
        const diffDias = Math.floor(diffH / 24);
        if (diffDias < 7) return `${diffDias}d`;
        return `${Math.floor(diffDias / 7)}sem`;
    }

    // Inicialização
    loadFilterWidgets();
    bindTextSearch();
    bindFilterEvent();
    bindDetailCloseEvent();
    search();

    async function search() {
        const $container = $('#demands-cards-container');
        $container.html('<div class="text-center text-muted py-4">Carregando demandas…</div>');

        currentList = await fetchAllDemands(currentFilters);
        renderDemands(currentList);
    }

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
            const modalidade = d.modalidade ? d.modalidade.charAt(0) + d.modalidade.slice(1).toLowerCase() : 'Presencial';

            htmlCards += `
            <div class="pl-demand-card" data-id="${d.id}">
                <div class="pl-demand-header">
                    <div class="pl-demand-user-info">
                        <div class="pl-demand-avatar"><i class="bi bi-building"></i></div>
                        <div class="pl-demand-meta">
                            <h6 class="pl-demand-company">${d.company || 'Empresa'}</h6>
                            <span class="pl-demand-time"><i class="bi bi-clock"></i> ${formatTempoAbreviado(d.dataPublicacao)}</span>
                        </div>
                    </div>
                    <button class="pl-demand-menu-btn" onclick="event.stopPropagation()"><i class="bi bi-three-dots-vertical"></i></button>
                </div>
                <div class="pl-demand-badges">
                    <span class="pl-badge pl-badge-status-${d.status}"><i class="bi ${status.icon}"></i> ${status.label}</span>
                    <span class="pl-badge pl-badge-tipo"><i class="bi ${tipo.icon}"></i> ${tipo.label}</span>
                    <span class="pl-badge pl-badge-area"><i class="bi bi-compass"></i> ${d.area || 'Engenharia'}</span>
                </div>
                <div class="pl-demand-body">
                    <h4 class="pl-demand-title">${d.titulo}</h4>
                    <p class="pl-demand-description">${d.descricao}</p>
                </div>
                <div class="pl-demand-info-row">
                    <span class="pl-demand-info-item"><i class="bi bi-geo-alt-fill"></i> ${d.cidade ? `${d.cidade}, ${d.uf}` : 'Manaus, AM'}</span>
                    <span class="pl-demand-info-item"><i class="bi bi-laptop"></i> ${modalidade}</span>
                </div>
            </div>`;
        });

        $container.html(htmlCards);
        bindCardClick(list);
    }

    function bindTextSearch() {
        let debounceTimer;
        $('#demandSearchInput').on('input', function () {
            clearTimeout(debounceTimer);
            const busca = $(this).val().trim();
            debounceTimer = setTimeout(() => {
                currentFilters = { ...currentFilters, busca };
                search();
            }, 400);
        });
    }

    function bindFilterEvent() {
        document.addEventListener('prolink:filter', function (e) {
            const f = e.detail;
            currentFilters = {
                ...currentFilters,
                area: f.area || '',
                tipo: f.tipo || '',
                modalidade: f.modalidade || '',
                prazo: f.prazo || '',
                status: f.status || '',
            };
            search();
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
