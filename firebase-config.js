// 🔥 Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAvO11jgajqUl-Zh0vxsDyO5BLf9CWBMiA",
  authDomain: "cofre-de-senhas-2d1ed.firebaseapp.com",
  projectId: "cofre-de-senhas-2d1ed",
  storageBucket: "cofre-de-senhas-2d1ed.firebasestorage.app",
  messagingSenderId: "613308643736",
  appId: "1:613308643736:web:ef14ba16dd70f92b0493ed"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Serviços
const auth = firebase.auth();
const db = firebase.firestore();