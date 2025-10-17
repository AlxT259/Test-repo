const form = document.getElementById('feedbackForm');
const feedbackContainer = document.getElementById('feedbackContainer');

function loadFeedbacks() {
  const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
  feedbackContainer.innerHTML = '';
  feedbacks.forEach(fb => {
    const div = document.createElement('div');
    div.classList.add('feedback-item');
    div.innerHTML = `<strong>${fb.name}</strong><p>${fb.message}</p>`;
    feedbackContainer.appendChild(div);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !message) return;

  const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
  feedbacks.push({ name, message });
  localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

  form.reset();
  loadFeedbacks();
});

loadFeedbacks();
