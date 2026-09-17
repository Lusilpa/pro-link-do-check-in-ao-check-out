(function () {
    const loadingEl = document.getElementById('demandaGerenciar-loading');
    const emptyEl = document.getElementById('demandaGerenciar-empty');
    const errorEl = document.getElementById('demandaGerenciar-error');
    const errorMsg = document.getElementById('demandaGerenciar-error-msg');
    const listEl = document.getElementById('demandaGerenciar-list');

    // ID da empresa logada vindo do Auth Context
    const user = typeof getAuthUser === 'function' ? getAuthUser() : null;
    const empresaId = user ? user.id : '1';

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
        document.querySelectorAll('.btn-editar-demanda').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-demanda-id');
                window.location.hash = '#demanda-editar?id=' + id;
            });
        });

        document.querySelectorAll('.btn-ver-candidatos').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-demanda-id');
                window.location.hash = '#candidatos-analisar?demanda=' + id;
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

    async function loadDemandas() {
        try {
            const data = await apiRequest(`/demandas?id_empresa=${empresaId}&status=ABERTA`, {
                method: 'GET'
            });

            renderDemandas(data);

        } catch (error) {
            console.error("Erro ao buscar demandas:", error);
            showError("Não foi possível carregar as vagas ativas no momento.");
        }
    }

    loadDemandas();
})();