function initProLinkFilter() {
  const AREAS_CREA = [
    'Engenharia Civil',      'Engenharia Elétrica',   'Engenharia Mecânica',
    'Agronomia',             'Engenharia Florestal',  'Geologia e Minas',
    'Engenharia Química',    'Segurança do Trabalho', 'Arquitetura',
    'Engenharia de Produção'
  ];

  populateAreaOptions(AREAS_CREA);
  bindApplyButtons();
  bindClearButtons();
}

function populateAreaOptions(areas) {
  document.querySelectorAll('.filterArea').forEach(select => {
    if (select.children.length > 1) return;
    areas.forEach(area => {
      const opt = document.createElement('option');
      opt.value = area;
      opt.textContent = area;
      select.appendChild(opt);
    });
  });
}

function bindApplyButtons() {
  document.querySelectorAll('.btnApplyFilter').forEach(btn => {
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', function (e) {
      const filters = collectFilters(e.target.closest('.pl-filter-widget'));
      document.dispatchEvent(new CustomEvent('prolink:filter', { detail: filters }));
    });
  });
}

function bindClearButtons() {
  document.querySelectorAll('.btnClearFilter').forEach(btn => {
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', function (e) {
      e.target.closest('.pl-filter-widget')
        .querySelectorAll('.pl-filter-select')
        .forEach(s => (s.value = ''));
      document.dispatchEvent(new CustomEvent('prolink:filter', { detail: emptyFilters() }));
    });
  });
}

function collectFilters(widget) {
  return {
    area:       widget.querySelector('.filterArea')?.value       || '',
    tipo:       widget.querySelector('.filterTipo')?.value       || '',
    modalidade: widget.querySelector('.filterModalidade')?.value || '',
    prazo:      widget.querySelector('.filterPrazo')?.value      || '',
    status:     widget.querySelector('.filterStatus')?.value     || '',
  };
}

function emptyFilters() {
  return { area: '', tipo: '', modalidade: '', prazo: '', status: '' };
}

initProLinkFilter();