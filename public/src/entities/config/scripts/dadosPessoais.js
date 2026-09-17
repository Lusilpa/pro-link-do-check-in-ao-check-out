(function initDadosPessoais() {
    // --------------------------------------------------
    // Referências dos Elementos do Formulário
    // --------------------------------------------------
    const fields = {
        nome: document.getElementById('cfg-nome'),
        sobrenome: document.getElementById('cfg-sobrenome'),
        email: document.getElementById('cfg-email'),
        telefone: document.getElementById('cfg-telefone'),
        cpf: document.getElementById('cfg-cpf'),
        cnpj: document.getElementById('cfg-cnpj'),
        estado: document.getElementById('cfg-estado'),
        cidade: document.getElementById('cfg-cidade'),
        titulo: document.getElementById('cfg-titulo'),
        registro: document.getElementById('cfg-registro'),
        resumo: document.getElementById('cfg-resumo'),
    };

    const btnSalvar = document.getElementById('btn-salvar-dados');
    if (!btnSalvar) {
        console.warn('[Config: Dados Pessoais] Botão #btn-salvar-dados não encontrado.');
        return;
    }

    function getTipoPerfil() {
        try {
            const userSession = JSON.parse(sessionStorage.getItem('prolink_user') || '{}');
            const tipo = userSession.tipoPerfil || userSession.profile_type || userSession.tipo || userSession.perfil;
            if (tipo) return tipo.toLowerCase();
            if (userSession.cnpj || userSession.tipoPessoa === 'JURIDICA') return 'empresa';
        } catch (e) {
            // falha silenciosa na leitura da sessão
        }

        // Se houver CNPJ preenchido ou visível, infere perfil empresa
        if (fields.cnpj?.value.trim()) {
            return 'empresa';
        }

        // Se houver registro do CREA/CAU preenchido, infere perfil profissional
        if (fields.registro?.value.trim()) {
            return 'profissional';
        }

        return 'comum';
    }

    // --------------------------------------------------
    // Derivação do Tipo de Pessoa a partir do Tipo de Perfil
    // Único dos dois que realmente viaja pro back.
    // --------------------------------------------------
    function getTipoPessoa(tipoPerfil) {
        return tipoPerfil === 'empresa' ? 'JURIDICA' : 'FISICA';
    }


    // --------------------------------------------------
    // Alternância de Visibilidade CPF vs CNPJ
    // --------------------------------------------------
    function ajustarVisibilidadeDocumento(tipoPerfil, data = {}) {
        const cpfGroup = document.getElementById('cfg-cpf-group');
        const cnpjGroup = document.getElementById('cfg-cnpj-group');

        // isEmpresa pode vir do tipoPerfil calculado agora no front,
        // ou do tipoPessoa que já veio salvo do back (ao carregar dados existentes)
        const isEmpresa = tipoPerfil === 'empresa' || data.tipoPessoa === 'JURIDICA';

        if (isEmpresa) {
            if (cpfGroup) cpfGroup.style.display = 'none';
            if (cnpjGroup) cnpjGroup.style.display = 'block';
        } else {
            if (cpfGroup) cpfGroup.style.display = 'block';
            if (cnpjGroup) cnpjGroup.style.display = 'none';
        }
    }

    // --------------------------------------------------
    // Controle de Estados do Botão (Feedback Visual)
    // --------------------------------------------------
    const originalBtnHtml = btnSalvar.innerHTML;

    function setButtonLoading(isLoading) {
        if (isLoading) {
            btnSalvar.disabled = true;
            btnSalvar.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Salvando...
            `;
        } else {
            btnSalvar.disabled = false;
            btnSalvar.innerHTML = originalBtnHtml;
        }
    }

    function setButtonSuccess() {
        btnSalvar.disabled = false;
        btnSalvar.innerHTML = '<i class="bi bi-check-circle-fill"></i> Salvo com Sucesso!';
        btnSalvar.style.backgroundColor = '#00d278';
        btnSalvar.style.borderColor = '#00d278';
        btnSalvar.style.color = '#ffffff';

        setTimeout(() => {
            btnSalvar.innerHTML = originalBtnHtml;
            btnSalvar.style.backgroundColor = '';
            btnSalvar.style.borderColor = '';
            btnSalvar.style.color = '';
        }, 2500);
    }

    function setButtonError(message) {
        btnSalvar.disabled = false;
        btnSalvar.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Erro ao salvar';
        btnSalvar.style.backgroundColor = '#ff4d4d';
        btnSalvar.style.borderColor = '#ff4d4d';
        btnSalvar.style.color = '#ffffff';

        alert(message || 'Ocorreu um erro ao salvar os dados. Verifique os campos e tente novamente.');

        setTimeout(() => {
            btnSalvar.innerHTML = originalBtnHtml;
            btnSalvar.style.backgroundColor = '';
            btnSalvar.style.borderColor = '';
            btnSalvar.style.color = '';
        }, 3000);
    }

    // --------------------------------------------------
    // Coleta e Higienização dos Dados
    // (não inclui tipoPerfil nem tipoPessoa — isso é decidido
    // à parte, no momento de salvar/carregar)
    // --------------------------------------------------
    function coletarDadosFormulario() {
        const nome = fields.nome?.value.trim() || '';
        const sobrenome = fields.sobrenome?.value.trim() || '';
        const cpf = fields.cpf?.value.trim() || '';
        const cnpj = fields.cnpj?.value.trim() || '';

        return {
            nome: nome,
            sobrenome: sobrenome,
            nomeCompleto: `${nome} ${sobrenome}`.trim(),
            email: fields.email?.value.trim() || '',
            telefone: fields.telefone?.value.trim() || '',
            cpf: cpf,
            cnpj: cnpj,
            // Campo de documento genérico para compatibilidade com o back
            document_number: cnpj || cpf,
            documento: cnpj || cpf,
            estado: fields.estado?.value || '',
            cidade: fields.cidade?.value.trim() || '',
            titulo_profissional: fields.titulo?.value.trim() || '',
            registro: fields.registro?.value.trim() || '',
            resumo_profissional: fields.resumo?.value.trim() || ''
        };
    }

    // --------------------------------------------------
    // Validação Básica no Front-end
    // --------------------------------------------------
    function validarDados(dados) {
        if (!dados.nome) {
            alert('Por favor, informe seu nome.');
            fields.nome?.focus();
            return false;
        }

        if (!dados.email) {
            alert('Por favor, informe seu e-mail.');
            fields.email?.focus();
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dados.email)) {
            alert('Por favor, informe um e-mail válido.');
            fields.email?.focus();
            return false;
        }

        return true;
    }

    // --------------------------------------------------
    // Handler do Botão Salvar
    // --------------------------------------------------
    async function handleSalvarDados() {
        const dados = coletarDadosFormulario();

        if (!validarDados(dados)) {
            return;
        }

        setButtonLoading(true);

        try {
            const tipoPerfil = getTipoPerfil();           // decide só a ROTA
            const tp = getTipoPessoa(tipoPerfil);
            dados.tipoPessoa = tp;
            dados.tipo_pessoa = tp;

            // Chama a API que encaminhará para o endpoint correspondente
            const result = await salvarDadosPessoais(dados, tipoPerfil);

            if (result && result.success) {
                // Atualiza sessão local se nome ou e-mail mudaram
                try {
                    const userSession = JSON.parse(sessionStorage.getItem('prolink_user') || '{}');
                    userSession.nome = dados.nomeCompleto;
                    userSession.email = dados.email;
                    userSession.tipoPessoa = dados.tipoPessoa;
                    sessionStorage.setItem('prolink_user', JSON.stringify(userSession));
                } catch (e) {
                    console.error('[Config] Erro ao sincronizar sessionStorage:', e);
                }

                setButtonSuccess();
            } else {
                const errorMsg = result?.message || 'Não foi possível salvar as alterações.';
                setButtonError(errorMsg);
            }
        } catch (error) {
            console.error('[Config] Erro ao disparar requisição de salvar:', error);
            setButtonError(error.message);
        } finally {
            if (btnSalvar.innerHTML.includes('Salvando...')) {
                setButtonLoading(false);
            }
        }
    }

    // --------------------------------------------------
    // Pré-carregamento dos Dados Existentes
    // --------------------------------------------------
    async function carregarDadosIniciais() {
        // Tenta buscar os dados direto do back-end
        const result = await carregarDadosPessoais();
        if (result.success && result.data) {
            // Se o back respondeu, usa os dados do banco
            preencherFormulario(result.data);
        } else {
            // Fallback: se a API falhar, preenche com o que estiver na sessionStorage local
            const userSession = JSON.parse(sessionStorage.getItem('prolink_user') || '{}');
            preencherFormulario(userSession);
        }
    }

    function preencherFormulario(data) {
        if (!data) return;
        const tipoPerfil = getTipoPerfil();

        if (fields.email && data.usuario.email) {
            fields.email.value = data.usuario.email;
        }
        if (fields.telefone && data.usuario.telefone) {
            fields.telefone.value = data.usuario.telefone;
        }
        if (fields.cpf && data.usuario.cpf) {
            fields.cpf.value = data.usuario.cpf;
        }
        if (fields.cnpj && data.empresa.cnpj) {
            fields.cnpj.value = data.empresa.cnpj;
        }
        if (fields.estado && data.usuario.estado) {
            fields.estado.value = data.usuario.estado; // seleciona a option do <select>
        }
        if (fields.cidade && data.usuario.cidade) {
            fields.cidade.value = data.usuario.cidade;
        }

        if (fields.titulo && data.profissional.categoria_profissional) {
            fields.titulo.value = data.profissional.categoria_profissional;
        }
        if (fields.registro && data.profissional.numero_registro_confrea_crea) {
            fields.registro.value = data.profissional.numero_registro_confrea_crea;
        }

        if (fields.resumo && data.portfolio.resumo_profissional) {
            fields.resumo.value = data.portfolio.resumo_profissional;
        }
        // Nome e sobrenome: apenas preenche se já houver um sobrenome salvo
        // if (data.sobrenome) {
        //     if (fields.nome) fields.nome.value = data.nome || '';
        //     if (fields.sobrenome) fields.sobrenome.value = data.sobrenome;
        // }

        if (fields.nome && data.usuario.nome) {
            fields.nome.value = data.usuario.nome;
        }

    }

    // --------------------------------------------------
    // Event Listeners
    // --------------------------------------------------
    btnSalvar.addEventListener('click', handleSalvarDados);

    carregarDadosIniciais();
})();