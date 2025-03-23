document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Check if user is logged in and update the UI accordingly
    checkLoginStatus();
    
    // Add logout functionality
    setupLogout();

    // Setup dropdown toggle functionality
    setupDropdownToggle();

    // Quick book functionality
    window.quickBookBed = async function(hospitalId, bedType) {
        const userData = JSON.parse(localStorage.getItem('medicare-user'));
        if (!userData) {
            showToast('Please log in to book a bed', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        try {
            showToast('Processing your booking...', 'info');
            
            const formData = {
                patientName: userData.fullName,
                email: userData.email,
                hospital: hospitalId,
                bedType: bedType,
                admissionDate: new Date().toISOString().split('T')[0], // Today's date
                status: 'pending',
                bookingDate: new Date().toISOString()
            };

            const response = await fetch('http://localhost:3001/bookBed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                showToast('Bed booked successfully!', 'success');
                setTimeout(() => window.location.href = 'loggedin.html', 2000);
            } else {
                showToast(result.message || 'Failed to book bed', 'error');
            }
        } catch (error) {
            console.error('Booking Error:', error);
            showToast('An error occurred. Please try again.', 'error');
        }
    };

    // View hospital details
    window.viewHospitalDetails = function(hospitalId) {
        const hospitals = {
            'city-hospital': {
                name: 'City Hospital',
                location: 'Central City',
                contact: '+1 234 567 890',
                facilities: ['24/7 Emergency', 'ICU', 'General Ward', 'Private Rooms'],
                specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
                rating: 4.5,
                bedTypes: ['General', 'Private', 'ICU']
            },
            'apollo': {
                name: 'Apollo Hospital',
                location: 'North City',
                contact: '+1 234 567 891',
                facilities: ['Emergency Care', 'ICU', 'NICU', 'Private Rooms'],
                specialties: ['Pediatrics', 'Oncology', 'Gastroenterology'],
                rating: 4.8,
                bedTypes: ['General', 'Private', 'ICU', 'NICU']
            },
            'fortis': {
                name: 'Fortis Hospital',
                location: 'South City',
                contact: '+1 234 567 892',
                facilities: ['24/7 Emergency', 'ICU', 'Private Rooms'],
                specialties: ['Cardiology', 'Urology', 'Nephrology'],
                rating: 4.6,
                bedTypes: ['General', 'Private', 'ICU']
            },
            'max': {
                name: 'Max Healthcare',
                location: 'East City',
                contact: '+1 234 567 893',
                facilities: ['Emergency Care', 'ICU', 'General Ward'],
                specialties: ['Orthopedics', 'Neurology', 'Psychiatry'],
                rating: 4.7,
                bedTypes: ['General', 'Private', 'ICU']
            }
        };

        const hospital = hospitals[hospitalId];
        if (!hospital) return;

        // Create modal content
        const modalContent = `
            <div class="hospital-details">
                <h2>${hospital.name}</h2>
                <p class="location"><i data-lucide="map-pin"></i> ${hospital.location}</p>
                <p class="contact"><i data-lucide="phone"></i> ${hospital.contact}</p>
                <div class="rating">
                    <i data-lucide="star"></i>
                    <span>${hospital.rating} / 5.0</span>
                </div>
                <div class="facilities">
                    <h3>Facilities</h3>
                    <ul>
                        ${hospital.facilities.map(f => `<li><i data-lucide="check-circle"></i> ${f}</li>`).join('')}
                    </ul>
                </div>
                <div class="specialties">
                    <h3>Specialties</h3>
                    <ul>
                        ${hospital.specialties.map(s => `<li><i data-lucide="activity"></i> ${s}</li>`).join('')}
                    </ul>
                </div>
                <div class="bed-types">
                    <h3>Available Bed Types</h3>
                    <div class="bed-type-buttons">
                        ${hospital.bedTypes.map(type => `
                            <button class="btn btn-primary" onclick="quickBookBed('${hospitalId}', '${type}')">
                                <i data-lucide="bed"></i> Book ${type} Bed
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Show modal with hospital details
        showModal(modalContent);
    };

    function showModal(content) {
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">
                    <i data-lucide="x"></i>
                </button>
                ${content}
            </div>
        `;

        // Add modal to body
        document.body.appendChild(modal);
        lucide.createIcons();

        // Close modal on click outside or close button
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.closest('.modal-close')) {
                modal.remove();
            }
        });
    }
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

// Setup Dropdown Toggle
function setupDropdownToggle() {
    const userProfileToggle = document.getElementById('userProfileToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (userProfileToggle && dropdownMenu) {
        // Toggle dropdown on click
        userProfileToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
            userProfileToggle.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!userProfileToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
                userProfileToggle.classList.remove('active');
            }
        });
    }
}

// Show Toast Messages
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Auto-remove after 3s
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
