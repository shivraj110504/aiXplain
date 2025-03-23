document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');

    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }

            const userData = { fullName, email, phone, password };

            try {
                const response = await fetch("http://localhost:3000/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                if (response.ok) {
                    showToast(result.message, 'success');
                    setTimeout(() => window.location.href = 'index.html', 1500);
                } else {
                    showToast(result.message || 'Signup failed', 'error');
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                showToast('Error connecting to server', 'error');
            }
<<<<<<< HEAD
=======
            
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
            
            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, email, phone, password })
                });
            
                if (response.ok) {
                    showToast('User created successfully', 'success');
                    window.location.href = 'login.html';
                } else {
                    const errorText = await response.text();
                    let errorMessage = 'An error occurred';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message;
                    } catch (e) {
                        errorMessage = errorText || 'An unknown error occurred';
                    }
                    showToast(`Error: ${errorMessage}`, 'error');
                }
            } catch (error) {
                showToast(`Error: ${error.message}`, 'error');
            }
>>>>>>> 7582a14 (new commit)
        });
    }
});
