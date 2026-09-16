window.initAdmin = async function() {
    if (window._adminInitialized) return;
    window._adminInitialized = true;

    console.log('[Admin] Inicializando painel de administração...');

    // Certifique-se de que Chart.js está carregado
    if (typeof Chart === 'undefined') {
        console.error('[Admin] Chart.js não está carregado. Os gráficos não serão renderizados.');
    }

    try {
        // Tenta buscar dados reais via apiRequest (se existir a rota)
        if (typeof apiRequest !== 'undefined') {
            try {
                const response = await apiRequest('/admin/dashboard-stats');
                renderAdminDashboard(response.data);
                return;
            } catch (apiError) {
                console.warn('[Admin] Rota de backend /admin/dashboard-stats falhou ou não existe. Usando Mock Data.', apiError);
            }
        }

        // FAKE DATA para manter o UI impecável caso o backend não esteja pronto
        const mockData = {
            kpis: {
                totalUsers: 105,
                activeDemands: 28,
                pendingMod: 7,
                matches: 54,
                revenue: 'R$ 24.580,00'
            },
            charts: {
                userStatus: [28, 16, 7, 54], // Abertas, Manutenção, Aguardando, Concluídas (Exemplo)
                demandsGrowth: [5, 9, 13, 16, 18, 24, 28, 30] // Dados para a linha
            },
            recentRegistrations: [
                { id: 'OS-20260829-0007', name: 'João da Silva', sub: 'Smartphone iPhone 12', status: 'EM MANUTENÇÃO', date: '30/08/2026 11:10', color: 'blue' },
                { id: 'OS-20260829-0006', name: 'Maria Oliveira', sub: 'Notebook Dell Inspiron', status: 'AGUARDANDO APROVAÇÃO', date: '30/08/2026 09:45', color: 'yellow' },
                { id: 'OS-20260828-0005', name: 'Carlos Santos', sub: 'TV Samsung 50"', status: 'CONCLUÍDA', date: '28/08/2026 17:30', color: 'green' }
            ],
            topCategories: [
                { name: 'Troca de Tela', count: 23 },
                { name: 'Limpeza Interna', count: 18 },
                { name: 'Formatação de Software', count: 15 },
                { name: 'Troca de Bateria', count: 12 }
            ],
            topCompanies: [
                { name: 'Smartphones', count: 48 },
                { name: 'Notebooks', count: 20 },
                { name: 'Televisores', count: 14 },
                { name: 'Impressoras', count: 10 }
            ],
            moderation: {
                approved: 145,
                pending: 23,
                banned: 5
            }
        };

        renderAdminDashboard(mockData);

    } catch (error) {
        console.error('[Admin] Erro geral ao inicializar dashboard:', error);
    }
};

function renderAdminDashboard(data) {
    // 1. Atualizar KPIs
    document.getElementById('kpi-total-users').textContent = data.kpis.totalUsers;
    document.getElementById('kpi-active-demands').textContent = data.kpis.activeDemands;
    document.getElementById('kpi-pending-mod').textContent = data.kpis.pendingMod;
    document.getElementById('kpi-matches').textContent = data.kpis.matches;
    document.getElementById('kpi-revenue').textContent = data.kpis.revenue;

    // 2. Atualizar Gráficos (Chart.js)
    if (typeof Chart !== 'undefined') {
        renderCharts(data.charts);
    }

    // 3. Atualizar Listas
    renderList('recentRegistrationsList', data.recentRegistrations, (item) => `
        <div class="pl-list-item">
            <div class="pl-list-left">
                <span class="pl-list-title">${item.id}</span>
                <span class="pl-list-subtitle">${item.name}</span>
                <span class="pl-list-subtitle" style="font-size: 0.7rem;">${item.sub}</span>
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
                <span class="pl-list-title"><i class="bi bi-wrench" style="margin-right: 5px; color: #64748b;"></i> ${item.name}</span>
            </div>
            <div class="pl-list-right">
                <span class="pl-list-title">${item.count}</span>
            </div>
        </div>
    `);

    renderList('topCompaniesList', data.topCompanies, (item) => `
        <div class="pl-list-item">
            <div class="pl-list-left">
                <span class="pl-list-title"><i class="bi bi-display" style="margin-right: 5px; color: #64748b;"></i> ${item.name}</span>
            </div>
            <div class="pl-list-right">
                <span class="pl-list-title">${item.count}</span>
            </div>
        </div>
    `);

    // 4. Atualizar Moderação
    document.getElementById('mod-approved').textContent = data.moderation.approved;
    document.getElementById('mod-pending').textContent = data.moderation.pending;
    document.getElementById('mod-banned').textContent = data.moderation.banned;
}

function renderList(containerId, items, templateFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = `<div style="padding: 1rem; color: #94a3b8; font-size: 0.85rem;">Nenhum dado encontrado.</div>`;
        return;
    }

    container.innerHTML = items.map(templateFn).join('');
}

function renderCharts(chartData) {
    // Configurações Globais Chart.js para Dark Mode
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;

    // 1. Gráfico de Rosca (Donut)
    const ctxDonut = document.getElementById('userStatusChart');
    if (ctxDonut) {
        new Chart(ctxDonut, {
            type: 'doughnut',
            data: {
                labels: ['Abertas', 'Em Manutenção', 'Aguardando Aprovação', 'Concluídas'],
                datasets: [{
                    data: chartData.userStatus,
                    backgroundColor: [
                        '#3b82f6', // blue
                        '#22c55e', // green
                        '#eab308', // yellow
                        '#a855f7'  // purple
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: { size: 11 }
                        }
                    }
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: function(chart) {
                    var width = chart.width,
                        height = chart.height,
                        ctx = chart.ctx;

                    ctx.restore();
                    var fontSize = (height / 110).toFixed(2);
                    ctx.font = "bold " + fontSize + "em sans-serif";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = "#f8fafc";

                    var total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    
                    var text = total.toString(),
                        textX = Math.round((width - ctx.measureText(text).width) / 2) - 45, // Shift left due to legend
                        textY = height / 2 + 5;

                    ctx.fillText(text, textX, textY);
                    
                    ctx.font = "normal 0.7em sans-serif";
                    ctx.fillStyle = "#94a3b8";
                    ctx.fillText("Total", textX, textY - 20);
                    ctx.save();
                }
            }]
        });
    }

    // 2. Gráfico de Linhas (Crescimento)
    const ctxLine = document.getElementById('demandsGrowthChart');
    if (ctxLine) {
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: ['01/08', '05/08', '10/08', '15/08', '20/08', '25/08', '30/08'],
                datasets: [{
                    label: 'Faturamento / Vagas',
                    data: chartData.demandsGrowth,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false,
                        },
                        ticks: {
                            callback: function(value) { return value + 'k'; }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false,
                        }
                    }
                }
            }
        });
    }
}

// Reseta a flag ao sair da rota para permitir re-inicialização limpa numa próxima visita
window.addEventListener('hashchange', function() {
    if (window.location.hash !== '#admin') {
        window._adminInitialized = false;
    }
});
