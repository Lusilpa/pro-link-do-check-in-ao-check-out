(function initPostDeletar() {
    console.log('Script postDeletar inicializado com integração fetch (apiRequest).');

    document.querySelectorAll('.btn-del-post').forEach(btn => {
        btn.addEventListener('click', async function() {
            const targetId = this.getAttribute('data-target');
            const card = document.getElementById(targetId);
            
            const postId = targetId.replace('post-item-', '');

            if (card && confirm('Tem certeza que deseja apagar esta publicação permanentemente?')) {
                
                const originalHtml = this.innerHTML;
                this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                this.disabled = true;

                try {
                    // OBS: Esta rota precisa ser criada no backend
                    await apiRequest(`/posts/${postId}/remover`, {
                        method: 'POST'
                    });

                    // Sucesso: Remover do DOM
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.remove();
                    }, 300);

                } catch (error) {
                    console.error("Falha ao excluir o post:", error);
                    alert(`Erro ao tentar excluir a publicação: ${error.message}`);
                    
                    this.innerHTML = originalHtml;
                    this.disabled = false;
                }
            }
        });
    });
})();
