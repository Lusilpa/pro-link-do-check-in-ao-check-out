// Fallback caso o backend esteja indisponível (mesmo padrão de mock usado em shared/api).
// "var": este script e injetado duas vezes (widget desktop + mobile) via jQuery .load(),
// reexecutando no mesmo escopo global - um "const" aqui lançaria "Identifier already
// declared" na segunda injeção (mesmo bug que ja ocorreu com API_BASE_URL em _http.js).
var AREAS_CREA_MOCK = [
    { id: 1, name: "Engenharia Civil" },
    { id: 2, name: "Engenharia Elétrica" },
    { id: 3, name: "Engenharia Mecânica" },
    { id: 4, name: "Agronomia" },
    { id: 5, name: "Engenharia Florestal" },
    { id: 6, name: "Geologia e Minas" },
    { id: 7, name: "Engenharia Química" },
    { id: 8, name: "Segurança do Trabalho" }
];

// Busca o catálogo real de especialidades (GET /especialidades - leitura pública).
async function fetchAreasCrea() {
    try {
        const response = await apiRequest('/especialidades');
        return (response.data || []).map(esp => ({ id: esp.id, name: esp.nome }));
    } catch (error) {
        console.warn('[Pro-Link API] Especialidades indisponíveis. Usando dados sintéticos.', error.message);
        return AREAS_CREA_MOCK;
    }
}

async function initProLinkFilter() {
    const areas = await fetchAreasCrea();

    // Injeta as áreas do CREA em todos os filtros renderizados
    document.querySelectorAll('.filterArea').forEach(areaSelect => {
        if(areaSelect.children.length > 1) return; // Evita duplicar opções

        areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area.name;
            option.textContent = area.name;
            areaSelect.appendChild(option);
        });
    });

    // Lógica inteligente de clique para o botão "Aplicar"
    document.querySelectorAll('.btnApplyFilter').forEach(btn => {
        // Clonamos o botão para evitar que cliques sejam registrados duas vezes
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', function(e) {
            // e.target.closest encontra exatamente de qual menu (desktop ou mobile) o clique veio
            const widget = e.target.closest('.pl-filter-widget');
            const grau = widget.querySelector('.filterGrau').value;
            const area = widget.querySelector('.filterArea').value;
            const ordem = widget.querySelector('.filterCronologia').value;

            if (typeof window.applyFeedFilters === 'function') {
                window.applyFeedFilters({ grau, area, ordem });
            }
        });
    });

    // Lógica inteligente de clique para o botão "Limpar"
    document.querySelectorAll('.btnClearFilter').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', function(e) {
            const widget = e.target.closest('.pl-filter-widget');
            widget.querySelector('.filterGrau').value = "";
            widget.querySelector('.filterArea').value = "";
            widget.querySelector('.filterCronologia').value = "desc";

            if (typeof window.applyFeedFilters === 'function') {
                window.applyFeedFilters({ grau: '', area: '', ordem: 'desc' });
            }
        });
    });
}

initProLinkFilter();