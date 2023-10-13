import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics, logEvent, setUserId } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyD4aPTKJ_dJ00fmil0DmX8tNNsEPsX_wNk",
  authDomain: "portfolio-3382d.firebaseapp.com",
  projectId: "portfolio-3382d",
  storageBucket: "portfolio-3382d.appspot.com",
  messagingSenderId: "953153377774",
  appId: "1:953153377774:web:e2858a932e5fb5f32caaff",
  measurementId: "G-HZFQ55RRW5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

window.addEventListener('load', () => {
  // getrandom user and provide analytics
  setUserId(analytics, generateRandomUserId());
  logEvent(analytics, 'load', {
    randomUserId: generateRandomUserId()
  });
});
logEvent(analytics, generateRandomUserId());


// Function to generate a random user ID
function generateRandomUserId() {
  // You can implement your own logic to generate a random user ID here
  // For simplicity, let's generate a random 10-character string
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let userId = '';
  for (let i = 0; i < 10; i++) {
    userId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return userId;
}
