
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
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

analytics.logEvent('page_view', {
    page_name: 'home',
  });
  