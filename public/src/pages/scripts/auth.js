document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const usernameInput = document.getElementById("username").value.trim();
      const passwordInput = document.getElementById("password").value;
      const rememberMe = document.getElementById("rememberMe").checked;

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Feedback visual de carregamento
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Autenticando...`;
      submitBtn.disabled = true;

      const credentials = {
        username: usernameInput,
        password: passwordInput,
        remember: rememberMe
      };

      // --- MODO HÍBRIDO (Comente quando o back-end estiver rodando) ---
      /*
      setTimeout(() => {
        window.location.hash = "#feed";
      }, 800);
      return;
      */

      // Chamada da função centralizada em shared/api/auth.js
      const result = await loginUser(credentials);

      if (result.success) {
        window.location.hash = "#feed";
      } else {
        // [SEGURANÇA H3 CORRIGIDO] Nunca exibir result.message do servidor para o usuário.
        // Mensagens internas do back-end (ex: SQL errors) ficam no console, não no alert.
        console.warn('[Auth] Falha no login:', result.message);
        alert("E-mail ou senha inválidos. Tente novamente.");
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }

  // Evento para o botão de Login Social via Google (Gmail)
  const googleBtn = document.querySelector(".btn-gmail");
  if (googleBtn) {
    googleBtn.addEventListener("click", function () {
      loginWithGoogle();
    });
  }

  // Evento para o botão de Login Social via LinkedIn
  const linkedinBtn = document.querySelector(".btn-linkedin");
  if (linkedinBtn) {
    linkedinBtn.addEventListener("click", function () {
      loginWithLinkedIn();
    });
  }
});