// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCJydYe_net8fw2rwACZ988R2zXAx2QBi8',
  authDomain: 'stalker2-cards-counter.firebaseapp.com',
  projectId: 'stalker2-cards-counter',
  storageBucket: 'stalker2-cards-counter.firebasestorage.app',
  messagingSenderId: '1072978412441',
  appId: '1:1072978412441:web:941910793d906191244908',
  measurementId: 'G-B41PX98WVF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
