window.initAdmin = async function () {
    if (window._adminInitialized) return;
    window._adminInitialized = true;

    if (typeof Chart === 'undefined') {
        console.error('[Admin] Chart.js não está carregado.');
    }

    try {
        await loadAdminData();
        setupAdminFormListener();
    } catch (error) {
        console.error('[Admin] Erro ao inicializar:', error);
    }
};

async function loadAdminData() {
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
}

function setupAdminFormListener() {
    const form = document.getElementById('formAdminRegister');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nome = document.getElementById('admin-nome').value;
        const email = document.getElementById('admin-email').value;
        const senha = document.getElementById('admin-senha').value;
        const nivel = document.getElementById('admin-nivel').value;
        
        const payload = { nome, email, senha, nivel };
        console.log('[Admin] Payload Cadastro Admin:', payload);

        // TODO: Integração real
        /*
        try {
            const btn = form.querySelector('.pl-admin-btn-save');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Salvando...';
            btn.disabled = true;

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
});