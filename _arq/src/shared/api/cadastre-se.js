document.addEventListener("DOMContentLoaded", function () {
  const profileTypeSelect = document.getElementById("profileType");
  const registerForm = document.getElementById("registerForm");

  // Função para exibir ou ocultar os campos específicos de acordo com o tipo de conta
  function adjustFormFields() {
    const profileType = profileTypeSelect.value;
    const labelName = document.getElementById("labelName");
    const fullNameInput = document.getElementById("fullName");
    const labelDocument = document.getElementById("labelDocument");
    const docInput = document.getElementById("documentNumber");
    const iconDocument = document.getElementById("iconDocument");

    // Blocos condicionais
    const creaGroup = document.getElementById("creaGroup");
    const creaInput = document.getElementById("creaRecord");
    const categoriaProfissional = document.getElementById("categoriaProfissional");
    const grauAcademico = document.getElementById("grauAcademico");

    const studentFields = document.getElementById("studentFields");
    const studentModality = document.getElementById("studentModality");
    const institutionEnsino = document.getElementById("institutionEnsino");
    const studentRA = document.getElementById("studentRA");

    const empresaFields = document.getElementById("empresaFields");

    // Reseta padrões básicos (Público Geral / Terceiros)
    labelName.innerText = "Nome completo";
    fullNameInput.placeholder = "Digite seu nome completo";
    labelDocument.innerText = "CPF";
    docInput.placeholder = "000.000.000-00";
    iconDocument.innerHTML = '<i class="bi bi-file-earmark-person"></i>';

    // Oculta todos os blocos condicionais e remove validações obrigatórias por padrão
    creaGroup.style.display = "none";
    if (creaInput) creaInput.removeAttribute("required");
    if (categoriaProfissional) categoriaProfissional.removeAttribute("required");
    if (grauAcademico) grauAcademico.removeAttribute("required");

    studentFields.style.display = "none";
    if (studentModality) studentModality.removeAttribute("required");
    if (institutionEnsino) institutionEnsino.removeAttribute("required");
    if (studentRA) studentRA.removeAttribute("required");

    if (empresaFields) empresaFields.style.display = "none";

    // Ativa os campos específicos baseados na escolha do usuário
    if (profileType === "empresa") {
      labelName.innerText = "Razão Social";
      fullNameInput.placeholder = "Digite a razão social da empresa / Nome institucional";
      labelDocument.innerText = "CNPJ";
      docInput.placeholder = "00.000.000/0000-00";
      iconDocument.innerHTML = '<i class="bi bi-building"></i>';
      if (empresaFields) empresaFields.style.display = "block";
    } else if (profileType === "profissional") {
      creaGroup.style.display = "block";
      if (creaInput) creaInput.setAttribute("required", "required");
      if (categoriaProfissional) categoriaProfissional.setAttribute("required", "required");
      if (grauAcademico) grauAcademico.setAttribute("required", "required");
    } else if (profileType === "universitario") {
      studentFields.style.display = "block";
      if (studentModality) studentModality.setAttribute("required", "required");
      if (institutionEnsino) institutionEnsino.setAttribute("required", "required");
      if (studentRA) studentRA.setAttribute("required", "required");
    }
  }

  if (profileTypeSelect) {
    profileTypeSelect.addEventListener("change", adjustFormFields);
    adjustFormFields();
  }

  // Manipulação do submit do formulário de cadastro
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
      
      // Feedback visual de carregamento
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Cadastrando...`;
      submitBtn.disabled = true;

      // Empacota todos os campos e arquivos em um objeto FormData para envio multipart
      const formData = new FormData(registerForm);

      // Chama a função centralizada no serviço de API global (shared/api/auth.js)
      const result = await registerUser(formData);

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
});