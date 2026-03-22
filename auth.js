// Alternar entre abas de Login e Cadastro
function openTab(tabName) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginBtn = document.getElementById("loginTabBtn");
  const registerBtn = document.getElementById("registerTabBtn");

  if (!loginForm || !registerForm) return;

  loginForm.classList.remove("active");
  registerForm.classList.remove("active");
  loginBtn.classList.remove("active");
  registerBtn.classList.remove("active");

  if (tabName === "login") {
    loginForm.classList.add("active");
    loginBtn.classList.add("active");
  } else {
    registerForm.classList.add("active");
    registerBtn.classList.add("active");
  }
}

// Criar nova conta
function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regConfirmPassword").value;

  if (password !== confirm) {
    showError("registerError", "As senhas não coincidem.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      showMessage("✅ Conta criada! Entrando...");
      setTimeout(() => window.location.href = "vault.html", 1500);
    })
    .catch(err => showError("registerError", err.message));
}

// Entrar no cofre
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "vault.html";
    })
    .catch(err => showError("loginError", "Usuário ou senha inválidos."));
}

function showError(id, text) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text;
    el.style.display = "block";
  }
}

function showMessage(text) {
  const toast = document.createElement("div");
  toast.textContent = text;
  toast.style.cssText = `position: fixed; top: 20px; right: 20px; background: #2ecc71; color: white; padding: 12px 16px; border-radius: 6px; z-index: 1000;`;
  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 3000);
}