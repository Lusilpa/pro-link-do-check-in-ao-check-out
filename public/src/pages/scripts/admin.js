window.initAdmin = async function () {
    if (window._adminInitialized) return;
    window._adminInitialized = true;

    if (typeof Chart === 'undefined') {
        console.error('[Admin] Chart.js não está carregado.');
    }

    try {
        await loadAdminData();
        setupAdminFormListener();
<<<<<<< Updated upstream

        // Chamadas Mocks do Demo Day
        if (typeof loadUniversitarios === 'function') loadUniversitarios();
        if (typeof loadDenuncias === 'function') loadDenuncias();
        if (typeof loadAuditoria === 'function') loadAuditoria();
=======
>>>>>>> Stashed changes
    } catch (error) {
        console.error('[Admin] Erro ao inicializar:', error);
    }
};

async function loadAdminData() {
<<<<<<< Updated upstream
    // MOCK fallback para o Demo Day caso o backend falhe/demore
    const MOCK_DASHBOARD = {
        kpis: { totalUsers: 142, activeDemands: 18, checkins: 305, virtualLetters: 305, pendingMod: 3 },
        charts: { userStatus: [80, 50, 12], demandsGrowth: [5, 12, 14, 18] },
        recentRegistrations: [
            { id: 1042, name: 'Luan Palma', sub: 'Engenheiro Civil', status: 'ATIVO', color: 'success', date: 'Hoje' },
            { id: 1043, name: 'Arielle Tavares', sub: 'Universitária', status: 'PENDENTE', color: 'warning', date: 'Hoje' }
        ],
        topCategories: [
            { name: 'Engenharia Civil', count: 42 },
            { name: 'Engenharia de Software', count: 35 }
        ],
        topCompanies: [
            { name: 'Construtora Alpha', count: 12 },
            { name: 'Tech Solutions LTDA', count: 8 }
        ],
        moderation: { approved: 412, pending: 3, banned: 1 },
        stats: { connections: 520, dailyAvg: '15,2' }
    };

    try {
        let data = await apiRequest('/admin/dashboard');

        if (!data) {
            console.warn("[Admin] Nenhum dado retornado. Carregando MOCK para demonstração.");
            data = MOCK_DASHBOARD;
        }

        renderAdminDashboard(data);
    } catch (e) {
        console.warn('[Admin] Erro na API do dashboard. Carregando MOCK para demonstração.', e);
        renderAdminDashboard(MOCK_DASHBOARD);
    }
=======
    // TODO: Integração real com o backend
    // try {
    //     const res = await fetch('/api/admin/dashboard', {
    //         headers: { 'Authorization': `Bearer ${localStorage.getItem('pl_token')}` }
    //     });
    //     if (res.ok) {
    //         const data = await res.json();
    //         renderAdminDashboard(data);
    //         return;
    //     }
    // } catch (e) {
    //     console.warn('Backend indisponível, usando mock.');
    // }

    // FAKE DATA adaptado para o escopo real do Pro-Link
    const mockData = {
        kpis: {
            totalUsers: 1450,
            activeDemands: 342,
            checkins: 890,
            virtualLetters: 512,
            pendingMod: 45
        },
        charts: {
            userStatus: [65, 30, 5], // Profissionais (Crea), Empresas, Admins
            demandsGrowth: [10, 25, 45, 80, 150, 210, 342] // Curva de crescimento
        },
        recentRegistrations: [
            { id: 'DM-001', name: 'Engenheiro Civil Pleno', sub: 'Construtora Alpha', status: 'MATCH ENCONTRADO', date: 'Hoje, 11:10', color: 'cyan' },
            { id: 'CHK-104', name: 'Check-in Realizado', sub: 'Luan Palma', status: 'VERIFICADO', date: 'Hoje, 09:45', color: 'green' },
            { id: 'CAT-099', name: 'Validação de Acervo Técnico', sub: 'Engª. Amanda Costa', status: 'EM AUDITORIA', date: 'Ontem, 17:30', color: 'yellow' }
        ],
        topCategories: [
            { name: 'Engenharia Civil (Estrutural)', count: 120 },
            { name: 'Engenharia Elétrica (Projetos)', count: 85 },
            { name: 'Agronomia (Gestão de Safra)', count: 64 },
            { name: 'Engenharia de Segurança', count: 40 }
        ],
        topCompanies: [
            { name: 'Construtora Alpha S.A', count: 48 },
            { name: 'EcoEnergia Solutions', count: 32 },
            { name: 'AgroTech Brasil', count: 25 },
            { name: 'InfraObras Ltda.', count: 18 }
        ],
        moderation: {
            approved: 420,
            pending: 45,
            banned: 12
        },
        stats: {
            connections: 312,
            dailyAvg: '10,4'
        }
    };

    renderAdminDashboard(mockData);
>>>>>>> Stashed changes
}

function setupAdminFormListener() {
    const form = document.getElementById('formAdminRegister');
    if (!form) return;

<<<<<<< Updated upstream
    form.addEventListener('submit', async function (e) {
=======
    form.addEventListener('submit', async function(e) {
>>>>>>> Stashed changes
        e.preventDefault();

        const nome = document.getElementById('admin-nome').value;
        const email = document.getElementById('admin-email').value;
        const senha = document.getElementById('admin-senha').value;
        const nivel = document.getElementById('admin-nivel').value;
<<<<<<< Updated upstream

        const payload = { nome, email, senha, nivel };
        console.log('[Admin] Payload Cadastro Admin:', payload);

=======
        
        const payload = { nome, email, senha, nivel };
        console.log('[Admin] Payload Cadastro Admin:', payload);

        // TODO: Integração real
        /*
>>>>>>> Stashed changes
        try {
            const btn = form.querySelector('.pl-admin-btn-save');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Salvando...';
            btn.disabled = true;

<<<<<<< Updated upstream
            const data = await apiRequest('/admin/register', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            alert('Administrador cadastrado com sucesso! ID: ' + data.id);
            document.getElementById('adminRegisterModal').style.display = 'none';
            form.reset();

            btn.innerHTML = originalText;
            btn.disabled = false;
        } catch (error) {
            console.error('Erro na integração', error);
            alert('Erro de conexão ao salvar administrador: ' + error.message);

            const btn = form.querySelector('.pl-admin-btn-save');
            if (btn) {
                btn.innerHTML = 'Cadastrar Admin';
                btn.disabled = false;
            }
        }
=======
            const res = await fetch('/api/admin/register', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('pl_token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Administrador cadastrado com sucesso!');
                document.getElementById('adminRegisterModal').style.display = 'none';
                form.reset();
            } else {
                const err = await res.json();
                alert('Erro ao cadastrar: ' + (err.message || 'Falha na requisição.'));
            }
            btn.innerHTML = originalText;
            btn.disabled = false;
        } catch(error) {
            console.error('Erro na integração', error);
            alert('Erro de conexão ao salvar administrador.');
        }
        */

        // Mock success
        alert('Cadastro mockado executado! Verifique o console para ver o payload.');
        document.getElementById('adminRegisterModal').style.display = 'none';
        form.reset();
>>>>>>> Stashed changes
    });
}

function renderAdminDashboard(data) {
    document.getElementById('kpi-total-users').textContent = data.kpis.totalUsers;
    document.getElementById('kpi-active-demands').textContent = data.kpis.activeDemands;
    document.getElementById('kpi-checkins').textContent = data.kpis.checkins;
    document.getElementById('kpi-virtual-letters').textContent = data.kpis.virtualLetters;
    document.getElementById('kpi-pending-mod').textContent = data.kpis.pendingMod;

    if (typeof Chart !== 'undefined') { renderCharts(data.charts); }

    renderList('recentRegistrationsList', data.recentRegistrations, (item) => `
        <div class="pl-list-item">
            <div class="pl-list-left">
                <span class="pl-list-title">${item.id} - ${item.name}</span>
                <span class="pl-list-subtitle">${item.sub}</span>
            </div>
            <div class="pl-list-right">
                <span class="pl-badge pl-badge-${item.color}">${item.status}</span>
                <span class="pl-list-subtitle">${item.date}</span>
            </div>
        </div>
    `);

    renderList('topCategoriesList', data.topCategories, (item) => `
        <div class="pl-list-item">
            <div class="pl-list-left">
                <span class="pl-list-title"><i class="bi bi-briefcase" style="margin-right:5px; color: var(--prolink-blue);"></i> ${item.name}</span>
            </div>
            <div class="pl-list-right"><span class="pl-list-title">${item.count} req.</span></div>
        </div>
    `);

    renderList('topCompaniesList', data.topCompanies, (item) => `
        <div class="pl-list-item">
            <div class="pl-list-left">
                <span class="pl-list-title"><i class="bi bi-building" style="margin-right:5px; color: #94a3b8;"></i> ${item.name}</span>
            </div>
            <div class="pl-list-right"><span class="pl-list-title">${item.count} dem.</span></div>
        </div>
    `);

    document.getElementById('mod-approved').textContent = data.moderation.approved;
    document.getElementById('mod-pending').textContent = data.moderation.pending;
    document.getElementById('mod-banned').textContent = data.moderation.banned;

    // Stats do gráfico de linha
    if (data.stats) {
        document.getElementById('stat-connections').textContent = data.stats.connections;
        document.getElementById('stat-daily-avg').textContent = data.stats.dailyAvg;
    }
}

function renderList(containerId, items, templateFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(templateFn).join('');
}

function renderCharts(chartData) {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Ubuntu', sans-serif";

    // 1. Gráfico de Rosca
    const ctxDonut = document.getElementById('userStatusChart');
    if (ctxDonut) {
        new Chart(ctxDonut, {
            type: 'doughnut',
            data: {
                labels: ['Profissionais (Crea)', 'Empresas', 'Administradores'],
                datasets: [{
                    data: chartData.userStatus,
                    backgroundColor: ['#4ade80', '#2b8cff', '#ffc107'], // Usando paleta Pro-Link
                    borderWidth: 0, hoverOffset: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '75%',
                plugins: {
                    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 15, color: '#fff' } }
                }
            }
        });
    }

    // 2. Gráfico de Linhas (Crescimento Demandas)
    const ctxLine = document.getElementById('demandsGrowthChart');
    if (ctxLine) {
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                datasets: [{
                    label: 'Demandas Via NLP',
                    data: chartData.demandsGrowth.slice(3, 7), // Pega os ultimos dados
                    borderColor: '#2b8cff', // Azul Pro-Link
                    backgroundColor: 'rgba(43, 140, 255, 0.1)',
                    borderWidth: 2, fill: true, tension: 0.4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}

window.addEventListener('hashchange', function () {
    if (window.location.hash !== '#admin') window._adminInitialized = false;
<<<<<<< Updated upstream
});

// Funções para as novas áreas (Mocks para fins demonstrativos do Demo Day)
window.loadUniversitarios = async function() {
    const list = document.getElementById('universitariosList');
    if (!list) return;
    
    try {
        const data = await apiRequest('/admin/usuarios?perfil=ESTUDANTE');
        // Usamos profissionais_pendentes_validacao ou usuarios? Na nossa rota do AdminController
        // manageUsers retorna 'usuarios' e 'profissionais_pendentes_validacao'
        const pendentes = data.profissionais_pendentes_validacao || [];

        if (pendentes.length === 0) {
            list.innerHTML = '<div class="pl-estudio-loading" style="padding: 1rem;">Nenhum estudante pendente...</div>';
            return;
        }

        list.innerHTML = pendentes.map(u => `
            <div class="pl-list-item">
                <div class="pl-list-left">
                    <span class="pl-list-title">Estudante ID: ${u.id_usuario}</span>
                    <span class="pl-list-subtitle">Aguardando Validação CREA</span>
                    <a href="javascript:void(0)" onclick="alert('Funcionalidade de download não implementada no MVP.')" style="font-size: 0.7rem; color: var(--prolink-blue); margin-top: 4px; display: inline-flex; align-items: center; gap: 4px; text-decoration: none;">
                        <i class="bi bi-file-earmark-pdf"></i> Ver Declaração
                    </a>
                </div>
                <div class="pl-list-right" style="display:flex; align-items:center; gap: 10px;">
                    <span class="pl-badge pl-badge-warning">Pendente</span>
                    <button class="pl-action-btn pl-action-btn-approve" onclick="aprovarEstudante(${u.id_usuario})"><i class="bi bi-check-lg"></i> Aprovar</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('[Admin] Erro ao carregar universitários:', e);
        list.innerHTML = '<div class="pl-estudio-loading" style="padding: 1rem; color: red;">Erro ao carregar dados.</div>';
    }
};

window.aprovarEstudante = async function(id) {
    if(!confirm('Confirma a aprovação deste estudante?')) return;
    try {
        await apiRequest('/admin/universitarios/aprovar', {
            method: 'POST',
            body: JSON.stringify({ id })
        });
        alert('Estudante aprovado com sucesso!');
        loadUniversitarios();
    } catch (e) {
        alert('Erro ao aprovar: ' + e.message);
    }
};

window.loadDenuncias = async function() {
    const list = document.getElementById('denunciasList');
    if (!list) return;

    try {
        const result = await apiRequest('/admin/moderacao');
        const denuncias = result.data || [];

        if (denuncias.length === 0) {
            list.innerHTML = '<div class="pl-estudio-loading" style="padding: 1rem;">Nenhuma denúncia pendente.</div>';
            return;
        }

        list.innerHTML = denuncias.map(d => `
            <div class="pl-list-item">
                <div class="pl-list-left">
                    <span class="pl-list-title">Alvo ID: ${d.id_alvo}</span>
                    <span class="pl-list-subtitle">${d.motivo}</span>
                </div>
                <div class="pl-list-right" style="display:flex; flex-direction: row; flex-wrap: wrap; align-items:center; justify-content: flex-end; gap: 10px;">
                    <span class="pl-badge pl-badge-danger" style="margin-right: 10px;">${d.status_denuncia}</span>
                    <button class="pl-action-btn pl-action-btn-warning" onclick="moderarDenuncia(${d.id}, 'suspender')"><i class="bi bi-envelope-exclamation"></i> Suspender e Mandar Notificação</button>
                    <button class="pl-action-btn pl-action-btn-ban" onclick="moderarDenuncia(${d.id}, 'banir')"><i class="bi bi-slash-circle"></i> Banir - Notificado</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('[Admin] Erro ao carregar denúncias:', e);
        list.innerHTML = '<div class="pl-estudio-loading" style="padding: 1rem; color: red;">Erro ao carregar denúncias.</div>';
    }
};

window.moderarDenuncia = async function(id, acao) {
    if(!confirm(`Confirma a ação de ${acao.toUpperCase()} para esta denúncia?`)) return;
    try {
        await apiRequest('/admin/denuncias/moderar', {
            method: 'POST',
            body: JSON.stringify({ id, acao })
        });
        alert(`Ação (${acao}) aplicada com sucesso!`);
        loadDenuncias();
    } catch (e) {
        alert('Erro ao moderar denúncia: ' + e.message);
    }
};

window.loadAuditoria = async function () {
    const list = document.getElementById('auditoriaList');
    if (!list) return;

    try {
        const result = await apiRequest('/admin/auditoria');
        const auditoria = result.data || [];

        if (auditoria.length === 0) {
            list.innerHTML = '<div class="pl-estudio-loading" style="padding: 1rem;">Nenhum registro de auditoria encontrado.</div>';
            return;
        }

        list.innerHTML = auditoria.map(a => `
            <div class="pl-list-item" style="border-left: 3px solid var(--prolink-accent); padding-left: 10px;">
                <div class="pl-list-left">
                    <span class="pl-list-title">${a.acao} - Usuário ID: ${a.id_usuario}</span>
                    <span class="pl-list-subtitle">${JSON.stringify(a.dados_novos || a.dados_antigos)}</span>
                </div>
                <div class="pl-list-right">
                    <span class="pl-list-subtitle">${a.criado_em}</span>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('[Admin] Erro ao carregar auditoria:', e);
        list.innerHTML = '<div class="pl-estudio-loading" style="padding: 1rem; color: red;">Erro ao carregar auditoria.</div>';
    }
};
=======
});
>>>>>>> Stashed changes
