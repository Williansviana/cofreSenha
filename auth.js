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

function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regConfirmPassword").value;
  const error = document.getElementById("registerError");

  error.style.display = "none";
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
    })
    .catch(err => {
      showError("registerError", err.message);
    });
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const error = document.getElementById("loginError");

  error.style.display = "none";

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "vault.html";
    })
    .catch(err => {
      showError("loginError", err.message);
    });
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = "block";
}

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

window.onload = function () {
  auth.onAuthStateChanged(user => {
    const isVault = window.location.pathname.includes("vault.html");
    if (user && isVault) {
      window.currentUser = user;
    } else if (!user && isVault) {
      window.location.href = "index.html";
    }
  });

  if (document.getElementById("loginForm")) {
    openTab("login");
  }
};