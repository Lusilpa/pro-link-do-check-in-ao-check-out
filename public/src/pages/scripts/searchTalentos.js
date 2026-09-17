(function initSearchTalents() {

    // Estado combinado da busca textual + filtros do widget (area/grau/crea), para que
    // aplicar um não descarte o outro. `nivel`/`modalidade` do widget não têm campo real
    // no banco para profissionais/universitarios - não são enviados ao backend.
    let currentFilters = { nome: '', area: '', grau: '', crea: '' };
    let currentList = [];

    loadFilterWidgets();
    bindTextSearch();
    bindFilterEvent();
    bindTalentDetailCloseEvent();
    search();

    async function search() {
        const $container = $('#talents-cards-container');
        $container.html('<div class="text-center text-muted py-4">Carregando talentos…</div>');

        currentList = await fetchTalentos(currentFilters);
        renderTalentsCards(currentList);
    }

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
            // `numero_registro_confea_crea` vem null do backend para universitarios.
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
                    <p class="pl-talent-summary">${t.resumo_profissional || 'Resumo profissional não disponibilizado.'}</p>
                    <div class="pl-talent-skills">${skillsHtml}</div>
                </div>
            </div>`;
        });

        $container.html(htmlCards);
        bindCardClick(list);
    }

    function bindTextSearch() {
        let debounceTimer;
        $('#talentSearchInput').on('input', function () {
            clearTimeout(debounceTimer);
            const nome = $(this).val().trim();
            debounceTimer = setTimeout(() => {
                currentFilters = { ...currentFilters, nome };
                search();
            }, 400);
        });
    }

    function bindFilterEvent() {
        document.addEventListener('prolink:filter-talents', function (e) {
            const f = e.detail;
            currentFilters = { ...currentFilters, area: f.area || '', grau: f.grau || '', crea: f.crea || '' };
            search();
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
