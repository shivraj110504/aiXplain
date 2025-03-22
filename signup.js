
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAgreement = document.getElementById('termsAgreement').checked;
            
            // Simple validation
            if (!fullName || !email || !phone || !password || !confirmPassword) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            if (!termsAgreement) {
                showToast('Please agree to the Terms of Service and Privacy Policy', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Validate phone number (simple validation)
            if (phone.length < 10) {
                showToast('Please enter a valid phone number', 'error');
                return;
            }
            
            // Validate password strength
            if (password.length < 8) {
                showToast('Password must be at least 8 characters long', 'error');
                return;
            }
            
            // Simulate signup process
            simulateSignup(fullName, email, phone, password);
        });
    }
    
    function simulateSignup(fullName, email, phone, password) {
        // For demo purposes, we'll just simulate a successful signup
        // In a real application, this would send data to a backend service
        
        // Simulate API call delay
        setTimeout(() => {
            // Store login state in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            
            // Store basic user info (for demo)
            const user = {
                name: fullName,
                email: email,
                phone: phone
            };
            
            localStorage.setItem('medicare-user', JSON.stringify(user));
            
            // Show success message
            showToast('Account created successfully! Redirecting...', 'success');
            
            // Redirect to homepage after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 1000);
    }
});
