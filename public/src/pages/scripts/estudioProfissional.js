window.initEstudioProfissional = async function() {
    // Guarda de re-execução: evita duplicar scripts se o usuário navegar para a rota de volta
    if (window._estudioInitialized) return;
    window._estudioInitialized = true;

    // Injeta o HTML de um sub-componente no slot alvo e re-avalia seus scripts
    async function injectComponent(slotId, htmlPath) {
        const slot = document.getElementById(slotId);
        if (!slot) return;

        try {
            const response = await fetch(htmlPath);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const htmlText = await response.text();
            slot.innerHTML = htmlText;

            // Re-avalia <script> injetados via innerHTML (necessário pois o parser não os executa)
            slot.querySelectorAll('script').forEach(oldScript => {
                const newScript = document.createElement('script');
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                } else {
                    newScript.textContent = oldScript.textContent;
                }
                document.body.appendChild(newScript);
                oldScript.remove();
            });
        } catch (error) {
            console.error(`[EstudioProfissional] Falha ao carregar ${htmlPath}:`, error);
            slot.innerHTML = `
                <div class="pl-estudio-loading" style="flex-direction:column; gap:1rem; color:#ff6b6b; border-color:rgba(255,107,107,0.3);">
                    <i class="bi bi-exclamation-triangle" style="font-size:1.8rem;"></i>
                    <span>Não foi possível carregar este componente.<br>Tente recarregar a página.</span>
                </div>`;
        }
    }

    // Caminhos corretos: src/entities/estudio-profissional/layouts/
    Promise.all([
        injectComponent('slot-post-management',     'src/entities/estudio-profissional/layouts/postManagement.html'),
        injectComponent('slot-portfolio-management', 'src/entities/estudio-profissional/layouts/portfolioManagement.html'),
        injectComponent('slot-audit-logs',           'src/entities/estudio-profissional/layouts/auditLogs.html')
    ]).then(() => {
        console.log('[EstudioProfissional] Módulo montado com sucesso.');
    });
};

// Reseta a flag ao sair da rota para permitir re-inicialização limpa numa próxima visita
window.addEventListener('hashchange', function() {
    if (window.location.hash !== '#criacao') {
        window._estudioInitialized = false;
    }
});