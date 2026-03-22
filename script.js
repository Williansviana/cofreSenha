let editingId = null;

window.onload = function () {
  // Observador de Autenticação: Protege a página
  auth.onAuthStateChanged(user => {
    if (user) {
      const emailDisplay = document.getElementById("userEmail");
      if (emailDisplay) emailDisplay.textContent = user.email;
      loadPasswords(); 
    } else {
      // Se não estiver logado e tentar acessar o vault, volta para o index
      if (window.location.pathname.includes("vault.html")) {
        window.location.href = "index.html";
      }
    }
  });

  // Configuração dos botões
  const btnAdd = document.getElementById("addButton");
  if (btnAdd) btnAdd.onclick = addItem;

  const btnSave = document.getElementById("saveEditButton");
  if (btnSave) btnSave.onclick = saveEdit;

  const btnCancel = document.getElementById("cancelEditButton");
  if (btnCancel) btnCancel.onclick = cancelEdit;
};

// Carregar dados em tempo real do Firestore
function loadPasswords() {
  const user = auth.currentUser;
  const list = document.getElementById("passwordList");
  if (!user || !list) return;

  db.collection("users").doc(user.uid).collection("passwords")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      list.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${escapeHtml(data.site)}</strong><br>
          Login: ${escapeHtml(data.login)} | Senha: ${escapeHtml(data.senha)}
          <div style="margin-top: 8px;">
            <button class="action-btn edit-btn" onclick="startEdit('${doc.id}', '${data.site}', '${data.login}', '${data.senha}')">Editar</button>
            <button class="action-btn delete-btn" onclick="deleteItem('${doc.id}')">Excluir</button>
          </div>
        `;
        list.appendChild(li);
      });
      if (snapshot.empty) list.innerHTML = "<li>Nenhuma senha salva.</li>";
    });
}

// Salvar novo item
function addItem() {
  const site = document.getElementById("site").value.trim();
  const login = document.getElementById("login").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const user = auth.currentUser;

  if (!site || !login || !senha) return alert("Preencha todos os campos!");

  db.collection("users").doc(user.uid).collection("passwords").add({
    site, login, senha, createdAt: new Date()
  }).then(() => {
    clearForm();
    showMessage("✅ Salvo com sucesso!");
  }).catch(err => alert("Erro ao salvar: " + err.message));
}

// Iniciar Edição
function startEdit(id, site, login, senha) {
  editingId = id;
  document.getElementById("site").value = site;
  document.getElementById("login").value = login;
  document.getElementById("senha").value = senha;

  document.getElementById("addButton").classList.add("hidden");
  document.getElementById("saveEditButton").classList.remove("hidden");
  document.getElementById("cancelEditButton").classList.remove("hidden");
}

// Salvar Edição
function saveEdit() {
  const user = auth.currentUser;
  if (!editingId || !user) return;

  db.collection("users").doc(user.uid).collection("passwords").doc(editingId).update({
    site: document.getElementById("site").value,
    login: document.getElementById("login").value,
    senha: document.getElementById("senha").value,
    updatedAt: new Date()
  }).then(() => {
    clearForm();
    showMessage("✅ Atualizado!");
  });
}

function deleteItem(id) {
  if (confirm("Deseja realmente excluir este item?")) {
    db.collection("users").doc(auth.currentUser.uid).collection("passwords").doc(id).delete();
  }
}

function cancelEdit() { clearForm(); }

function clearForm() {
  document.getElementById("site").value = "";
  document.getElementById("login").value = "";
  document.getElementById("senha").value = "";
  editingId = null;
  document.getElementById("addButton").classList.remove("hidden");
  document.getElementById("saveEditButton").classList.add("hidden");
  document.getElementById("cancelEditButton").classList.add("hidden");
}

function logout() {
  auth.signOut().then(() => window.location.href = "index.html");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showMessage(text) {
  const toast = document.createElement("div");
  toast.textContent = text;
  toast.style.cssText = `position: fixed; top: 20px; right: 20px; background: #2ecc71; color: white; padding: 12px 16px; border-radius: 6px; z-index: 1000;`;
  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 3000);
}