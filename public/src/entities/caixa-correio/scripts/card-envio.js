(function initCardEnvio() {
    
    const btnSend = document.getElementById('btnSendEnvio');
    const chipInput = document.getElementById('chipInput');
    const chipWrapper = document.getElementById('chipWrapper');
    const editor = document.getElementById('envioBody');
    
    // Elementos do Popover
    const attachZone = document.getElementById('envioAttachmentsZone');
    const attachPopover = document.getElementById('attachPopover');
    const viewChoice = document.getElementById('popoverViewChoice');
    const viewDemand = document.getElementById('popoverViewDemand');
    const fileInput = document.getElementById('hiddenFileInput');
    const attachList = document.getElementById('envioAttachmentsList');
    
    let attachments = [];
    let chips = [];

    // ==========================================
    // 1. TOOLBAR DO EDITOR DE TEXTO (AGORA FUNCIONA!)
    // ==========================================
    document.querySelectorAll('.pl-toolbar-btn').forEach(btn => {
        // MOUSE DOWN é o segredo! Ele impede que a caixa de texto perca o foco antes de formatar.
        btn.addEventListener('mousedown', function(e) {
            e.preventDefault(); 
            const cmd = this.dataset.cmd;
            
            if(cmd === 'createLink') {
                const url = prompt('Insira o link (ex: https://site.com):');
                if(url) document.execCommand(cmd, false, url);
            } else {
                document.execCommand(cmd, false, null);
            }
        });
    });

    // ==========================================
    // 2. SISTEMA DE ANEXOS E POPOVER
    // ==========================================
    
    // Abre/Fecha Popover
    attachZone.addEventListener('click', () => {
        attachPopover.style.display = attachPopover.style.display === 'none' ? 'block' : 'none';
        viewChoice.style.display = 'block';
        viewDemand.style.display = 'none';
    });

    // Fechar pelo botão X
    document.getElementById('closePopover').addEventListener('click', () => {
        attachPopover.style.display = 'none';
    });

    // Computador (Abre a janela do Windows)
    document.getElementById('btnAttachComputer').addEventListener('click', () => {
        fileInput.click();
        attachPopover.style.display = 'none';
    });

    fileInput.addEventListener('change', function() {
        Array.from(this.files).forEach(file => {
            attachments.push({ id: Date.now() + Math.random(), name: file.name, type: 'file' });
        });
        renderAttachments();
        this.value = ''; // Reseta input
    });

    // Vincular Demanda (Troca a tela do popover)
    document.getElementById('btnAttachDemand').addEventListener('click', () => {
        viewChoice.style.display = 'none';
        viewDemand.style.display = 'block';
        renderMockDemands(); // Simula a busca no banco
    });

    // Voltar na tela do Popover
    document.getElementById('backPopover').addEventListener('click', () => {
        viewDemand.style.display = 'none';
        viewChoice.style.display = 'block';
    });

    function renderMockDemands() {
        const resultsContainer = document.getElementById('demandSearchResults');
        const mockDemands = [
            { code: "DM-2026-01", title: "Integração Lhumos / Ponto Eletrônico" },
            { code: "DM-2026-02", title: "Cálculo Estrutural Galpão BR-319" }
        ];

        let html = '';
        mockDemands.forEach(d => {
            html += `
                <div class="pl-demand-result-item" onclick="selectDemand('${d.code}', '${d.title}')">
                    <span class="pl-demand-title">${d.title}</span>
                    <span class="pl-demand-code"><i class="bi bi-briefcase"></i> ${d.code}</span>
                </div>
            `;
        });
        resultsContainer.innerHTML = html;
    }

    // Exporta para ser chamado no HTML injetado
    window.selectDemand = function(code, title) {
        attachments.push({ id: Date.now(), name: `${code} - ${title}`, type: 'demand' });
        renderAttachments();
        attachPopover.style.display = 'none';
    };

    function renderAttachments() {
        let html = '';
        attachments.forEach(att => {
            const icon = att.type === 'demand' ? 'bi-briefcase-fill' : 'bi-file-earmark-text';
            const color = att.type === 'demand' ? '#a855f7' : 'var(--prolink-blue)';
            html += `
                <div class="pl-attachment-item" style="border-left: 3px solid ${color};">
                    <span><i class="bi ${icon}" style="color: ${color}; margin-right: 6px;"></i> ${att.name}</span>
                    <button type="button" class="pl-btn-remove-attachment" onclick="removeEnvioAttachment(${att.id})">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </div>`;
        });
        attachList.innerHTML = html;
    }

    window.removeEnvioAttachment = (id) => { 
        attachments = attachments.filter(a => a.id !== id); 
        renderAttachments(); 
    };

    // [SEGURANÇA C2 CORRIGIDO] Nunca inserir input do usuário via innerHTML.
    // Construção do chip via DOM seguro para prevenir XSS.
    function renderChips() {
        chipWrapper.querySelectorAll('.pl-chip').forEach(c => c.remove());
        chips.forEach((email, index) => {
            const chip = document.createElement('span');
            chip.className = 'pl-chip';

            const emailText = document.createTextNode(email + ' ');

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pl-chip-remove';
            btn.dataset.index = index;
            btn.setAttribute('aria-label', `Remover ${email}`);
            const icon = document.createElement('i');
            icon.className = 'bi bi-x-circle-fill';
            icon.setAttribute('aria-hidden', 'true');
            btn.appendChild(icon);

            chip.appendChild(emailText);
            chip.appendChild(btn);
            chipWrapper.insertBefore(chip, chipInput);
        });
    }

    chipInput.addEventListener('keydown', function(e) {
        if(e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const email = this.value.trim().replace(/,/g, '');
            if(email) { chips.push(email); renderChips(); this.value = ''; }
        }
    });

    chipWrapper.addEventListener('click', function(e) {
        if(e.target.closest('.pl-chip-remove')) {
            chips.splice(e.target.closest('.pl-chip-remove').dataset.index, 1);
            renderChips();
        } else { chipInput.focus(); }
    });

    if (btnSend) {
        btnSend.addEventListener('click', function() {
            if (chips.length === 0) {
                if(window.prolinkToast) window.prolinkToast("Insira pelo menos um destinatário.", "error");
                return;
            }

            const originalText = btnSend.innerHTML;
            btnSend.innerHTML = '<i class="bi bi-hourglass-split" aria-hidden="true"></i> ENVIANDO…';
            btnSend.style.background = 'rgba(43, 140, 255, 0.3)';
            
            setTimeout(() => {
                if(window.prolinkToast) window.prolinkToast(`Mensagem enviada com sucesso!`);
                btnSend.innerHTML = originalText;
                btnSend.style.background = '';
                chips = []; renderChips();
                document.getElementById('envioSubject').value = '';
                editor.innerHTML = '';
                attachments = []; renderAttachments();
                document.dispatchEvent(new CustomEvent('prolink:close-mail-compose'));
            }, 1000);
        });
    }

    // Bugfix: close panel button
    const btnClose = document.getElementById('closeEnvioPanel');
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('prolink:close-mail-compose'));
        });
    }

    // Bugfix: add function for reply
    window.setComposeRecipients = function(email, subject) {
        chips = [email];
        renderChips();
        if (subject) {
            const subjInput = document.getElementById('envioSubject');
            if (subjInput) subjInput.value = `Re: ${subject}`;
        }
    };
})();