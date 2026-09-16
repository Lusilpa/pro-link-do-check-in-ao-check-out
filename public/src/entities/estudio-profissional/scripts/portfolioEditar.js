(function initPortfolioEditar() {
    console.log('Script portfolioEditar inicializado com integração fetch (apiRequest).');

    document.querySelectorAll('.btn-del-port').forEach(btn => {
        btn.addEventListener('click', async function() {
            const targetId = this.getAttribute('data-target');
            const card = document.getElementById(targetId);
            
            const itemId = targetId.replace('port-item-', '');

            if (card && confirm('Tem certeza que deseja remover este projeto do portfólio?')) {
                
                const originalContent = this.innerHTML;
                this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                this.disabled = true;

                try {
                    await apiRequest(`/projetos/${itemId}/remover`, {
                        method: 'POST'
                    });

                    // Sucesso: Remover do DOM
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.remove();
                    }, 300);

                } catch (error) {
                    console.error("Falha ao remover o projeto do portfólio:", error);
                    alert(`Não foi possível excluir o projeto: ${error.message}`);
                    
                    this.innerHTML = originalContent;
                    this.disabled = false;
                }
            }
        });
    });
})();
