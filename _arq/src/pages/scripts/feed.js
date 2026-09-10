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
  // MOCK DE POSTAGENS (Pronto para substituir por fetch da API no shared/api)
  // ==========================================
  setTimeout(() => {
    const mockHtml = `
      <!-- Card 1 -->
      <div class="pl-feed-card" style="background-color: var(--prolink-bg-darker); border: 1px solid var(--prolink-blue); border-left: 4px solid var(--prolink-blue); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);">
        <div class="pl-feed-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div class="pl-user-info" style="display: flex; align-items: center; gap: 0.8rem;">
            <div class="pl-avatar-teal" style="width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--prolink-blue); display: flex; align-items: center; justify-content: center; color: var(--prolink-blue); font-size: 1.2rem;">
              <i class="bi bi-person-fill"></i>
            </div>
            <div class="pl-user-meta" style="display: flex; flex-direction: column;">
              <h6 style="margin: 0; color: var(--prolink-light); font-size: 0.95rem; font-weight: 700;">LUAN PALMA</h6>
              <span style="color: var(--prolink-light); font-size: 0.85rem; opacity: 0.7;">Software Engineer • 5 min</span>
            </div>
          </div>
          <button style="background: none; border: none; color: var(--prolink-blue); font-size: 1.2rem; cursor: pointer;"><i class="bi bi-three-dots-vertical"></i></button>
        </div>
        <div class="pl-feed-body">
          <h4 style="color: var(--prolink-light); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem;">Pro-Link: Do check-in ao Check-out</h4>
          <p style="color: var(--prolink-light); font-size: 0.95rem; line-height: 1.5; opacity: 0.9;">Finalizamos a estruturação do Agente de Recomendação baseado em NLP para cruzamento semântico de demandas com as áreas do Confea/Crea, garantindo total isonomia e conformidade com o edital sem criar rankings institucionais. O sistema de Cartas Virtuais com carimbo eletrônico também está integrado via SMTP.</p>
        </div>
        <div class="pl-feed-footer" style="display: flex; gap: 1.5rem; color: var(--prolink-blue); font-weight: 600;">
          <span><i class="bi bi-heart"></i> 23</span>
          <span><i class="bi bi-chat-text"></i> 12</span>
          <span><i class="bi bi-bar-chart-fill"></i> 312</span>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="pl-feed-card" style="background-color: var(--prolink-bg-darker); border: 1px solid var(--prolink-blue); border-left: 4px solid var(--prolink-blue); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);">
        <div class="pl-feed-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div class="pl-user-info" style="display: flex; align-items: center; gap: 0.8rem;">
            <div class="pl-avatar-teal" style="width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--prolink-blue); display: flex; align-items: center; justify-content: center; color: var(--prolink-blue); font-size: 1.2rem;">
              <i class="bi bi-person-fill"></i>
            </div>
            <div class="pl-user-meta" style="display: flex; flex-direction: column;">
              <h6 style="margin: 0; color: var(--prolink-light); font-size: 0.95rem; font-weight: 700;">HANNA REIS</h6>
              <span style="color: var(--prolink-light); font-size: 0.85rem; opacity: 0.7;">Software Engineer • 5 min</span>
            </div>
          </div>
          <button style="background: none; border: none; color: var(--prolink-blue); font-size: 1.2rem; cursor: pointer;"><i class="bi bi-three-dots-vertical"></i></button>
        </div>
        <div class="pl-feed-body">
          <h4 style="color: var(--prolink-light); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem;">Validação de ARTs via API do CREA-AM</h4>
          <p style="color: var(--prolink-light); font-size: 0.95rem; line-height: 1.5; opacity: 0.9;">Módulo de integração com a API oficial concluído com sucesso! Agora, o sistema consome CPFs, CNPJs, ARTs e CATs em tempo real para conceder o Selo de Verificação e liberar o carimbo eletrônico das cartas virtuais.</p>
        </div>
        <div class="pl-feed-footer" style="display: flex; gap: 1.5rem; color: var(--prolink-blue); font-weight: 600;">
          <span><i class="bi bi-heart"></i> 23</span>
          <span><i class="bi bi-chat-text"></i> 12</span>
          <span><i class="bi bi-bar-chart-fill"></i> 312</span>
        </div>
      </div>
    `;
    $('#feed-posts-container').html(mockHtml);
  }, 500);

});