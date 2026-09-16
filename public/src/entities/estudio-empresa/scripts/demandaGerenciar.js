(function () {
    const loadingEl = document.getElementById('demandaGerenciar-loading');
    const emptyEl = document.getElementById('demandaGerenciar-empty');
    const errorEl = document.getElementById('demandaGerenciar-error');
    const errorMsg = document.getElementById('demandaGerenciar-error-msg');
    const listEl = document.getElementById('demandaGerenciar-list');

    /**
     * Renderiza a lista de demandas ativas.
     * @param {Array} demandas — Array de objetos do endpoint GET /api/demandas
     * Cada objeto deve ter: { id, titulo, status, data_publicacao, total_candidatos }
     */
    function renderDemandas(demandas) {
        loadingEl.classList.add('d-none');

        if (!demandas || demandas.length === 0) {
            emptyEl.classList.remove('d-none');
            return;
        }

        listEl.innerHTML = '';
        demandas.forEach(function (d) {
            const card = document.createElement('div');
            card.className = 'pl-estudio-item-card';
            card.setAttribute('data-demanda-id', d.id);
            card.innerHTML =
                '<div class="pl-estudio-item-info">' +
                '<h5>' + d.titulo + '</h5>' +
                '<p><i class="bi bi-people-fill"></i> ' + (d.total_candidatos || 0) + ' candidatos • Publicada em: ' + formatDate(d.data_publicacao) + '</p>' +
                '</div>' +
                '<div class="pl-estudio-item-actions">' +
                '<button class="pl-estudio-item-btn btn-editar-demanda" data-demanda-id="' + d.id + '" title="Editar Vaga">' +
                '<i class="bi bi-pencil"></i>' +
                '</button>' +
                '<button class="pl-estudio-item-btn btn-ver-candidatos" data-demanda-id="' + d.id + '" title="Ver Candidatos">' +
                '<i class="bi bi-person-lines-fill"></i>' +
                '</button>' +
                '</div>';
            listEl.appendChild(card);
        });

        listEl.classList.remove('d-none');
        bindActions();
    }

    function bindActions() {
        // TODO: Navegar para edição individual da demanda
        document.querySelectorAll('.btn-editar-demanda').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-demanda-id');
                // TODO: window.location.hash = '#demanda-editar?id=' + id;
                console.log('TODO: Editar demanda ID', id);
            });
        });

        document.querySelectorAll('.btn-ver-candidatos').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-demanda-id');
                window.location.hash = '#candidatos-analisar';
                // TODO: Passar o id da demanda como filtro
                console.log('TODO: Ver candidatos da demanda ID', id);
            });
        });
    }

    function showError(msg) {
        loadingEl.classList.add('d-none');
        errorMsg.textContent = msg;
        errorEl.classList.remove('d-none');
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('pt-BR');
    }

    // TODO: Substituir pela chamada real ao backend
    // fetch('/api/demandas?id_empresa=' + empresaId + '&status=ABERTA', {
    //   headers: { 'Authorization': 'Bearer ' + token }
    // })
    // .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
    // .then(data => { renderDemandas(data); })
    // .catch(err => { showError(err.message); });

    // Simulação temporária (remover na integração)
    setTimeout(function () {
        renderDemandas([
            { id: 1, titulo: 'Engenheiro Civil Sênior — Obra Residencial', data_publicacao: '2026-09-08', total_candidatos: 12 },
            { id: 2, titulo: 'Mestre de Obras — Edifício Comercial', data_publicacao: '2026-09-01', total_candidatos: 5 },
            { id: 3, titulo: 'Arquiteto de Interiores — Reforma Hotel', data_publicacao: '2026-08-25', total_candidatos: 23 }
        ]);
    }, 600);
})();