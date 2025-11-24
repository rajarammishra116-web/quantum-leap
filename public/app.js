
// Quantum Leap - frontend JS (lightweight)
// This file exposes functions to save content to Firebase Firestore if configured.
// To enable Firebase: include firebase SDK and call initFirebase(config) with your firebase config object.

const Q = {
  firebaseEnabled: false,
  db: null
}

function initFirebase(config) {
  if (!config) return console.warn('Firebase config not provided.');
  // Load firebase scripts dynamically
  const script1 = document.createElement('script');
  script1.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js';
  document.head.appendChild(script1);
  const script2 = document.createElement('script');
  script2.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js';
  document.head.appendChild(script2);
  script2.onload = () => {
    const app = firebase.initializeApp(config);
    Q.db = firebase.firestore();
    Q.firebaseEnabled = true;
    console.log('Firebase initialized for Quantum Leap.');
  }
}

async function saveContent(collection, doc) {
  if (Q.firebaseEnabled && Q.db) {
    return Q.db.collection(collection).add(doc);
  } else {
    // fallback to localStorage (prototype)
    const key = 'quantum_leap_' + collection;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(doc);
    localStorage.setItem(key, JSON.stringify(existing));
    return Promise.resolve({ ok: true, local: true });
  }
}

async function fetchContent(collection) {
  if (Q.firebaseEnabled && Q.db) {
    const snapshot = await Q.db.collection(collection).get();
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } else {
    const key = 'quantum_leap_' + collection;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
}
