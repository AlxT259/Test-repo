class LayoutManager {
    constructor() {
        this.radio = null;
        this.isRadioInitialized = false;
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.isFirstLoad = true;
        this.init();
    }

    async init() {
        await this.loadLayout();
        this.setupNavigation();
        if (!this.isFirstLoad || this.currentPage !== 'index.html') {
            this.loadContent(this.currentPage, false);
        }
        this.isFirstLoad = false;
    }

    async loadLayout() {
        try {
            const headerResponse = await fetch('header.html');
            const headerHtml = await headerResponse.text();
            document.body.insertAdjacentHTML('afterbegin', headerHtml);
            this.initializeHeader();

            const footerResponse = await fetch('footer.html');
            const footerHtml = await footerResponse.text();
            document.body.insertAdjacentHTML('beforeend', footerHtml);
            this.initializeRadio();
        } catch (err) {
            console.error('Помилка завантаження макету:', err);
        }
    }

    initializeHeader() {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav');
        const menuState = localStorage.getItem('menuOpen');
        if (menuState === 'true') nav.classList.add('active');
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            localStorage.setItem('menuOpen', nav.classList.contains('active'));
        });
        this.updateActiveLink();
    }

  initializeRadio() {
    if (this.isRadioInitialized) return;
    this.radio = new Audio();
    this.radio.src = 'https://www.partyvibe.com:8062/;listen.pls?sid=1';
    this.radio.preload = 'none';
    const status = document.getElementById('radio-status');
    const playPauseBtn = document.querySelector('.playpause-btn');
    const volumeControl = document.getElementById('radio-volume');
    const savedVolume = localStorage.getItem('radioVolume');
    if (savedVolume) {
        this.radio.volume = savedVolume;
        volumeControl.value = savedVolume;
    }
    const savedPlaying = localStorage.getItem('radioPlaying');
    if (savedPlaying === 'true') {
        this.radio.play().catch(console.error);
        playPauseBtn.textContent = '❚❚'; // Изменим иконку на паузу
    }
    
    playPauseBtn.addEventListener('click', () => {
        if (this.radio.paused) {
            this.radio.play().then(() => {
                status.textContent = 'Слухаємо Party Vibe PsyTrance 🎧';
                status.style.color = '#4ecdc4';
                localStorage.setItem('radioPlaying', 'true');
                playPauseBtn.textContent = '❚❚'; // Пауза
            }).catch(error => {
                status.textContent = 'Помилка відтворення';
                status.style.color = '#ff6b6b';
            });
        } else {
            this.radio.pause();
            status.textContent = 'Пауза';
            status.style.color = 'white';
            localStorage.setItem('radioPlaying', 'false');
            playPauseBtn.textContent = '▶'; // Воспроизведение
        }
    });

    volumeControl.addEventListener('input', () => {
        this.radio.volume = volumeControl.value;
        localStorage.setItem('radioVolume', volumeControl.value);
    });

    this.radio.addEventListener('waiting', () => {
        status.textContent = 'Буферизація...';
    });

    this.radio.addEventListener('playing', () => {
        status.textContent = 'Слухаємо Party Vibe PsyTrance 🎧';
        status.style.color = '#4ecdc4';
    });

    this.radio.addEventListener('error', () => {
        status.textContent = 'Помилка підключення';
        status.style.color = '#ff6b6b';
    });

    this.isRadioInitialized = true;
}


    async loadContent(page, updateHistory = true) {
        if (page === this.currentPage && !this.isFirstLoad) return;
        try {
            const contentElement = document.getElementById('content');
            if (contentElement) {
                contentElement.innerHTML = '<div class="loading">Завантаження...</div>';
            }
            const response = await fetch(page);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('main#content');
            const newTitle = doc.querySelector('title');
            if (newContent && contentElement) {
                contentElement.innerHTML = newContent.innerHTML;
                if (newTitle) document.title = newTitle.textContent;
                this.currentPage = page;
                if (updateHistory) history.pushState({ page }, '', page);
                this.updateActiveLink();
                this.runPageScripts(doc);
            }
        } catch (err) {
            console.error('Помилка завантаження контенту:', err);
            const contentElement = document.getElementById('content');
            if (contentElement) {
                contentElement.innerHTML = '<p>Помилка завантаження сторінки</p>';
            }
        }
    }

    runPageScripts(doc) {
        const scripts = doc.querySelectorAll('script[type="module"], script[src]');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            if (oldScript.src) newScript.src = oldScript.src;
            else newScript.textContent = oldScript.textContent;
            newScript.type = oldScript.type || 'text/javascript';
            document.body.appendChild(newScript);
        });
    }

    updateActiveLink() {
        document.querySelectorAll('.nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    setupNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                const href = link.getAttribute('href');
                const url = new URL(link.href);
                if (href.startsWith('http') && url.hostname !== window.location.hostname) return;
                if (href.startsWith('#') || href.includes('mailto:') || href.includes('tel:')) return;
                e.preventDefault();
                this.loadContent(href);
            }
        });
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadContent(e.state.page, false);
            } else {
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                this.loadContent(currentPage, false);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LayoutManager();
});
