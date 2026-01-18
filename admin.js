import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// NUEVA CONFIGURACIÓN PARA: mensajes-anonimos-bryan
const firebaseConfig = {
  apiKey: "AIzaSyA-3Igz0KeLHk0nZ3qYe9_xru9axWaKm4U",
  authDomain: "mensajes-anonimos-bryan.firebaseapp.com",
  projectId: "mensajes-anonimos-bryan",
  storageBucket: "mensajes-anonimos-bryan.firebasestorage.app",
  messagingSenderId: "706342485498",
  appId: "1:706342485498:web:ee62b06dfb98ef8b123843"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const messagesList = document.getElementById('messagesList');
const modal = document.getElementById('modal');

const q = query(collection(db, "mensajes"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
  messagesList.innerHTML = "";
  
  if (snapshot.empty) {
    messagesList.innerHTML = "<p style='text-align:center; padding: 20px; color: #999;'>No hay mensajes aún.</p>";
    return;
  }

  snapshot.forEach((documento) => {
    const data = documento.data();
    const fechaCorta = data.timestamp?.toDate().toLocaleDateString('es-ES') || "Hoy";
    const fechaCompleta = data.timestamp?.toDate().toLocaleString('es-ES') || "---";

    const item = document.createElement('div');
    item.className = 'message-item';
    item.innerHTML = `
      <div class="msg-content">${data.mensaje}</div>
      <div class="msg-time">${fechaCorta}</div>
    `;

    item.onclick = () => {
      document.getElementById('modal-text').innerText = data.mensaje;
      document.getElementById('info-sistema').innerText = data.sistema || 'No detectado';
      document.getElementById('info-modelo').innerText = data.dispositivo || 'Desconocido';
      document.getElementById('info-fecha').innerText = fechaCompleta;
      modal.style.display = 'flex';
    };

    messagesList.appendChild(item);
  });
});
