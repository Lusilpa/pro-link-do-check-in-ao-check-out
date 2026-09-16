(function () {
    var form = document.getElementById('formVerificacao');
    var btn = document.getElementById('btn-enviar-verificacao');
    var feedback = document.getElementById('verificacao-feedback');
    var statusInfo = document.getElementById('verificacao-status-info');

    // Upload triggers — mostram nome do arquivo selecionado
    setupUpload('upload-contrato-trigger', 'doc-contrato-social', 'contrato-label');
    setupUpload('upload-comprovante-trigger', 'doc-cnpj-comprovante', 'comprovante-label');

    function setupUpload(triggerId, inputId, labelId) {
        var trigger = document.getElementById(triggerId);
        var input = document.getElementById(inputId);
        var label = document.getElementById(labelId);
        if (trigger && input) {
            trigger.addEventListener('click', function () { input.click(); });
            input.addEventListener('change', function () {
                if (this.files.length > 0) {
                    label.textContent = this.files[0].name;
                    label.style.color = '#00d278';
                }
            });
        }
    }

    /**
     * Atualiza o card de status visual.
     * @param {'NAO_SOLICITADA'|'PENDENTE'|'APROVADA'|'REJEITADA'} status
     * @param {string|null} dataSolicitacao
     */
    function renderStatus(status, dataSolicitacao) {
        var map = {
            'NAO_SOLICITADA': { icon: 'bi-question-circle', color: 'rgba(255,255,255,0.6)', label: 'Não Solicitada', desc: 'Você ainda não solicitou a verificação.' },
            'PENDENTE': { icon: 'bi-clock-history', color: '#ffc107', label: 'Aguardando Análise', desc: 'Seu pedido foi enviado em ' + (dataSolicitacao || '—') + '. Prazo estimado: 5 dias úteis.' },
            'APROVADA': { icon: 'bi-patch-check-fill', color: '#00d278', label: 'Empresa Verificada ✓', desc: 'Seu selo está ativo. Seu perfil tem destaque nas buscas.' },
            'REJEITADA': { icon: 'bi-x-octagon', color: '#ff4d4d', label: 'Verificação Rejeitada', desc: 'Revise os documentos e tente novamente.' }
        };
        var s = map[status] || map['NAO_SOLICITADA'];
        statusInfo.innerHTML =
            '<h5 style="color: ' + s.color + ';"><i class="bi ' + s.icon + '"></i> ' + s.label + '</h5>' +
            '<p>' + s.desc + '</p>';

        // Se já aprovada ou pendente, desabilita o formulário
        if (status === 'APROVADA' || status === 'PENDENTE') {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        }
    }

    // TODO: Carregar status ao abrir a página
    // fetch('/api/verificacao-empresa/' + empresaId, {
    //   headers: { 'Authorization': 'Bearer ' + token }
    // })
    // .then(res => res.json())
    // .then(data => { renderStatus(data.status, data.data_solicitacao); })
    // .catch(() => { renderStatus('NAO_SOLICITADA'); });

    // Simulação temporária
    setTimeout(function () { renderStatus('NAO_SOLICITADA'); }, 500);

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var contrato = document.getElementById('doc-contrato-social');
        var comprovante = document.getElementById('doc-cnpj-comprovante');

        if (!contrato.files.length || !comprovante.files.length) {
            feedback.classList.remove('d-none');
            feedback.classList.add('pl-estudio-sub-alert--warning');
            feedback.innerHTML = '<i class="bi bi-exclamation-triangle"></i> <span>Selecione os dois documentos antes de enviar.</span>';
            return;
        }

        var formData = new FormData();
        formData.append('contrato_social', contrato.files[0]);
        formData.append('comprovante_cadastral', comprovante.files[0]);

        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';

        // TODO: Substituir pelo fetch real
        // fetch('/api/verificacao-empresa', {
        //   method: 'POST',
        //   headers: { 'Authorization': 'Bearer ' + token },
        //   body: formData
        // })
        // .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
        // .then(() => { onSuccess(); })
        // .catch(err => { onError(err.message); });

        // Simulação temporária
        setTimeout(function () { onSuccess(); }, 800);

        function onSuccess() {
            btn.innerHTML = '<i class="bi bi-check-circle"></i> Documentos Enviados!';
            btn.style.color = '#00d278';
            btn.style.borderColor = '#00d278';
            renderStatus('PENDENTE', new Date().toLocaleDateString('pt-BR'));
            feedback.classList.remove('d-none', 'pl-estudio-sub-alert--warning');
            feedback.innerHTML = '<i class="bi bi-check-circle"></i> <span>Solicitação enviada. Acompanhe o status nesta tela.</span>';
        }

        function onError(msg) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-send"></i> Enviar para Verificação';
            feedback.classList.remove('d-none');
            feedback.classList.add('pl-estudio-sub-alert--warning');
            feedback.innerHTML = '<i class="bi bi-exclamation-triangle"></i> <span>Erro: ' + msg + '</span>';
        }
    });
})();