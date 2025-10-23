(function () {
  function initChat() {
    const messagesContainer = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');

    if (!messagesContainer || !input || !sendBtn) return;

    const socket = io('https://chat-server-tsfk.onrender.com');

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      const payload = { text, ts: Date.now() }; // формируем объект
      socket.emit('chatMessage', payload);
      input.value = '';
      input.focus();
    }

    socket.on('chatMessage', payload => {
      renderMessage(payload);
    });

    function renderMessage(payload) {
      const div = document.createElement('div');
      div.className = 'chat-message user'; // можно менять на 'bot', если нужно
      div.textContent = payload.text; // берём текст из объекта
      messagesContainer.appendChild(div);
      messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
  } else {
    initChat();
  }
})();

