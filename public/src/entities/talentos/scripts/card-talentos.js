(function initTalentsList() {

    // Mock simulando um JOIN entre usuarios, pessoa_fisica, profissionais e universitarios
    const talentsMock = [
        {
            id: 1,
            nome: "Luan da Silva Palma",
            titulo: "Estudante de Engenharia de Software",
            resumo: "Focado no desenvolvimento de sistemas web (React, TypeScript) e back-end (Java/Spring, Python/FastAPI), com interesse em Inteligência Artificial.",
            is_student: true,
            area: "Engenharia de Software",
            instituicao: "IFAM - CMZL",
            nivel_semestre: "4º Período",
            localizacao: "Manaus, AM",
            habilidades: ["Python", "React", "Java", "NLP"]
        },
        {
            id: 2,
            nome: "Hanna Reis",
            titulo: "Engenheira Civil Sênior",
            resumo: "Especialista em cálculo estrutural e laudos técnicos de grandes obras de infraestrutura no Polo Industrial de Manaus.",
            is_student: false,
            registro_crea: "Ativo",
            area: "Engenharia Civil",
            instituicao: "Tapajós Engenharia",
            nivel_semestre: "Sênior",
            localizacao: "Manaus, AM",
            habilidades: ["AutoCAD", "Eberick", "Fundações"]
        }
    ];

    function renderTalents(list) {
        const container = document.getElementById('talents-cards-container');
        if (!container) return;
        
        let html = '';

        list.forEach(t => {
            // Lógica de Selo Condicional (Estudante vs CREA)
            const identityBadge = t.is_student 
                ? `<span class="pl-badge pl-badge-student"><i class="bi bi-mortarboard-fill"></i> UNIVERSITÁRIO</span>`
                : `<span class="pl-badge pl-badge-crea"><i class="bi bi-patch-check-fill"></i> CREA ${t.registro_crea}</span>`;

            // Lógica de Instituição vs Empresa
            const institutionIcon = t.is_student ? 'bi-building' : 'bi-briefcase-fill';

            // Habilidades
            const skillsHtml = t.habilidades.map(skill => `<span class="pl-skill-tag">${skill}</span>`).join('');

            html += `
            <div class="pl-talent-card" data-id="${t.id}">
                <div class="pl-talent-header">
                    <div class="pl-talent-user-info">
                        <div class="pl-talent-avatar">
                            <i class="bi bi-person-bounding-box"></i>
                        </div>
                        <div class="pl-talent-meta">
                            <h6 class="pl-talent-name">${t.nome}</h6>
                            <span class="pl-talent-title">${t.titulo}</span>
                        </div>
                    </div>
                    <button class="pl-talent-menu-btn" onclick="event.stopPropagation()"><i class="bi bi-three-dots-vertical"></i></button>
                </div>

                <div class="pl-talent-badges">
                    ${identityBadge}
                    <span class="pl-badge pl-badge-area"><i class="bi bi-compass"></i> ${t.area}</span>
                </div>

                <div class="pl-talent-body">
                    <p class="pl-talent-summary">${t.resumo}</p>
                    <div class="pl-talent-skills">
                        ${skillsHtml}
                    </div>
                </div>

                <div class="pl-talent-info-row">
                    <span class="pl-talent-info-item"><i class="bi bi-geo-alt-fill"></i> ${t.localizacao}</span>
                    <span class="pl-talent-info-item"><i class="bi ${institutionIcon}"></i> ${t.instituicao}</span>
                    <span class="pl-talent-info-item"><i class="bi bi-bar-chart-fill"></i> ${t.nivel_semestre}</span>
                </div>

                <div class="pl-talent-footer">
                    <button class="pl-btn-save-talent" onclick="event.stopPropagation()"><i class="bi bi-bookmark"></i></button>
                    <button class="pl-btn-view-profile" onclick="event.stopPropagation()">
                        <i class="bi bi-person-lines-fill"></i> Ver Perfil Completo
                    </button>
                </div>
            </div>`;
        });

        container.innerHTML = html;
        bindTalentClicks();
    }

    function bindTalentClicks() {
        document.querySelectorAll('.pl-btn-view-profile').forEach(btn => {
            btn.addEventListener('click', function() {
                // Navega para a página de perfil (ex: /#perfil)
                window.location.hash = '#perfil';
            });
        });
    }

    // Aguarda o DOM estar pronto se chamado diretamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => renderTalents(talentsMock));
    } else {
        renderTalents(talentsMock);
    }

})();