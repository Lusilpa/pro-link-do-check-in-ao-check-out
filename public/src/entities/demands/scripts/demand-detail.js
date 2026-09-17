function initDemandDetail(demand = null) {
  if (demand) populatePanel(demand);
  bindCloseButton();
  bindProposalButton();
}

function populatePanel(d) {
  // Campos conforme retornados por GET /demandas (DemandaRepository::buscarComFiltros):
  // titulo, descricao, area, tipo, cidade, uf, modalidade, status, dataPublicacao,
  // dataFechamento, company (join com pessoa_juridica), interessados.
  const tipo       = TIPO_MAP[d.tipo]             || { icon: 'bi-briefcase-fill', label: d.tipo || 'Demanda' };
  const status     = STATUS_MAP[d.status]         || { icon: 'bi-circle',          label: 'Aberta' };
  const modalidade = MODALIDADE_MAP[d.modalidade] || { icon: 'bi-geo-alt', label: d.modalidade || 'Presencial' };

  setText('detailCompanyName', d.company || 'Empresa');
  setText('detailTime',        `Publicado há ${formatTempoAbreviado(d.dataPublicacao)}`);
  setText('detailTitle',       d.titulo);
  setText('detailSubtitle',    `${d.area || 'Engenharia'} • CREA-AM`);
  setText('detailDescription', d.descricao || 'Descrição completa não disponível.');

  setHTML('detailBadges', buildBadges(d, status, tipo));
  setHTML('detailMeta',   buildMeta(d, modalidade));
}

// "Publicado há X" no mesmo estilo abreviado usado na lista (searchDemandas.js).
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

// Prazo calculado a partir de dataFechamento (não existe coluna "prazo" própria).
function formatPrazo(dataFechamentoIso) {
  if (!dataFechamentoIso) return 'Prazo flexível';
  const diffDias = Math.ceil((new Date(dataFechamentoIso.replace(' ', 'T')).getTime() - Date.now()) / 86400000);
  if (diffDias < 0) return 'Prazo encerrado';
  if (diffDias === 0) return 'Encerra hoje';
  return `Encerra em ${diffDias} dia${diffDias !== 1 ? 's' : ''}`;
}

function buildBadges(d, status, tipo) {
  return `
    <span class="pl-badge pl-badge-status-${d.status || 'ABERTA'}">
      <i class="bi ${status.icon}"></i> ${status.label}
    </span>
    <span class="pl-badge pl-badge-tipo">
      <i class="bi ${tipo.icon}"></i> ${tipo.label}
    </span>
    <span class="pl-badge pl-badge-area">
      <i class="bi bi-compass"></i> ${d.area || 'Engenharia'}
    </span>
  `;
}

function buildMeta(d, modalidade) {
  return `
    <span class="pl-detail-meta-item"><i class="bi bi-geo-alt-fill"></i> ${d.cidade ? `${d.cidade}, ${d.uf}` : 'Manaus, AM'}</span>
    <span class="pl-detail-meta-item"><i class="bi ${modalidade.icon}"></i> ${modalidade.label}</span>
    <span class="pl-detail-meta-item"><i class="bi bi-calendar-event"></i> ${formatPrazo(d.dataFechamento)}</span>
  `;
}

function bindCloseButton() {
  const btn = document.getElementById('closeDetailPanel');
  if (!btn) return;
  const fresh = btn.cloneNode(true);
  btn.parentNode.replaceChild(fresh, btn);
  fresh.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('prolink:detail-close'));
  });
}

function bindProposalButton() {
  const btn = document.getElementById('btnSendProposal');
  if (!btn) return;
  const fresh = btn.cloneNode(true);
  btn.parentNode.replaceChild(fresh, btn);
  fresh.addEventListener('click', () => {
    window.location.hash = '#cartas';
  });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// "var": este script pode ser reinjetado (fechar e abrir outro card de demanda reexecuta
// o <script src> do fragmento) - um "const" no topo do arquivo lançaria "Identifier
// already declared" na segunda vez (mesmo bug ja visto em outros widgets do projeto).
var TIPO_MAP = {
  PROJETO:      { icon: 'bi-diagram-3-fill',         label: 'Projeto' },
  CONSULTORIA:  { icon: 'bi-chat-square-text-fill',   label: 'Consultoria' },
  ART:          { icon: 'bi-file-earmark-check-fill', label: 'ART / CAT' },
  PERICIA:      { icon: 'bi-search',                  label: 'Perícia' },
  ESTAGIO:      { icon: 'bi-mortarboard-fill',        label: 'Estágio' },
  MENTORIA:     { icon: 'bi-person-check-fill',       label: 'Mentoria' },
  PESQUISA:     { icon: 'bi-book-fill',               label: 'Pesquisa' },
  VOLUNTARIADO: { icon: 'bi-heart-fill',              label: 'Voluntariado' },
};

// STATUS_MAP — ENUMs alinhados com a coluna `status` da tabela `demandas` no banco (MariaDB)
var STATUS_MAP = {
  ABERTA:             { icon: 'bi-circle-fill',       label: 'Aberta' },
  FECHADA:            { icon: 'bi-check-circle-fill', label: 'Concluída' },
  CANCELADA:          { icon: 'bi-x-circle-fill',     label: 'Cancelada' },
  SUSPENSA_PELO_CREA: { icon: 'bi-slash-circle-fill', label: 'Suspensa (CREA)' },
};

var MODALIDADE_MAP = {
  PRESENCIAL: { icon: 'bi-building', label: 'Presencial' },
  REMOTO:     { icon: 'bi-laptop',   label: 'Remoto' },
  HIBRIDO:    { icon: 'bi-shuffle',  label: 'Híbrido' },
};
