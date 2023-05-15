import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0o4Uq7TRjSO2oPdn0qUQ2wRb9Xav_hzw",
  authDomain: "callmi-b1821.firebaseapp.com",
  projectId: "callmi-b1821",
  storageBucket: "callmi-b1821.appspot.com",
  messagingSenderId: "272923750975",
  appId: "1:272923750975:web:ed37f939eafe23c8eefe8a"
};


firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
console.log(db)