(function () {
  window.initChat = function () {
    const messagesContainer = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');

    if (!messagesContainer || !input || !sendBtn) return;

    let socket;
    let dotInterval;

    const statusDiv = document.createElement('div');
    statusDiv.id = 'chatStatus';
    statusDiv.style.textAlign = 'center';
    statusDiv.style.margin = '10px 0';
    statusDiv.style.color = 'darkblue';
    messagesContainer.parentNode.insertBefore(statusDiv, messagesContainer);

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
        history.forEach(msg => renderMessage(msg.user, msg.text, msg.ts));
        scrollToBottom();
      });

      socket.on('chatMessage', (msg) => {
        renderMessage(msg.user, msg.text, msg.ts);
        scrollToBottom();
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
      if (!text || !socket.connected) return;
      const msg = { user: 'AlxT259, адмін', text, ts: Date.now() };
      socket.emit('chatMessage', msg);
      input.value = '';
      input.focus();
    }

    function renderMessage(user, text, ts) {
      const div = document.createElement('div');
      div.className = 'chat-message';
      const time = new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      div.innerHTML = `<strong>${user}</strong> <span class="time">${time}</span><br>${text}`;
      messagesContainer.appendChild(div);
    }

    function scrollToBottom() {
      messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
    }
  };
})();

