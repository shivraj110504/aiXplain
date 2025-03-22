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
        });
    }
});
