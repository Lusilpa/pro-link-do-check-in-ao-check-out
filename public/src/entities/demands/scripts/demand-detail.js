function initDemandDetail(demand = null) {
  if (demand) populatePanel(demand);
  bindCloseButton();
  bindProposalButton();
}

function populatePanel(d) {
  const tipo      = TIPO_MAP[d.tipo]        || { icon: 'bi-briefcase-fill', label: d.tipo || 'Demanda' };
  const status    = STATUS_MAP[d.status]    || { icon: 'bi-circle',          label: 'Aberta' };
  const modalidade = MODALIDADE_MAP[d.modalidade] || { icon: 'bi-geo-alt', label: d.modalidade || 'Presencial' };

  setText('detailCompanyName', d.company);
  setText('detailTime',        `Publicado há ${d.time}`);
  setText('detailTitle',       d.title);
  setText('detailSubtitle',    d.subtitle || `${d.area || ''} • CREA-AM`);
  setText('detailDescription', d.description || 'Descrição completa não disponível.');

  setHTML('detailBadges', buildBadges(d, status, tipo));
  setHTML('detailMeta',   buildMeta(d, modalidade));
}

function buildBadges(d, status, tipo) {
  return `
    <span class="pl-badge pl-badge-status-${d.status || 'aberta'}">
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
  const prazoLabel = PRAZO_MAP[d.prazo] || d.prazo || 'Prazo flexível';
  return `
    <span class="pl-detail-meta-item"><i class="bi bi-geo-alt-fill"></i> ${d.cidade || 'Manaus, AM'}</span>
    <span class="pl-detail-meta-item"><i class="bi ${modalidade.icon}"></i> ${modalidade.label}</span>
    <span class="pl-detail-meta-item"><i class="bi bi-calendar-event"></i> ${prazoLabel}</span>
  `;
}

function bindCloseButton() {
  const btn = document.getElementById('closeDetailPanel');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('prolink:detail-close'));
  });
}

function bindProposalButton() {
  const btn = document.getElementById('btnSendProposal');
  if (!btn) return;
  btn.addEventListener('click', () => {
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

const TIPO_MAP = {
  projeto:      { icon: 'bi-diagram-3-fill',         label: 'Projeto' },
  consultoria:  { icon: 'bi-chat-square-text-fill',   label: 'Consultoria' },
  art:          { icon: 'bi-file-earmark-check-fill', label: 'ART / CAT' },
  pericia:      { icon: 'bi-search',                  label: 'Perícia' },
  estagio:      { icon: 'bi-mortarboard-fill',        label: 'Estágio' },
  mentoria:     { icon: 'bi-person-check-fill',       label: 'Mentoria' },
  pesquisa:     { icon: 'bi-book-fill',               label: 'Pesquisa' },
  voluntariado: { icon: 'bi-heart-fill',              label: 'Voluntariado' },
};

// STATUS_MAP — ENUMs alinhados com a coluna `status` da tabela `demandas` no banco (MariaDB)
const STATUS_MAP = {
  ABERTA:             { icon: 'bi-circle-fill',       label: 'Aberta' },
  FECHADA:            { icon: 'bi-check-circle-fill', label: 'Concluída' },
  CANCELADA:          { icon: 'bi-x-circle-fill',     label: 'Cancelada' },
  SUSPENSA_PELO_CREA: { icon: 'bi-slash-circle-fill', label: 'Suspensa (CREA)' },
};

const MODALIDADE_MAP = {
  presencial: { icon: 'bi-building', label: 'Presencial' },
  remoto:     { icon: 'bi-laptop',   label: 'Remoto' },
  hibrido:    { icon: 'bi-shuffle',  label: 'Híbrido' },
};

const PRAZO_MAP = {
  curto: 'Até 7 dias',
  medio: 'Até 30 dias',
  longo: 'Acima de 30 dias',
};

initDemandDetail();