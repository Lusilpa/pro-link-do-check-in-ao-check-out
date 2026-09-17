$(document).ready(function() {
    
  // 1. Carrega a Barra Lateral
  $('#lateral-inject-area').load('src/entities/feed/layouts/lateral.html', function(response, status, xhr) {
      if(status == "error") console.error("Erro ao carregar menu lateral:", xhr.status, xhr.statusText);
  });
  
  // ==========================================
  // CARREGAMENTO DESKTOP (Coluna da Direita)
  // ==========================================
  $('#calendar-inject-area').load('src/entities/feed/layouts/calendar.html', function(response, status, xhr) {
    if(status == "error") {
      console.error("Erro ao carregar o calendário:", xhr.status, xhr.statusText);
    } else {
      var tentativas = 0;
      var tentarRenderDesktop = function() {
        if (typeof renderProLinkCalendar === "function") {
          renderProLinkCalendar();
        } else if (tentativas++ < 10) {
          setTimeout(tentarRenderDesktop, 100);
        }
      };
      setTimeout(tentarRenderDesktop, 100);
    }
  });

  $('#filters-inject-area').load('src/entities/feed/layouts/filter-feed.html');

  // Lógica de clique para ABRIR / FECHAR os Filtros no Desktop
  $('#btn-toggle-filters').on('click', function() {
    $('#filters-inject-area').slideToggle(300);
    $('#filter-arrow-icon').toggleClass('bi-chevron-down bi-chevron-up');
  });

  // ==========================================
  // CARREGAMENTO MOBILE (Janela Offcanvas)
  // ==========================================
  $('#mobile-calendar-inject-area').load('src/entities/feed/layouts/calendar.html', function(response, status, xhr) {
    if(status !== "error") {
      var tentativas = 0;
      var tentarRenderMobile = function() {
        if (typeof renderProLinkCalendar === "function") {
          renderProLinkCalendar();
        } else if (tentativas++ < 10) {
          setTimeout(tentarRenderMobile, 100);
        }
      };
      setTimeout(tentarRenderMobile, 100);
    }
  });

  $('#mobile-filters-inject-area').load('src/entities/feed/layouts/filter-feed.html');


  // ==========================================
  // POSTAGENS DO FEED (via src/shared/api/feed.js)
  // ==========================================
  function renderFeedCard(post) {
    const heartIcon = post.liked_by_me ? 'bi-heart-fill' : 'bi-heart';
    const heartColor = post.liked_by_me ? '#ff4d6d' : 'var(--prolink-blue)';

    // A midia do post (campo "midia" em postCriar.js) aceita imagem ou PDF - o back
    // so devolve a URL (image_url), entao decide aqui pela extensao como renderizar.
    const midiaHtml = !post.image_url
      ? ''
      : /\.pdf(\?|$)/i.test(post.image_url)
        ? `<p style="margin: 0 0 0.75rem;"><a href="${post.image_url}" target="_blank" rel="noopener" style="color: var(--prolink-blue);"><i class="bi bi-file-earmark-pdf"></i> Ver anexo (PDF)</a></p>`
        : `<img src="${post.image_url}" alt="Mídia do post" style="max-width: 100%; border-radius: 8px; margin-bottom: 0.75rem; display: block;">`;

    return `
      <div class="pl-feed-card" data-post-id="${post.id}" style="background-color: var(--prolink-bg-darker); border: 1px solid var(--prolink-blue); border-left: 4px solid var(--prolink-blue); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);">
        <div class="pl-feed-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div class="pl-user-info" style="display: flex; align-items: center; gap: 0.8rem;">
            <div class="pl-avatar-teal" style="width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--prolink-blue); display: flex; align-items: center; justify-content: center; color: var(--prolink-blue); font-size: 1.2rem;">
              <i class="bi bi-person-fill"></i>
            </div>
            <div class="pl-user-meta" style="display: flex; flex-direction: column;">
              <h6 style="margin: 0; color: var(--prolink-light); font-size: 0.95rem; font-weight: 700;">${post.author_name}</h6>
              <span style="color: var(--prolink-light); font-size: 0.85rem; opacity: 0.7;">${post.author_role} • ${post.time_ago}</span>
            </div>
          </div>
          <!-- Botão de opções do post (sem ação implementada ainda) -->
          <!-- <button style="background: none; border: none; color: var(--prolink-blue); font-size: 1.2rem; cursor: pointer;"><i class="bi bi-three-dots-vertical"></i></button> -->
        </div>
        <div class="pl-feed-body">
          <h4 style="color: var(--prolink-light); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem;">${post.title}</h4>
          <p style="color: var(--prolink-light); font-size: 0.95rem; line-height: 1.5; opacity: 0.9;">${post.content}</p>
          ${midiaHtml}
        </div>
        <div class="pl-feed-footer" style="display: flex; gap: 1.5rem; color: var(--prolink-blue); font-weight: 600;">
          <span class="pl-btn-like" style="cursor: pointer;"><i class="bi ${heartIcon}" style="color: ${heartColor};"></i> <span class="pl-like-count">${post.likes_count}</span></span>
        </div>
      </div>
    `;
  }

  async function loadFeed(filtros = {}) {
    const container = $('#feed-posts-container');
    container.html('<div class="text-center text-muted py-4">Carregando publicações...</div>');

    const posts = await fetchFeedPosts(filtros);

    if (!posts || posts.length === 0) {
      container.html('<p class="text-muted text-center py-4">Nenhuma publicação encontrada.</p>');
      return;
    }

    container.html(posts.map(renderFeedCard).join(''));
  }

  // Estado combinado dos filtros do widget (grau/area/ordem) + busca textual, para que
  // aplicar um não descarte o outro.
  let feedFilters = { grau: '', area: '', ordem: 'desc', busca: '' };

  function reloadFeed(parcial = {}) {
    feedFilters = { ...feedFilters, ...parcial };
    loadFeed(feedFilters);
  }

  // Ponte para o widget de filtros (src/entities/feed/scripts/filter-feed.js), que
  // roda fora deste closure e nao tem acesso direto a loadFeed().
  window.applyFeedFilters = function(filtros) {
    reloadFeed(filtros);
  };

  // Barra de pesquisa: filtra por título/conteúdo no backend, com debounce para não
  // disparar uma requisição a cada tecla digitada.
  const searchInput = document.getElementById('feed-search-input');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        reloadFeed({ busca: searchInput.value.trim() });
      }, 400);
    });
  }

  // Curtir/descurtir: atualiza o coração e o contador otimisticamente, sem recarregar o feed inteiro.
  $('#feed-posts-container').on('click', '.pl-btn-like', async function() {
    const card = $(this).closest('.pl-feed-card');
    const postId = card.data('post-id');
    const icon = $(this).find('i');
    const countEl = $(this).find('.pl-like-count');
    const estavaCurtido = icon.hasClass('bi-heart-fill');

    try {
      await likePost(postId);

      const novaContagem = estavaCurtido ? parseInt(countEl.text(), 10) - 1 : parseInt(countEl.text(), 10) + 1;
      countEl.text(novaContagem);
      icon.toggleClass('bi-heart-fill bi-heart');
      icon.css('color', estavaCurtido ? 'var(--prolink-blue)' : '#ff4d6d');
    } catch (error) {
      console.error('[Feed] Erro ao curtir post:', error.message);
    }
  });

  loadFeed();

});