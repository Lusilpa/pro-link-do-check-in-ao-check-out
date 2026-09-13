(function initTalentsFilter() {
  const AREAS_CREA = [
    'Engenharia de Software', 'Engenharia Civil',      'Engenharia Elétrica',   
    'Engenharia Mecânica',    'Agronomia',             'Engenharia Florestal',  
    'Geologia e Minas',       'Engenharia Química',    'Segurança do Trabalho', 
    'Arquitetura',            'Engenharia de Produção'
  ];

  populateAreaOptions(AREAS_CREA);
  bindApplyButtons();
  bindClearButtons();

  function populateAreaOptions(areas) {
    document.querySelectorAll('.filterArea').forEach(select => {
      // Evita duplicação se o script rodar duas vezes (desktop e mobile offcanvas)
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
      // Clone e replace para evitar múltiplos event listeners atrelados
      const fresh = btn.cloneNode(true);
      btn.parentNode.replaceChild(fresh, btn);
      
      fresh.addEventListener('click', function (e) {
        const filters = collectFilters(e.target.closest('.pl-filter-widget'));
        document.dispatchEvent(new CustomEvent('prolink:filter-talents', { detail: filters }));
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
          
        document.dispatchEvent(new CustomEvent('prolink:filter-talents', { detail: emptyFilters() }));
      });
    });
  }

  function collectFilters(widget) {
    return {
      area:       widget.querySelector('.filterArea')?.value       || '',
      nivel:      widget.querySelector('.filterNivel')?.value      || '',
      grau:       widget.querySelector('.filterGrau')?.value       || '',
      crea:       widget.querySelector('.filterCrea')?.value       || '',
      modalidade: widget.querySelector('.filterModalidade')?.value || '',
    };
  }

  function emptyFilters() {
    return { area: '', nivel: '', grau: '', crea: '', modalidade: '' };
  }
})();