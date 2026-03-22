// Alternar entre abas
function openTab(tabName) {
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("registerForm").classList.remove("active");
  document.getElementById("loginTabBtn").classList.remove("active");
  document.getElementById("registerTabBtn").classList.remove("active");

  if (tabName === "login") {
    document.getElementById("loginForm").classList.add("active");
    document.getElementById("loginTabBtn").classList.add("active");
  } else {
    document.getElementById("registerForm").classList.add("active");
    document.getElementById("registerTabBtn").classList.add("active");
  }
}

// Cadastrar usuário
function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regConfirmPassword").value;
  const error = document.getElementById("registerError");

  error.style.display = "none";

  if (!email || !password) {
    showError("registerError", "Preencha todos os campos.");
    return;
  }

  if (password !== confirm) {
    showError("registerError", "As senhas não coincidem.");
    return;
  }

  if (password.length < 6) {
    showError("registerError", "A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      showMessage("✅ Conta criada! Redirecionando...");
      setTimeout(() => {
        window.location.href = "vault.html";
      }, 1500);
    })
    .catch(err => {
      showError("registerError", err.message);
    });
}

// Fazer login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const error = document.getElementById("loginError");

  error.style.display = "none";

  if (!email || !password) {
    showError("loginError", "Preencha todos os campos.");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "vault.html";
    })
    .catch(err => {
      let msg = err.message;

      // Mensagens amigáveis
      if (msg.includes("user-not-found")) msg = "Usuário não encontrado.";
      else if (msg.includes("wrong-password")) msg = "Senha incorreta.";
      else if (msg.includes("invalid-email")) msg = "Email inválido.";

      showError("loginError", msg);
    });
}

// Mostrar erro
function showError(id, text) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.style.display = "block";
}

// Mostrar mensagem temporária
function showMessage(text) {
  const toast = document.createElement("div");
  toast.textContent = text;
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: #2ecc71; color: white;
    padding: 12px 16px; border-radius: 6px; z-index: 1000; opacity: 1;
    transition: opacity 0.5s;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 3000);
}

// Verifica autenticação ao carregar
window.onload = function () {
  // Verifica se estamos em vault.html
  const isVault = window.location.pathname.includes("vault.html");

  auth.onAuthStateChanged(user => {
    if (isVault && !user) {
      // Se tentou acessar o cofre sem login
      window.location.href = "index.html";
    } else if (isVault && user) {
      // Usuário logado → tudo certo
      window.currentUser = user;
    }
    // Em index.html, não faz nada
  });

  // Abre aba de login por padrão
  if (document.getElementById("loginForm")) {
    openTab("login");
  }
};