(function initPortfolioEditar() {
    console.log('Script portfolioEditar inicializado com integração fetch (apiRequest).');

    const loadingEl = document.getElementById('portfolioEditar-loading');
    const emptyEl = document.getElementById('portfolioEditar-empty');
    const listEl = document.getElementById('portfolioEditar-list');

    async function carregarProjetos() {
        if (!loadingEl || !emptyEl || !listEl) return;
        
        loadingEl.classList.remove('d-none');
        emptyEl.classList.add('d-none');
        listEl.classList.add('d-none');
        listEl.innerHTML = '';

        try {
            const user = typeof getAuthUser === 'function' ? getAuthUser() : null;
            if (!user) {
                loadingEl.classList.add('d-none');
                return;
            }

            // O backend retorna os projetos vinculados ao portfolio
            const response = await apiRequest(`/portfolio/${user.id}`, { method: 'GET' });
            
            loadingEl.classList.add('d-none');
            
            const projetos = response.projetos || [];

            if (projetos.length === 0) {
                emptyEl.classList.remove('d-none');
                return;
            }

            projetos.forEach(proj => {
                const card = document.createElement('div');
                card.className = 'pl-estudio-item-card';
                card.id = `port-item-${proj.id}`;

                // Miniatura da primeira imagem da galeria (ProjetoController::store/update
                // salva em ordem - ver projeto_imagens.ordem), se o projeto tiver alguma.
                const thumbHtml = (proj.imagens && proj.imagens.length > 0)
                    ? `<img src="${proj.imagens[0]}" alt="" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; margin-right: 0.75rem; flex-shrink: 0;">`
                    : '';

                card.innerHTML = `
                  <div class="pl-estudio-item-info" style="display: flex; align-items: center;">
                    ${thumbHtml}
                    <div>
                      <h5>${proj.titulo || 'Projeto Sem Título'}</h5>
                      <p>Categoria: ${proj.categoria || 'Geral'} • Ano: ${proj.ano || '—'}</p>
                    </div>
                  </div>
                  <div class="pl-estudio-item-actions">
                    <button class="pl-estudio-item-btn btn-editar-port" data-target="${proj.id}" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="pl-estudio-item-btn pl-estudio-item-btn--danger btn-del-port" data-target="port-item-${proj.id}" title="Excluir">
                      <i class="bi bi-trash3"></i>
                    </button>
                  </div>
                `;
                listEl.appendChild(card);
            });

            listEl.classList.remove('d-none');
            vincularEventosExclusao();

        } catch (error) {
            console.error("Falha ao buscar projetos do portfólio:", error);
            loadingEl.classList.add('d-none');
            emptyEl.classList.remove('d-none');
            emptyEl.querySelector('p').textContent = "Erro ao carregar projetos: " + error.message;
        }
    }

    function vincularEventosExclusao() {
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
                            if (listEl.children.length === 0) {
                                emptyEl.classList.remove('d-none');
                                listEl.classList.add('d-none');
                            }
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
        
        document.querySelectorAll('.btn-editar-port').forEach(btn => {
            btn.addEventListener('click', function() {
                alert("A tela de edição específica será implementada.");
            });
        });
    }

    carregarProjetos();
})();
