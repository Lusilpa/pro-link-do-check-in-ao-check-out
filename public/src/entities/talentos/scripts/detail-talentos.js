function initTalentDetail(talentData = null) {
  if (talentData) {
    populateTalentPanel(talentData);
  }
  bindTalentDetailClose();
}

function populateTalentPanel(d) {
  // 1. Header (Info Básica)
  document.getElementById('tdName').textContent = d.nome || 'Profissional';
  document.getElementById('tdTitle').textContent = d.titulo || 'Sem título definido';
  
  // Selo CREA ou Estudante
  const badgesContainer = document.getElementById('tdBadges');
  if (d.is_student) {
    badgesContainer.innerHTML = `<span class="pl-badge pl-badge-student"><i class="bi bi-mortarboard-fill"></i> UNIVERSITÁRIO</span>`;
  } else if (d.registro_crea) {
    badgesContainer.innerHTML = `<span class="pl-badge pl-badge-crea"><i class="bi bi-patch-check-fill"></i> CREA ${d.registro_crea}</span>`;
  }

  // 2. Resumo e Competências
  document.getElementById('tdSummary').textContent = d.resumo || 'Resumo profissional não disponibilizado.';
  
  const skillsContainer = document.getElementById('tdSkills');
  if (d.habilidades && d.habilidades.length > 0) {
    skillsContainer.innerHTML = d.habilidades.map(skill => `<span class="pl-skill-badge">${skill}</span>`).join('');
  } else {
    skillsContainer.innerHTML = '<span class="pl-td-section-text">Nenhuma competência registrada.</span>';
  }

  // 3. Acervo Técnico (Ocultar seção inteira se for estudante sem acervo)
  const acervoSection = document.getElementById('tdAcervoSection');
  if (d.acervo_tecnico) {
    acervoSection.style.display = 'block';
    document.getElementById('tdAcervo').innerHTML = `
      <div class="pl-td-acervo-card">
          <h4>${d.acervo_tecnico.arts_aprovadas || 0}</h4>
          <span>ARTs Aprovadas</span>
      </div>
      <div class="pl-td-acervo-card">
          <h4>${d.acervo_tecnico.cats_validas || 0}</h4>
          <span>CATs Válidas</span>
      </div>
    `;
  } else {
    acervoSection.style.display = 'none';
  }

  // 4. Experiências e Projetos
  const expContainer = document.getElementById('tdExperience');
  if (d.experiencias && d.experiencias.length > 0) {
    let expHtml = '';
    d.experiencias.forEach(exp => {
      let projHtml = '';
      if (exp.projetos && exp.projetos.length > 0) {
        projHtml += `<div class="pl-td-project-list">`;
        exp.projetos.forEach(proj => {
          projHtml += `
            <div class="pl-td-project-item">
                <h5 class="pl-td-project-title"><i class="bi bi-rocket-takeoff"></i> ${proj.titulo}</h5>
                <p class="pl-td-project-desc">${proj.descricao}</p>
            </div>
          `;
        });
        projHtml += `</div>`;
      }

      expHtml += `
        <div class="pl-td-experience-card">
            <div class="pl-td-exp-header">
                <h4 class="pl-td-exp-title">${exp.cargo}</h4>
                <span class="pl-td-exp-company">${exp.empresa}</span>
                <div class="pl-td-exp-date">${exp.data_inicio} — ${exp.data_fim}</div>
            </div>
            <p class="pl-td-section-text">${exp.descricao}</p>
            ${projHtml}
        </div>
      `;
    });
    expContainer.innerHTML = expHtml;
  } else {
    expContainer.innerHTML = '<p class="pl-td-section-text">Nenhuma experiência profissional cadastrada no portfólio.</p>';
  }
}

function bindTalentDetailClose() {
  const closeBtn = document.getElementById('closeTalentDetailPanel');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('prolink:talent-detail-close'));
    });
  }
}

// Inicializa caso o script seja carregado isoladamente
initTalentDetail();