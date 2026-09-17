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
    const inputSearchDemand = document.getElementById('inputSearchDemand');
    const demandResultsContainer = document.getElementById('demandSearchResults');

    let attachments = [];
    let chips = [];
    let demandasCache = null;

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

    // A carta virtual aceita apenas um arquivo anexo — um novo arquivo substitui o anterior.
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            attachments = attachments.filter(a => a.type !== 'file');
            attachments.push({ id: Date.now() + Math.random(), name: file.name, type: 'file', file });
            renderAttachments();
        }
        this.value = ''; // Reseta input
    });

    // Vincular Demanda (Troca a tela do popover)
    document.getElementById('btnAttachDemand').addEventListener('click', () => {
        viewChoice.style.display = 'none';
        viewDemand.style.display = 'block';
        buscarEExibirDemandas('');
    });

    // Voltar na tela do Popover
    document.getElementById('backPopover').addEventListener('click', () => {
        viewDemand.style.display = 'none';
        viewChoice.style.display = 'block';
    });

    // Busca as demandas reais (GET /demandas) uma vez e filtra localmente por título,
    // já que o backend ainda não expõe um parâmetro de busca textual nesse endpoint.
    async function buscarEExibirDemandas(termo) {
        if (demandasCache === null) {
            demandResultsContainer.innerHTML = '<p class="small text-muted p-2">Carregando demandas…</p>';
            try {
                const response = await apiRequest('/demandas');
                demandasCache = response.data || [];
            } catch (error) {
                demandasCache = [];
            }
        }

        const termoLower = termo.trim().toLowerCase();
        const demandas = termoLower
            ? demandasCache.filter(d => d.titulo.toLowerCase().includes(termoLower))
            : demandasCache;

        renderDemandResults(demandas);
    }

    function renderDemandResults(demandas) {
        if (demandas.length === 0) {
            demandResultsContainer.innerHTML = '<p class="small text-muted p-2">Nenhuma demanda encontrada.</p>';
            return;
        }

        demandResultsContainer.innerHTML = '';
        demandas.forEach(d => {
            const item = document.createElement('div');
            item.className = 'pl-demand-result-item';
            item.dataset.id = d.id;
            item.dataset.titulo = d.titulo;

            const title = document.createElement('span');
            title.className = 'pl-demand-title';
            title.textContent = d.titulo;

            const code = document.createElement('span');
            code.className = 'pl-demand-code';
            const icon = document.createElement('i');
            icon.className = 'bi bi-briefcase';
            code.appendChild(icon);
            code.appendChild(document.createTextNode(' #' + d.id));

            item.appendChild(title);
            item.appendChild(code);
            demandResultsContainer.appendChild(item);
        });
    }

    if (inputSearchDemand) {
        inputSearchDemand.addEventListener('input', function() {
            buscarEExibirDemandas(this.value);
        });
    }

    // Delegação de clique nos resultados de demanda (evita inline onclick com dados dinâmicos).
    demandResultsContainer.addEventListener('click', function(e) {
        const item = e.target.closest('.pl-demand-result-item');
        if (!item) return;
        selectDemand(Number(item.dataset.id), item.dataset.titulo);
    });

    // A carta virtual aceita apenas uma demanda vinculada — uma nova escolha substitui a anterior.
    window.selectDemand = function(id, titulo) {
        attachments = attachments.filter(a => a.type !== 'demand');
        attachments.push({ id: Date.now(), name: `#${id} - ${titulo}`, type: 'demand', demandaId: id });
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

    // Confirma como chip o que estiver digitado e ainda não commitado (Enter/vírgula).
    // Reaproveitado no envio, para o usuário não precisar saber que precisa apertar
    // Enter/vírgula antes de clicar em "Enviar".
    function commitPendingChip() {
        const email = chipInput.value.trim().replace(/,/g, '');
        if (email) { chips.push(email); renderChips(); chipInput.value = ''; }
    }

    chipInput.addEventListener('keydown', function(e) {
        if(e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commitPendingChip();
        }
    });

    chipWrapper.addEventListener('click', function(e) {
        if(e.target.closest('.pl-chip-remove')) {
            chips.splice(e.target.closest('.pl-chip-remove').dataset.index, 1);
            renderChips();
        } else { chipInput.focus(); }
    });

    if (btnSend) {
        btnSend.addEventListener('click', async function() {
            commitPendingChip();

            if (chips.length === 0) {
                if(window.prolinkToast) window.prolinkToast("Insira pelo menos um destinatário.", "error");
                return;
            }

            const titulo = document.getElementById('envioSubject').value.trim();
            if (!titulo) {
                if(window.prolinkToast) window.prolinkToast("Insira um título.", "error");
                return;
            }

            const originalText = btnSend.innerHTML;
            btnSend.innerHTML = '<i class="bi bi-hourglass-split" aria-hidden="true"></i> ENVIANDO…';
            btnSend.disabled = true;

            const legenda = editor.innerHTML;
            const arquivoAnexo = attachments.find(a => a.type === 'file');
            const demandaAnexo = attachments.find(a => a.type === 'demand');

            try {
                // Uma carta por destinatário — o modelo do backend suporta um único
                // destinatario_email por carta virtual (sem CC).
                let falhasEmail = 0;
                for (const email of chips) {
                    const formData = new FormData();
                    formData.append('titulo', titulo);
                    formData.append('legenda', legenda);
                    formData.append('destinatario_email', email);
                    if (demandaAnexo) formData.append('id_demanda', demandaAnexo.demandaId);
                    if (arquivoAnexo) formData.append('arquivo', arquivoAnexo.file);

                    // O backend cria a carta e tenta o envio real por e-mail (SMTP) nesta
                    // mesma chamada; email_enviado:false não é erro HTTP (a carta foi
                    // registrada), então precisa ser conferido aqui para não mentir no toast.
                    const resultado = await createCartaVirtual(formData);
                    if (resultado && resultado.email_enviado === false) falhasEmail++;
                }

                if (window.prolinkToast) {
                    if (falhasEmail === 0) {
                        window.prolinkToast(chips.length > 1 ? `${chips.length} cartas enviadas com sucesso!` : 'Carta enviada com sucesso!');
                    } else if (falhasEmail === chips.length) {
                        window.prolinkToast('Carta registrada, mas não foi possível enviar o e-mail. Tente novamente mais tarde.', 'error');
                    } else {
                        window.prolinkToast(`${chips.length - falhasEmail} de ${chips.length} cartas enviadas por e-mail. Algumas falharam — tente novamente.`, 'error');
                    }
                }
                if (typeof window.refreshCorreioList === 'function') window.refreshCorreioList();

                chips = []; renderChips();
                document.getElementById('envioSubject').value = '';
                editor.innerHTML = '';
                attachments = []; renderAttachments();
                document.dispatchEvent(new CustomEvent('prolink:close-mail-compose'));
            } catch (error) {
                if (window.prolinkToast) window.prolinkToast(error.message || 'Erro ao enviar carta.', 'error');
            } finally {
                btnSend.innerHTML = originalText;
                btnSend.disabled = false;
            }
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
