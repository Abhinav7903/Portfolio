import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics, logEvent, setUserId } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getFirestore, collection, getDocs,addDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

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

window.addEventListener('load', async () => {
  try {
    // check if user ID is already stored in local storage delete it
    let userId = localStorage.getItem('userId');
    if (userId) {
      localStorage.removeItem('userId');
      // console.log('Removed user ID from localStorage: ' + userId);
    }
    

    if (!userId) {
      // If not, generate a new user ID
      userId = generateRandomUserId();
      // console.log('Generated new user ID: ' + userId);
      // on window close, the stored user ID will be removed
      localStorage.setItem('userId', userId);
      // console.log('Stored user ID in localStorage: ' + userId);
      window.addEventListener('beforeunload', () => {
        localStorage.removeItem('userId');
        // console.log('Removed user ID from localStorage: ' + userId);
      });
      // Log the analytics event with the generated user ID
      logEvent(analytics, 'load', {
        randomUserId: userId
      });

      // Store the generated user ID in the database with the current timestamp
      const db = getFirestore(app);

      const timestamp = new Date().toISOString(); // Use ISO string for consistency
      const docRef = await addDoc(collection(db, "users"), {
        userId: userId,
        timestamp: timestamp
      });

      // console.log('User ID and timestamp added to Firestore:', docRef.id);
    }
  } catch (error) {
    // console.error('Error during user ID generation and Firestore operation:', error);
  }
});

// Function to generate a random user ID
function generateRandomUserId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let userId = '';
  for (let i = 0; i < 10; i++) {
    userId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return userId;
}
