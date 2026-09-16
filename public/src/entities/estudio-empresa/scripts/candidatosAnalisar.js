(function () {
  const filtroEl = document.getElementById('filtro-vaga');
  const loadingEl = document.getElementById('candidatos-loading');
  const emptyEl = document.getElementById('candidatos-empty');
  const listEl = document.getElementById('candidatos-list');

  const empresaId = localStorage.getItem('empresaId') || '1';

  function renderCandidatos(candidatos) {
    loadingEl.classList.add('d-none');

    if (!candidatos || candidatos.length === 0) {
      emptyEl.classList.remove('d-none');
      listEl.classList.add('d-none');
      return;
    }

    emptyEl.classList.add('d-none');
    listEl.innerHTML = '';

    candidatos.forEach(function (c) {
      const card = document.createElement('div');
      card.className = 'pl-estudio-item-card';
      card.id = 'candidato-' + c.id;
      card.setAttribute('data-interesse-id', c.id);
      card.setAttribute('data-usuario-id', c.id_usuario);
      card.setAttribute('data-demanda-id', c.id_demanda);
      
      let statusHtml = '';
      if (c.status === 'ACEITA') {
          statusHtml = '<span style="color: #00d278;"><i class="bi bi-check-circle-fill"></i> Aceito</span>';
      } else if (c.status === 'RECUSADA') {
          statusHtml = '<span style="color: #ff4d4d;"><i class="bi bi-x-circle-fill"></i> Recusado</span>';
      }

      const disabledClass = (c.status === 'ACEITA' || c.status === 'RECUSADA') ? 'opacity: 0.5; pointer-events: none;' : '';

      card.innerHTML =
        '<div class="pl-estudio-item-info">' +
        '<h5><i class="bi bi-person-circle" style="color: var(--prolink-blue); margin-right: 6px;"></i> ' + c.nome_usuario + '</h5>' +
        '<p>Candidatou-se a: <strong>' + c.titulo_demanda + '</strong> • ' + formatDate(c.data_interesse) + '</p>' +
        (statusHtml ? '<p>' + statusHtml + '</p>' : '') +
        '</div>' +
        '<div class="pl-estudio-item-actions" style="' + disabledClass + '">' +
        '<button class="pl-estudio-item-btn btn-ver-portfolio" data-usuario-id="' + c.id_usuario + '" title="Ver Portfólio">' +
        '<i class="bi bi-folder2-open"></i>' +
        '</button>' +
        '<button class="pl-estudio-item-btn btn-aceitar" data-interesse-id="' + c.id + '" style="border-color: #00d278; color: #00d278;" title="Aceitar">' +
        '<i class="bi bi-check-lg"></i>' +
        '</button>' +
        '<button class="pl-estudio-item-btn pl-estudio-item-btn--danger btn-recusar" data-interesse-id="' + c.id + '" title="Recusar">' +
        '<i class="bi bi-x-lg"></i>' +
        '</button>' +
        '</div>';
      listEl.appendChild(card);
    });

    listEl.classList.remove('d-none');
    bindActions();
  }

  function bindActions() {
    document.querySelectorAll('.btn-ver-portfolio').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const userId = this.getAttribute('data-usuario-id');
        window.location.hash = '#perfil?id=' + userId;
      });
    });

    document.querySelectorAll('.btn-aceitar').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const interesseId = this.getAttribute('data-interesse-id');
        updateInteresseStatus(interesseId, 'ACEITA', this);
      });
    });

    document.querySelectorAll('.btn-recusar').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const interesseId = this.getAttribute('data-interesse-id');
        if (confirm('Tem certeza que deseja recusar este candidato?')) {
          updateInteresseStatus(interesseId, 'RECUSADA', this);
        }
      });
    });
  }

  async function updateInteresseStatus(interesseId, novoStatus, btnElement) {
    const card = document.getElementById('candidato-' + interesseId);
    
    const originalHtml = btnElement.innerHTML;
    btnElement.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
    const allBtns = card.querySelectorAll('.pl-estudio-item-btn');
    allBtns.forEach(b => b.disabled = true);

    try {
        await apiRequest('/interesses/' + interesseId + '/status', {
            method: 'POST',
            body: JSON.stringify({ status: novoStatus })
        });

        // Sucesso visual
        card.querySelector('.pl-estudio-item-actions').style.opacity = '0.4';
        card.querySelector('.pl-estudio-item-actions').style.pointerEvents = 'none';
        
        let infoContainer = card.querySelector('.pl-estudio-item-info');
        let statusP = document.createElement('p');
        if (novoStatus === 'ACEITA') {
            statusP.innerHTML = '<span style="color: #00d278;"><i class="bi bi-check-circle-fill"></i> Aceito</span>';
        } else {
            statusP.innerHTML = '<span style="color: #ff4d4d;"><i class="bi bi-x-circle-fill"></i> Recusado</span>';
        }
        infoContainer.appendChild(statusP);

    } catch (error) {
        console.error("Falha ao atualizar status do candidato:", error);
        alert(`Erro ao processar a ação: ${error.message}`);
        btnElement.innerHTML = originalHtml;
        allBtns.forEach(b => b.disabled = false);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }

  async function loadCandidatos(demandaIdFilter = null) {
      loadingEl.classList.remove('d-none');
      listEl.classList.add('d-none');
      emptyEl.classList.add('d-none');

      // Obs: a rota do backend exige o ID da demanda na URL: /demandas/{id}/interesses
      // Se não houver filtro, passamos 'todas' ou deixamos a responsabilidade para o backend
      let url = demandaIdFilter ? `/demandas/${demandaIdFilter}/interesses` : `/meus-interesses`;

      try {
          const data = await apiRequest(url, {
              method: 'GET'
          });
          renderCandidatos(data);
      } catch (error) {
          console.error(error);
          loadingEl.classList.add('d-none');
          emptyEl.classList.remove('d-none');
      }
  }

  if (filtroEl) {
    filtroEl.addEventListener('change', function () {
      loadCandidatos(this.value || null);
    });
  }

  const hashObj = new URLSearchParams(window.location.hash.split('?')[1]);
  const demandaParam = hashObj.get('demanda');
  
  if (demandaParam && filtroEl) {
      filtroEl.value = demandaParam;
  }

  loadCandidatos(demandaParam);

})();