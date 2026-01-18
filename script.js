import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

async function getDetailedDeviceInfo() {
  const ua = navigator.userAgent;
  let model = "No detectado";
  let platformInfo = "Desconocido";
  try {
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
      const hints = await navigator.userAgentData.getHighEntropyValues(['model', 'platformVersion']);
      model = hints.model || "";
      platformInfo = `${navigator.userAgentData.platform} ${hints.platformVersion || ""}`;
    }
  } catch (e) {
    console.error("Error en dispositivo:", e);
  }
  if (!model || model === "No detectado") {
    if (/iphone|ipad|ipod/i.test(ua)) { model = "iPhone/iPad"; platformInfo = "iOS"; }
    else if (/android/i.test(ua)) { model = "Android"; platformInfo = "Android"; }
    else { model = navigator.platform; platformInfo = "Desktop PC"; }
  }
  return { modelo_exacto: model, sistema: platformInfo };
}

const form = document.getElementById('messageForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.querySelector('.btn-submit');
  const messageInput = document.getElementById('message');
  
  if (!messageInput.value.trim()) return;

  btn.disabled = true;
  btn.innerText = "Enviando...";

  try {
    const info = await getDetailedDeviceInfo();
    await addDoc(collection(db, "mensajes"), {
      mensaje: messageInput.value,
      dispositivo: info.modelo_exacto,
      sistema: info.sistema,
      timestamp: serverTimestamp()
    });
    messageInput.value = "";
    btn.innerText = "¡Enviado!";
    setTimeout(() => {
      btn.disabled = false;
      btn.innerText = "¡Enviar mensaje!";
    }, 2500);
  } catch (error) {
    console.error("Error Firebase:", error);
    btn.innerText = "Error";
    btn.disabled = false;
  }
});