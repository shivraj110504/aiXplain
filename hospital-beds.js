document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Check if user is logged in and update the UI accordingly
    checkLoginStatus();
    
    // Add logout functionality
    setupLogout();
    
    // Initialize hospital bed search
    initHospitalBedSearch();
});

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.querySelector('.user-profile');
    
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

// Initialize hospital bed search functionality
function initHospitalBedSearch() {
    const searchBtn = document.getElementById('searchBeds');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // Get search parameters
            const location = document.getElementById('location').value;
            const bedType = document.getElementById('bedType').value;
            const date = document.getElementById('date').value;
            
            // In a real app, this would make an API call to search for beds
            // For this demo, we'll just simulate a search with a toast notification
            
            showToast('Searching for beds... Results updated.', 'info');
            
            // You could update the results based on the search criteria
            // For now, we'll just keep the existing example results
        });
    }
}
