(function () {
    const loadingEl = document.getElementById('demandaEncerrar-loading');
    const emptyEl = document.getElementById('demandaEncerrar-empty');
    const listEl = document.getElementById('demandaEncerrar-list');

    const empresaId = localStorage.getItem('empresaId') || '1'; 

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
            btn.addEventListener('click', async function () {
                const demandaId = this.getAttribute('data-demanda-id');
                const card = document.getElementById('encerrar-item-' + demandaId);

                if (!confirm('Tem certeza que deseja encerrar esta demanda? O status será alterado para FECHADA.')) return;

                const originalHtml = this.innerHTML;
                this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                this.disabled = true;

                try {
                    await apiRequest('/demandas/' + demandaId + '/editar', {
                        method: 'POST',
                        body: JSON.stringify({ status: 'FECHADA' })
                    });

                    // Sucesso
                    card.style.opacity = '0.4';
                    card.style.pointerEvents = 'none';
                    const info = card.querySelector('.pl-estudio-item-info p');
                    if (info) {
                        info.innerHTML = '<span style="color: #ff4d4d;"><i class="bi bi-x-circle-fill"></i> Encerrada (FECHADA)</span>';
                    }
                    this.innerHTML = '<i class="bi bi-check2"></i>';

                } catch (error) {
                    console.error("Falha ao encerrar demanda:", error);
                    alert("Erro ao encerrar demanda. Tente novamente mais tarde.");
                    this.innerHTML = originalHtml;
                    this.disabled = false;
                }
            });
        });
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('pt-BR');
    }

    async function loadDemandasAtivas() {
        try {
            const data = await apiRequest(`/demandas?id_empresa=${empresaId}&status=ABERTA`, {
                method: 'GET'
            });
            renderDemandas(data);

        } catch (error) {
            console.error("Falha ao carregar demandas", error);
            loadingEl.classList.add('d-none');
        }
    }

    loadDemandasAtivas();
})();