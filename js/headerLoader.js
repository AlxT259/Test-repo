fetch('header.html')
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML('afterbegin', html);
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');

    const menuState = localStorage.getItem('menuOpen');
    if (menuState === 'true') {
      nav.classList.add('active');
    }

    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
      localStorage.setItem('menuOpen', nav.classList.contains('active'));
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

