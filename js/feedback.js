import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const form = document.getElementById('feedbackForm');
const feedbackContainer = document.getElementById('feedbackContainer');

async function loadFeedbacks() {
  const q = query(collection(db, "feedbacks"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  feedbackContainer.innerHTML = '';
  snapshot.forEach(doc => {
    const fb = doc.data();
    const div = document.createElement('div');
    div.classList.add('feedback-item');
    div.innerHTML = `<strong>${fb.name}</strong><p>${fb.message}</p>`;
    feedbackContainer.appendChild(div);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !message) return;

  await addDoc(collection(db, "feedbacks"), { name, message, timestamp: serverTimestamp() });
  form.reset();
  loadFeedbacks();
});

loadFeedbacks();
