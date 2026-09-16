(function () {
    const loadingEl = document.getElementById('demandaEncerrar-loading');
    const emptyEl = document.getElementById('demandaEncerrar-empty');
    const listEl = document.getElementById('demandaEncerrar-list');

    /**
     * Renderiza a lista de demandas para encerramento.
     * @param {Array} demandas — [{ id, titulo, data_publicacao, total_candidatos }]
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
            card.id = 'encerrar-item-' + d.id;
            card.setAttribute('data-demanda-id', d.id);
            card.innerHTML =
                '<div class="pl-estudio-item-info">' +
                '<h5>' + d.titulo + '</h5>' +
                '<p>' + (d.total_candidatos || 0) + ' candidatos • Publicada em: ' + formatDate(d.data_publicacao) + '</p>' +
                '</div>' +
                '<div class="pl-estudio-item-actions">' +
                '<button class="pl-estudio-item-btn pl-estudio-item-btn--danger btn-encerrar-vaga" data-demanda-id="' + d.id + '" title="Encerrar">' +
                '<i class="bi bi-x-lg"></i>' +
                '</button>' +
                '</div>';
            listEl.appendChild(card);
        });

        listEl.classList.remove('d-none');
        bindActions();
    }

    function bindActions() {
        document.querySelectorAll('.btn-encerrar-vaga').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const demandaId = this.getAttribute('data-demanda-id');
                const card = document.getElementById('encerrar-item-' + demandaId);

                if (!confirm('Tem certeza que deseja encerrar esta demanda? O status será alterado para FECHADA.')) return;

                // TODO: Substituir pelo PATCH/PUT real
                // fetch('/api/demandas/' + demandaId, {
                //   method: 'PATCH',
                //   headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                //   body: JSON.stringify({ status: 'FECHADA' })
                // })
                // .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
                // .then(() => { onSuccess(card); })
                // .catch(err => { alert('Erro: ' + err.message); });

                // Simulação temporária (remover na integração)
                onSuccess(card);

                function onSuccess(cardEl) {
                    cardEl.style.opacity = '0.4';
                    cardEl.style.pointerEvents = 'none';
                    var info = cardEl.querySelector('.pl-estudio-item-info p');
                    if (info) info.innerHTML = '<span style="color: #ff4d4d;"><i class="bi bi-x-circle-fill"></i> Encerrada (FECHADA)</span>';
                }
            });
        });
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('pt-BR');
    }

    // Simulação temporária (remover na integração)
    setTimeout(function () {
        renderDemandas([
            { id: 1, titulo: 'Engenheiro Civil Sênior — Obra Residencial', data_publicacao: '2026-09-08', total_candidatos: 12 },
            { id: 2, titulo: 'Mestre de Obras — Edifício Comercial', data_publicacao: '2026-09-01', total_candidatos: 5 }
        ]);
    }, 600);
})();