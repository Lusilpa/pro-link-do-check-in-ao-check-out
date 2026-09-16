(function initPostEditar() {
    console.log('Script postEditar inicializado com integração preparada.');

    const editButtons = document.querySelectorAll('.pl-estudio-item-btn[title="Editar"]');

    editButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Em uma integração real, nós buscaríamos o ID do post
            // Supondo que a estrutura use data-id no card principal
            const card = this.closest('.pl-estudio-item-card');

            // Simulação de extração de ID do elemento DOM (ex: id="post-item-123" ou data-id="123")
            let postId = card.getAttribute('data-id');
            if (!postId && card.id) {
                postId = card.id.replace('post-item-', '');
            }

            // Fallback se não achar id no mock
            if (!postId) postId = 'simulado';

            const postTitle = card.querySelector('h5')?.innerText || 'Post';

            console.log(`Iniciando edição do post: ${postTitle} (ID: ${postId})`);

            // Redireciona para o formulário de edição passando o ID via hash ou query string
            // ex: window.location.hash = `#post-editar-form?id=${encodeURIComponent(postId)}`;

            // Apenas para feedback visual temporário
            const originalContent = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
            this.disabled = true;

            setTimeout(() => {
                // Simulando navegação
                console.log(`Navegando para rota de edição: #post-editar-form?id=${postId}`);
                alert(`Integração: Redirecionando para editar o post ID ${postId}...`);
                this.innerHTML = originalContent;
                this.disabled = false;
            }, 600);
        });
    });
})();
