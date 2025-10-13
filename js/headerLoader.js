fetch('header.html')
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML('afterbegin', html);
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');

    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage) currentPage = 'index.html';
    document.querySelectorAll('.nav a').forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  })
  .catch(err => console.error('Помилка завантаження шапки:', err));
