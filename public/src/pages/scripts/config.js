window.initConfig = function() {
    if (window._configInitialized) return;
    window._configInitialized = true;

    const menuArea = document.getElementById('config-menu-area');
    const dynamicArea = document.getElementById('config-dynamic-area');
    const slot = document.getElementById('config-component-slot');
    const btnBack = document.getElementById('btn-config-back');
    const btnLogout = document.getElementById('btn-logout');
    
    // Mapeamento completo de sub-componentes
    const componentMap = {
        'dadosPessoais': 'src/entities/config/layouts/dadosPessoais.html',
        'mudancaSenha':  'src/entities/config/layouts/mudancaSenha.html',
        'mudancaConta':  'src/entities/config/layouts/mudancaConta.html',
        'politicas':     'src/entities/config/layouts/politicas.html',
    };

    // Função para Injetar o Subcomponente e trocar a tela
    async function openComponent(targetKey) {
        const filePath = componentMap[targetKey];
        
        if (!filePath) {
            alert(`A tela de ${targetKey} ainda está em desenvolvimento.`);
            return;
        }

        try {
            slot.innerHTML = `<p style="color: var(--prolink-accent);">Carregando ${targetKey}...</p>`;
            
            // Transição visual
            menuArea.classList.add('d-none');
            dynamicArea.classList.remove('d-none');

            // Busca o componente interno
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            slot.innerHTML = await response.text();

            // Executa os scripts internos do subcomponente
            slot.querySelectorAll('script').forEach(oldScript => {
                const newScript = document.createElement('script');
                if (oldScript.src) newScript.src = oldScript.src;
                else newScript.textContent = oldScript.textContent;
                document.body.appendChild(newScript);
                oldScript.remove();
            });

        } catch (error) {
            console.error('[Config] Erro ao carregar subcomponente:', error);
            slot.innerHTML = `<p style="color: #ff4d4d;">Erro ao carregar a interface. Tente novamente.</p>`;
        }
    }

    // Adiciona evento de clique em todos os botões do menu (atributo data-target)
    document.querySelectorAll('[data-target]').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target) openComponent(target);
        });
    });

    // Botão Voltar (Retorna ao Menu Principal)
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            dynamicArea.classList.add('d-none');
            menuArea.classList.remove('d-none');
            slot.innerHTML = ''; // Limpa a memória do slot atual
        });
    }

    // Lógica do Botão Sair
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            // Aqui você pode limpar localStorage/sessionStorage
            // localStorage.removeItem('userToken');
            window.location.hash = '#'; // Redireciona para a tela de login/auth
        });
    }
};

// Limpeza da flag ao sair da rota de configurações
window.addEventListener('hashchange', function() {
    if (window.location.hash !== '#config') {
        window._configInitialized = false;
    }
});