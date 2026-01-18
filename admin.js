import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBQlkviaNN4g7-2KEcSPogZFyz4ejTX98",
  authDomain: "mensaje-anonimo-be30f.firebaseapp.com",
  projectId: "mensaje-anonimo-be30f",
  storageBucket: "mensaje-anonimo-be30f.firebasestorage.app",
  messagingSenderId: "786730261416",
  appId: "1:786730261416:web:7eb563bbe4c2d29a8ddb9d"
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