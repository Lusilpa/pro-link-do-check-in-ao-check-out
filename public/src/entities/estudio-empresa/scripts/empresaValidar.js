(function () {
    const form = document.getElementById('formVerificacao');
    const btn = document.getElementById('btn-enviar-verificacao');
    const feedback = document.getElementById('verificacao-feedback');
    const statusInfo = document.getElementById('verificacao-status-info');

    const empresaId = localStorage.getItem('empresaId') || '1';

    setupUpload('upload-contrato-trigger', 'doc-contrato-social', 'contrato-label');
    setupUpload('upload-comprovante-trigger', 'doc-cnpj-comprovante', 'comprovante-label');

    function setupUpload(triggerId, inputId, labelId) {
        const trigger = document.getElementById(triggerId);
        const input = document.getElementById(inputId);
        const label = document.getElementById(labelId);
        if (trigger && input) {
            trigger.addEventListener('click', () => input.click());
            input.addEventListener('change', function () {
                if (this.files.length > 0) {
                    label.textContent = this.files[0].name;
                    label.style.color = '#00d278';
                }
            });
        }
    }

    function renderStatus(status, dataSolicitacao) {
        const map = {
            'NAO_SOLICITADA': { icon: 'bi-question-circle', color: 'rgba(255,255,255,0.6)', label: 'Não Solicitada', desc: 'Você ainda não solicitou a verificação.' },
            'PENDENTE': { icon: 'bi-clock-history', color: '#ffc107', label: 'Aguardando Análise', desc: 'Seu pedido foi enviado em ' + (dataSolicitacao || '—') + '. Prazo estimado: 5 dias úteis.' },
            'APROVADA': { icon: 'bi-patch-check-fill', color: '#00d278', label: 'Empresa Verificada ✓', desc: 'Seu selo está ativo. Seu perfil tem destaque nas buscas.' },
            'REJEITADA': { icon: 'bi-x-octagon', color: '#ff4d4d', label: 'Verificação Rejeitada', desc: 'Revise os documentos e tente novamente.' }
        };
        const s = map[status] || map['NAO_SOLICITADA'];
        
        if(statusInfo) {
            statusInfo.innerHTML =
                `<h5 style="color: ${s.color};"><i class="bi ${s.icon}"></i> ${s.label}</h5>` +
                `<p>${s.desc}</p>`;
        }

        if (status === 'APROVADA' || status === 'PENDENTE') {
            if(btn) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
            }
        }
    }

    async function loadStatusVerificacao() {
        try {
            const data = await apiRequest(`/empresa/validar/${empresaId}`, {
                method: 'GET'
            });
            renderStatus(data?.status || 'NAO_SOLICITADA', data?.data_solicitacao);
        } catch (error) {
            renderStatus('NAO_SOLICITADA');
        }
    }

    loadStatusVerificacao();

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const contrato = document.getElementById('doc-contrato-social');
        const comprovante = document.getElementById('doc-cnpj-comprovante');

        if (!contrato.files.length || !comprovante.files.length) {
            feedback.classList.remove('d-none');
            feedback.classList.add('pl-estudio-sub-alert--warning');
            feedback.innerHTML = '<i class="bi bi-exclamation-triangle"></i> <span>Selecione os dois documentos antes de enviar.</span>';
            return;
        }

        const formData = new FormData();
        formData.append('contrato_social', contrato.files[0]);
        formData.append('comprovante_cadastral', comprovante.files[0]);

        const originalBtnHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';

        try {
            await apiRequest('/empresa/validar', {
                method: 'POST',
                headers: {}, // Passar headers vazio para que o FormData injete o multipart/form-data corretamente e sobresscreva o BaseHeaders
                body: formData
            });

            // Sucesso
            btn.innerHTML = '<i class="bi bi-check-circle"></i> Documentos Enviados!';
            btn.style.color = '#00d278';
            btn.style.borderColor = '#00d278';
            
            renderStatus('PENDENTE', new Date().toLocaleDateString('pt-BR'));
            
            feedback.classList.remove('d-none', 'pl-estudio-sub-alert--warning');
            feedback.innerHTML = '<i class="bi bi-check-circle"></i> <span>Solicitação enviada. Acompanhe o status nesta tela.</span>';

        } catch (error) {
            console.error("Erro ao enviar documentos:", error);
            btn.disabled = false;
            btn.innerHTML = originalBtnHTML;
            
            feedback.classList.remove('d-none');
            feedback.classList.add('pl-estudio-sub-alert--warning');
            feedback.innerHTML = `<i class="bi bi-exclamation-triangle"></i> <span>Erro ao enviar arquivos: ${error.message}</span>`;
        }
    });
})();