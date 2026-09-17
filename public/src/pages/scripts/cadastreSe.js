(function initCadastro() {
    const profileTypeSelect = document.getElementById("profileType");
    const registerForm = document.getElementById("registerForm");

    function adjustFormFields() {
        const profileType = profileTypeSelect ? profileTypeSelect.value : "";
        const labelName = document.getElementById("labelName");
        const fullNameInput = document.getElementById("fullName");
        const labelDocument = document.getElementById("labelDocument");
        const docInput = document.getElementById("documentNumber");
        const iconDocument = document.getElementById("iconDocument");
        const creaGroup = document.getElementById("creaGroup");
        const creaInput = document.getElementById("creaRecord");             // name="numero_registro_confea_crea"
        const categoriaProfissional = document.getElementById("categoriaProfissional"); // name="categoria_profissional"
        const grauAcademico = document.getElementById("grauAcademico");      // name="grau_academico"
        const studentFields = document.getElementById("studentFields");
        const studentModality = document.getElementById("studentModality");  // name="curso"
        const institutionEnsino = document.getElementById("institutionEnsino"); // name="universidade_id" (FK → universidades)
        const studentRA = document.getElementById("studentRA");              // name="matricula"
        const empresaFields = document.getElementById("empresaFields");

        // Reseta padrões
        if (labelName) labelName.innerText = "Nome completo";
        if (fullNameInput) fullNameInput.placeholder = "Digite seu nome completo";
        if (labelDocument) labelDocument.innerText = "CPF";
        if (docInput) docInput.placeholder = "000.000.000-00";
        if (iconDocument) iconDocument.innerHTML = '<i class="bi bi-file-earmark-person"></i>';

        // Oculta todos os blocos condicionais
        if (creaGroup) creaGroup.style.display = "none";
        if (creaInput) creaInput.removeAttribute("required");
        if (categoriaProfissional) categoriaProfissional.removeAttribute("required");
        if (grauAcademico) grauAcademico.removeAttribute("required");
        if (studentFields) studentFields.style.display = "none";
        if (studentModality) studentModality.removeAttribute("required");
        if (institutionEnsino) institutionEnsino.removeAttribute("required");
        if (studentRA) studentRA.removeAttribute("required");
        if (empresaFields) empresaFields.style.display = "none";

        if (profileType === "empresa") {
            if (labelName) labelName.innerText = "Razão Social";
            if (fullNameInput) fullNameInput.placeholder = "Digite a razão social da empresa / Nome institucional";
            if (labelDocument) labelDocument.innerText = "CNPJ";
            if (docInput) docInput.placeholder = "00.000.000/0000-00";
            if (iconDocument) iconDocument.innerHTML = '<i class="bi bi-building"></i>';
            if (empresaFields) empresaFields.style.display = "block";
        } else if (profileType === "profissional") {
            if (creaGroup) creaGroup.style.display = "block";
            if (creaInput) creaInput.setAttribute("required", "required");
            if (categoriaProfissional) categoriaProfissional.setAttribute("required", "required");
            if (grauAcademico) grauAcademico.setAttribute("required", "required");
        } else if (profileType === "universitario") {
            if (studentFields) studentFields.style.display = "block";
            if (studentModality) studentModality.setAttribute("required", "required");
            if (institutionEnsino) institutionEnsino.setAttribute("required", "required");
            if (studentRA) studentRA.setAttribute("required", "required");
        }
    }

    if (profileTypeSelect) {
        profileTypeSelect.addEventListener("change", adjustFormFields);
        adjustFormFields();
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("As senhas não coincidem. Por favor, verifique.");
                return;
            }

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Cadastrando...';
            submitBtn.disabled = true;

            const formData = new FormData(registerForm);

            // Requer que a função global registerUser já esteja declarada no projeto (ex: auth.js)
            const result = await window.registerUser(formData);

            if (result.success) {
                alert("Conta criada com sucesso! Redirecionando para o login...");
                window.location.hash = "#auth";
            } else {
                alert("Erro ao cadastrar: " + result.message);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
})();