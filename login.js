
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate login (in a real app, this would call an API)
            simulateLogin(email, password);
        });
    }
    
    // Check if user is already logged in
    checkLoginStatus();
    
    // Add logout functionality
    setupLogout();
    
    function simulateLogin(email, password) {
        // For demo purposes, we'll accept any credentials
        // In a real application, this would validate against a backend service
        
        // Simulate API call delay
        setTimeout(() => {
            // Store login state in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            
            // Store basic user info (for demo)
            const user = {
                email: email,
                name: email.split('@')[0], // Simple way to get a name from email
            };
            
            localStorage.setItem('medicare-user', JSON.stringify(user));
            
            // Show success message
            showToast('Login successful. Redirecting...', 'success');
            
            // Redirect to homepage after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 1000);
    }
    
    // Check if user is logged in
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const authButtons = document.querySelector('.auth-buttons');
        const userProfile = document.querySelector('.user-profile');
        
        if (!authButtons || !userProfile) return;
        
        if (isLoggedIn) {
            // User is logged in
            authButtons.classList.add('hidden');
            userProfile.classList.remove('hidden');
            
            // Set user name
            const userData = JSON.parse(localStorage.getItem('medicare-user'));
            const userNameElement = document.querySelector('.user-name');
            
            if (userData && userNameElement) {
                if (userData.name) {
                    userNameElement.textContent = userData.name;
                } else if (userData.email) {
                    userNameElement.textContent = userData.email.split('@')[0];
                }
            }
            
            // If on login page, redirect to dashboard
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
            }
        } else {
            // User is not logged in
            authButtons.classList.remove('hidden');
            userProfile.classList.add('hidden');
        }
    }
    
    // Setup logout functionality
    function setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Clear login data
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('medicare-user');
                
                // Show toast message
                showToast('Logged out successfully', 'success');
                
                // Redirect to home page after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            });
        }
    }
});
