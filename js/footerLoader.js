fetch('footer.html')
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
  })
  .catch(err => console.error('Помилка завантаження футера:', err));
