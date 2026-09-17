(function initCardCorreio() {
    const wrapper = document.getElementById('correio-cards-wrapper');
    const badge = document.getElementById('unreadCountBadge');
    if (!wrapper) return;

    // Extrai texto puro da legenda (gravada como HTML pelo editor rich-text do compose).
    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html || '';
        return tmp.textContent || '';
    }

    function formatDate(dataIso) {
        if (!dataIso) return '';
        const d = new Date(dataIso.replace(' ', 'T'));
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    }

    async function render() {
        const cartas = await fetchCartasVirtuais();

        if (!cartas || cartas.length === 0) {
            wrapper.innerHTML = `
                <div class="pl-empty-state">
                    <i class="bi bi-mailbox"></i>
                    <h6>Nenhuma carta enviada</h6>
                    <p class="small">Cartas virtuais que você enviar aparecerão aqui.</p>
                </div>
            `;
            if (badge) badge.textContent = '0 cartas';
            return;
        }

        let html = '';
        cartas.forEach((carta, index) => {
            const snippet = stripHtml(carta.legenda).slice(0, 120);
            html += `
            <div class="pl-correio-card" data-id="${carta.id}" style="animation-delay: ${index * 0.08}s">
                <div class="pl-correio-header">
                    <span class="pl-correio-sender"><i class="bi bi-send"></i> Para: ${carta.destinatarioEmail}</span>
                    <span class="pl-correio-date">${formatDate(carta.criadoEm)}</span>
                </div>
                <h5 class="pl-correio-subject">${carta.titulo}</h5>
                <p class="pl-correio-snippet">${snippet}</p>
            </div>
            `;
        });

        wrapper.innerHTML = html;
        if (badge) badge.textContent = `${cartas.length} carta${cartas.length !== 1 ? 's' : ''} enviada${cartas.length !== 1 ? 's' : ''}`;
    }

    // Exposto para que o compose (card-envio.js) e o detalhe (detail-correio.js)
    // possam atualizar a lista após criar/remover uma carta.
    window.refreshCorreioList = render;

    render();
})();
