// js/chat.js
(function () {
  function initChat() {
    const messagesContainer = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    if (!messagesContainer || !input || !sendBtn) return;

    // Загрузка сохранённых сообщений
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    savedMessages.forEach(msg => renderMessage(msg.text, msg.sender));

    // Обработчики
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
      renderMessage(text, 'user');
      saveMessage(text, 'user');
      input.value = '';
      input.focus();

      // Имитируем ответ (для теста)
      setTimeout(() => {
        const reply = getBotReply(text);
        renderMessage(reply, 'bot');
        saveMessage(reply, 'bot');
      }, 700);
    }

    function renderMessage(text, sender) {
      const div = document.createElement('div');
      div.className = 'chat-message ' + sender;
      div.textContent = text;
      messagesContainer.appendChild(div);
      // плавный автоскролл
      messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
    }

    function saveMessage(text, sender) {
      const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      messages.push({ text, sender, ts: Date.now() });
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }

    function getBotReply(userText) {
      const responses = [
        'Дякую за повідомлення! 💙',
        'Цікаво! Розкажи більше 😊',
        'Я це запам’ятаю 👀',
        'О, це звучить круто! 🚀',
        'Можу допомогти ще чимось?'
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
  } else {
    initChat();
  }
})();

