document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Check login status
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Elements
    const loginSection = document.getElementById('loginSection');
    const moleculeOrbit = document.getElementById('moleculeOrbit');
    const chatInputArea = document.getElementById('chatInputArea');
    const loginPrompt = document.getElementById('loginPrompt');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    
    // Login/Signup buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginBtnBottom = document.getElementById('loginBtnBottom');
    const signupBtnBottom = document.getElementById('signupBtnBottom');
    
    // Dropdown menu for login/signup
    const authDropdownBtn = document.getElementById('authDropdownBtn');
    const authDropdownMenu = document.getElementById('authDropdownMenu');
    const authButtonText = document.getElementById('authButtonText');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutLink = document.getElementById('logoutLink');

    authDropdownBtn.addEventListener('click', function() {
        authDropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', function(event) {
        if (!authDropdownBtn.contains(event.target) && !authDropdownMenu.contains(event.target)) {
            authDropdownMenu.classList.add('hidden');
        }
    });

    // Update UI based on login status
    updateUIForLoginStatus(isLoggedIn);
    
    // Add initial welcome message
    addMessage({
        sender: 'ai',
        text: "Hello! I'm MediCare's AI assistant powered by Gemini. Please log in to get personalized health assistance.",
        time: getCurrentTime()
    });
    
    // Login/Signup button event listeners
    loginBtn.addEventListener('click', navigateToLogin);
    signupBtn.addEventListener('click', navigateToSignup);
    loginBtnBottom.addEventListener('click', navigateToLogin);
    signupBtnBottom.addEventListener('click', navigateToSignup);
    
    // Send message functionality
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    messageInput.addEventListener('input', function() {
        sendButton.disabled = !messageInput.value.trim();
    });
    
    sendButton.addEventListener('click', sendMessage);
    
    // Logout functionality
    logoutLink.addEventListener('click', function() {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('username');
        window.location.reload();
    });

    // Functions
    function updateUIForLoginStatus(loggedIn) {
        if (loggedIn) {
            const username = localStorage.getItem('username');
            loginSection.classList.add('hidden');
            moleculeOrbit.classList.remove('hidden');
            chatInputArea.classList.remove('hidden');
            loginPrompt.classList.add('hidden');
            messageInput.disabled = false;
            sendButton.disabled = true;
            loginLink.style.display = 'none';
            signupLink.style.display = 'none';
            usernameDisplay.style.display = 'block';
            usernameDisplay.textContent = `Hello, ${username}`;
            authButtonText.textContent = username;
            logoutLink.style.display = 'block';
        } else {
            loginSection.classList.remove('hidden');
            moleculeOrbit.classList.add('hidden');
            chatInputArea.classList.add('hidden');
            loginPrompt.classList.remove('hidden');
            messageInput.disabled = true;
            sendButton.disabled = true;
            loginLink.style.display = 'block';
            signupLink.style.display = 'block';
            usernameDisplay.style.display = 'none';
            authButtonText.textContent = 'Account';
            logoutLink.style.display = 'none';
        }
    }
    
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    
    function navigateToLogin() {
        window.location.href = 'login.html';
    }
    
    function navigateToSignup() {
        window.location.href = 'signup.html';
    }
    
    function sendMessage() {
        if (!isLoggedIn) return;
        
        const text = messageInput.value.trim();
        if (!text) return;
        
        // Add user message
        addMessage({
            sender: 'user',
            text: text,
            time: getCurrentTime()
        });
        
        // Clear input
        messageInput.value = '';
        sendButton.disabled = true;
        
        // Simulate AI response
        setTimeout(() => {
            addMessage({
                sender: 'ai',
                text: "I understand you're experiencing these symptoms. Based on the information provided, this could be related to a seasonal viral infection. I recommend rest, staying hydrated, and over-the-counter pain relievers for the fever. Would you like me to suggest specific medications?",
                time: getCurrentTime()
            });
        }, 1500);
    }
    
    function addMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`;
        
        const messageBubble = document.createElement('div');
        messageBubble.className = `max-w-[80%] rounded-xl p-3 ${
            message.sender === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`;
        
        const messageText = document.createElement('p');
        messageText.className = 'text-sm';
        messageText.textContent = message.text;
        
        const messageTime = document.createElement('div');
        messageTime.className = `text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`;
        messageTime.textContent = message.time;
        
        messageBubble.appendChild(messageText);
        messageBubble.appendChild(messageTime);
        messageDiv.appendChild(messageBubble);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
