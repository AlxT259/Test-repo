(function () {
  window.initChat = function () {
    const messagesContainer = document.getElementById('chatMessages');
    const inputArea = document.querySelector('.chat-input-area');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');

    if (!messagesContainer || !inputArea || !input || !sendBtn) return;

    let socket;
    let dotInterval;

    const statusDiv = document.createElement('div');
    statusDiv.id = 'chatStatus';
    statusDiv.style.textAlign = 'center';
    statusDiv.style.margin = '10px 0';
    statusDiv.style.color = 'darkblue';
    messagesContainer.parentNode.insertBefore(statusDiv, messagesContainer);

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Ваше ім’я:';
    nameLabel.style.display = 'block';
    nameLabel.style.textAlign = 'center';
    nameLabel.style.margin = '10px 0 5px';
    nameLabel.style.fontWeight = 'bold';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'chatName';
    nameInput.className = 'chat-input';
    nameInput.placeholder = 'Введіть ім’я...';
    nameInput.style.display = 'block';
    nameInput.style.margin = '0 auto 10px';
    nameInput.style.textAlign = 'center';

    const savedName = localStorage.getItem('chatUserName');
    if (savedName) nameInput.value = savedName;

    inputArea.parentNode.insertBefore(nameLabel, inputArea);
    inputArea.parentNode.insertBefore(nameInput, inputArea);

    function connectSocket() {
      statusDiv.textContent = 'підключення (чекайте до 50с)';
      let dots = 0;
      dotInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        statusDiv.textContent = 'підключення (чекайте до 50с)' + '.'.repeat(dots);
      }, 500);

      socket = io('https://chat-server-tsfk.onrender.com', { reconnection: true });

      socket.on('connect', () => {
        clearInterval(dotInterval);
        statusDiv.textContent = 'З’єднано ✅';
      });

      socket.on('disconnect', () => {
        statusDiv.textContent = 'Втрата з’єднання... перепідключення';
        setTimeout(connectSocket, 2000);
      });

      socket.on('chatHistory', (history) => {
        messagesContainer.innerHTML = '';
        const sorted = history.sort((a, b) => b.ts - a.ts);
        sorted.forEach(msg => renderMessage(msg.user, msg.text, msg.ts));
      });

      socket.on('chatMessage', (msg) => {
        renderMessage(msg.user, msg.text, msg.ts);
      });
    }

    connectSocket();

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    function sendMessage() {
      const text = input.value.trim();
      const name = nameInput.value.trim() || 'Анонім';
      if (!text || !socket.connected) return;
      localStorage.setItem('chatUserName', name);
      const msg = { user: name, text, ts: Date.now() };
      socket.emit('chatMessage', msg);
      input.value = '';
      input.focus();
    }

    function renderMessage(user, text, ts) {
      const div = document.createElement('div');
      const savedName = localStorage.getItem('chatUserName');
      div.className = 'chat-message';
      if (user === savedName) div.classList.add('my-message');
      else div.classList.add('other-message');

      const time = new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      div.innerHTML = `<strong>${user}</strong> <span class="time">${time}</span><br>${text}`;
      messagesContainer.appendChild(div);
    }
  };
})();

