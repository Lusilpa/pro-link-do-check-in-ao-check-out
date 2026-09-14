document.addEventListener("DOMContentLoaded", function () {
  const recoverForm = document.getElementById("recoverForm");

  if (recoverForm) {
    recoverForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const emailInput = document.getElementById("recoverEmail").value.trim();
      const submitBtn = recoverForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      // Feedback visual de carregamento
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Enviando...`;
      submitBtn.disabled = true;

      // Chamada conectada ao serviço de API (shared/api/auth.js)
      const result = await recoverPassword(emailInput);

      if (result.success) {
        alert("Link de recuperação enviado com sucesso! Verifique sua caixa de entrada.");
        window.location.hash = "#auth";
      } else {
        alert("Erro: " + result.message);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});