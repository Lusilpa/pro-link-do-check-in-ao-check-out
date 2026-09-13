(function initCardCorreio() {
    const mockMails = [
        { id: 1, sender: "Empresa Tapajós", subject: "Proposta de Demanda: Automação de RH", snippet: "Olá Luan, vimos o seu perfil e gostaríamos de propor uma parceria para o desenvolvimento de um sistema...", date: "10:30", unread: true },
        { id: 2, sender: "CREA-AM", subject: "Atualização de Acervo Técnico (ART)", snippet: "Sua solicitação de validação da ART número 12345/2026 foi aprovada com sucesso.", date: "Ontem", unread: false },
        { id: 3, sender: "UEE-AM", subject: "Pauta para o 2º Encontro Nacional", snippet: "Segue em anexo a pauta e a programação para os painéis de tecnologia. Favor revisar até amanhã.", date: "10 Set", unread: true }
    ];

    const wrapper = document.getElementById('correio-cards-wrapper');
    const badge = document.getElementById('unreadCountBadge');
    if (!wrapper) return;

    if (mockMails.length === 0) {
        wrapper.innerHTML = `
            <div class="pl-empty-state">
                <i class="bi bi-mailbox"></i>
                <h6>Sua caixa está vazia</h6>
                <p class="small">Novas mensagens e propostas aparecerão aqui.</p>
            </div>
        `;
        return;
    }

    let html = '';
    let unreadCount = 0;

    mockMails.forEach((mail, index) => {
        if(mail.unread) unreadCount++;
        html += `
        <div class="pl-correio-card ${mail.unread ? 'unread' : ''}" data-id="${mail.id}" style="animation-delay: ${index * 0.08}s">
            ${mail.unread ? '<div class="pl-unread-dot"></div>' : ''}
            <div class="pl-correio-header">
                <span class="pl-correio-sender"><i class="bi bi-person-circle"></i> ${mail.sender}</span>
                <span class="pl-correio-date">${mail.date}</span>
            </div>
            <h5 class="pl-correio-subject">${mail.subject}</h5>
            <p class="pl-correio-snippet">${mail.snippet}</p>
        </div>
        `;
    });

    wrapper.innerHTML = html;
    if(badge) badge.textContent = `${unreadCount} não lida${unreadCount !== 1 ? 's' : ''}`;
})();