(function initAuditLogs() {
    const container = document.getElementById('auditLogsContainer');
    if (!container) return;

    // Mock de dados da API simulando os registros
    const mockLogs = [
        { date: "13/09/2026", time: "12:45", action: "Login realizado com sucesso via Web", profile: "Luan Palma", type: "login" },
        { date: "12/09/2026", time: "16:30", action: "Post 'Atualização de RH' criado na plataforma", profile: "Luan Palma", type: "create" },
        { date: "10/09/2026", time: "09:15", action: "Credenciais de segurança alteradas", profile: "Admin Sistema", type: "security" },
        { date: "08/09/2026", time: "14:20", action: "Nova demanda DM-2026-01 vinculada ao perfil", profile: "Luan Palma", type: "link" },
        { date: "05/09/2026", time: "18:00", action: "Sessão expirada pelo sistema", profile: "Luan Palma", type: "system" }
    ];

    if (mockLogs.length === 0) {
        container.innerHTML = `<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 2rem;">Nenhum log registrado.</p>`;
        return;
    }

    let html = '';
    mockLogs.forEach((log, index) => {
        // Escolhe um ícone de perfil dinâmico com base na pessoa/ação
        let icon = 'bi-person-circle';
        if(log.type === 'security') icon = 'bi-shield-lock-fill';
        if(log.type === 'system') icon = 'bi-cpu-fill';

        // O style="animation-delay" cria o efeito visual em cascata
        html += `
        <div class="pl-audit-card" style="animation-delay: ${index * 0.08}s">
            <div class="pl-audit-datetime">
                <span class="pl-audit-date">${log.date}</span>
                <span class="pl-audit-time">${log.time}</span>
            </div>
            <div class="pl-audit-action">
                ${log.action}
            </div>
            <div class="pl-audit-profile">
                <i class="bi ${icon}"></i>
                <span class="pl-audit-profile-name">${log.profile}</span>
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
})();