// components/chatbot.js
import state from './state.js';

const chatbotPanel = document.getElementById('chatbot-panel');
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');

function initializeChatbot() {
    // Toggle chatbot panel
    chatbotToggle.addEventListener('click', () => {
        chatbotPanel.classList.toggle('minimized');
        chatbotToggle.textContent = chatbotPanel.classList.contains('minimized') ? '+' : '−';
    });

    // Send message
    chatbotSend.addEventListener('click', sendChatbotMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatbotMessage();
        }
    });

    // Make chatbot panel draggable
    let isDragging = false;
    let currentX;
    let currentY;
    let xOffset = 0;
    let yOffset = 0;

    chatbotPanel.addEventListener('mousedown', (e) => {
        if (e.target.closest('.chatbot-header')) {
            isDragging = true;
            currentX = e.clientX - xOffset;
            currentY = e.clientY - yOffset;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            xOffset = e.clientX - currentX;
            yOffset = e.clientY - currentY;
            chatbotPanel.style.right = `${parseInt(getComputedStyle(chatbotPanel).right) - xOffset}px`;
            chatbotPanel.style.bottom = `${parseInt(getComputedStyle(chatbotPanel).bottom) - yOffset}px`;
            currentX = e.clientX;
            currentY = e.clientY;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

function sendChatbotMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chatbot-message user';
    userMessage.textContent = message;
    chatbotMessages.appendChild(userMessage);

    // Simulate bot response (replace with actual AI integration later)
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'chatbot-message bot';
        botMessage.textContent = getBotResponse(message);
        chatbotMessages.appendChild(botMessage);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 500);

    // Clear input
    chatbotInput.value = '';
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getBotResponse(message) {
    // Simple response logic - replace with actual AI integration
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('project')) {
        return 'I can help with your project! What specifically would you like assistance with?';
    } else if (lowerMessage.includes('code')) {
        return 'Would you like me to review your code or suggest some improvements?';
    } else if (lowerMessage.includes('widget')) {
        return 'Need help with widgets? I can suggest layouts or explain properties!';
    } else {
        return 'I’m here to help! Could you provide more details about what you need?';
    }
}

export { initializeChatbot };