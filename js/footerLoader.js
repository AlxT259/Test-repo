fetch('footer.html')
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
    
    const radio = new Audio();
    radio.src = 'http://94.130.113.214:8000/schizoid';
    radio.preload = 'none';

    const status = document.getElementById('radio-status');
    const playBtn = document.querySelector('.play-btn');
    const pauseBtn = document.querySelector('.pause-btn');
    const volumeControl = document.getElementById('radio-volume');

    playBtn.addEventListener('click', function() {
        radio.play().then(() => {
            status.textContent = 'Слухаємо Radio Schizoid...';
            status.style.color = '#4ecdc4';
        }).catch(error => {
            status.textContent = 'Помилка відтворення';
            status.style.color = '#ff6b6b';
        });
    });

    pauseBtn.addEventListener('click', function() {
        radio.pause();
        status.textContent = 'Пауза';
        status.style.color = 'white';
    });

    volumeControl.addEventListener('input', function() {
        radio.volume = this.value;
    });

    radio.addEventListener('waiting', () => {
        status.textContent = 'Буферизація...';
    });

    radio.addEventListener('playing', () => {
        status.textContent = 'Слухаємо Radio Schizoid...';
        status.style.color = '#4ecdc4';
    });

    radio.addEventListener('error', () => {
        status.textContent = 'Помилка підключення';
        status.style.color = '#ff6b6b';
    });
  })
  .catch(err => console.error('Помилка завантаження футера:', err));