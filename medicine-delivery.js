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
    
    // Elements
    const medicinesList = document.getElementById('medicinesList');
    const searchInput = document.getElementById('searchInput');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartItems = document.getElementById('cartItems');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const totalAmount = document.getElementById('totalAmount');
    const uploadBtn = document.getElementById('uploadBtn');
    const prescriptionUpload = document.getElementById('prescriptionUpload');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    // Cart state
    let cart = [];
    
    // Sample medicine data
    const medicines = [
        {
            id: '1',
            name: 'Paracetamol 500mg',
            genericName: 'Acetaminophen',
            price: 35,
            stock: 'In Stock',
            prescriptionRequired: false
        },
        {
            id: '2',
            name: 'Azithromycin 250mg',
            genericName: 'Azithromycin',
            price: 120,
            stock: 'In Stock',
            prescriptionRequired: true
        },
        {
            id: '3',
            name: 'Amoxicillin 500mg',
            genericName: 'Amoxicillin',
            price: 80,
            stock: 'In Stock',
            prescriptionRequired: true
        },
        {
            id: '4',
            name: 'Cetrizine 10mg',
            genericName: 'Cetrizine',
            price: 45,
            stock: 'In Stock',
            prescriptionRequired: false
        },
        {
            id: '5',
            name: 'Pantoprazole 40mg',
            genericName: 'Pantoprazole',
            price: 95,
            stock: 'Low Stock',
            prescriptionRequired: false
        },
        {
            id: '6',
            name: 'Metformin 500mg',
            genericName: 'Metformin',
            price: 60,
            stock: 'In Stock',
            prescriptionRequired: true
        }
    ];
    
    // Initialize the page
    displayMedicines(medicines);
    updateCartUI();
    
    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    uploadBtn.addEventListener('click', function() {
        prescriptionUpload.click();
    });
    
    prescriptionUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name;
        } else {
            fileNameDisplay.textContent = 'No file chosen';
        }
    });
    
    placeOrderBtn.addEventListener('click', placeOrder);
    
    // Functions
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredMedicines = medicines.filter(medicine => 
            medicine.name.toLowerCase().includes(searchTerm) ||
            medicine.genericName.toLowerCase().includes(searchTerm)
        );
        
        displayMedicines(filteredMedicines);
    }
    
    function displayMedicines(medicinesToDisplay) {
        medicinesList.innerHTML = '';
        
        if (medicinesToDisplay.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'bg-white rounded-xl shadow-sm p-8 text-center';
            emptyMessage.innerHTML = '<p class="text-gray-500">No medicines found matching your search.</p>';
            medicinesList.appendChild(emptyMessage);
            return;
        }
        
        medicinesToDisplay.forEach(medicine => {
            const medicineCard = document.createElement('div');
            medicineCard.className = 'bg-white rounded-xl shadow-sm p-4 flex justify-between items-center border border-gray-100';
            
            const getStockClass = (stock) => {
                if (stock === 'In Stock') return 'bg-green-100 text-green-800';
                if (stock === 'Low Stock') return 'bg-yellow-100 text-yellow-800';
                return 'bg-red-100 text-red-800';
            };
            
            medicineCard.innerHTML = `
                <div>
                    <h3 class="font-semibold text-gray-800">${medicine.name}</h3>
                    <p class="text-gray-500 text-sm">${medicine.genericName}</p>
                    <div class="flex items-center mt-2 space-x-2">
                        <span class="text-xs px-2 py-1 rounded-full ${getStockClass(medicine.stock)}">
                            ${medicine.stock}
                        </span>
                        ${medicine.prescriptionRequired ? `
                            <span class="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                                Prescription Required
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-gray-800">₹${medicine.price}</p>
                    <button 
                        class="btn btn-primary mt-2 ${medicine.stock === 'Out of Stock' ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${medicine.stock === 'Out of Stock' ? 'disabled' : ''}
                        data-id="${medicine.id}"
                    >
                        Add to Cart
                    </button>
                </div>
            `;
            
            const addToCartBtn = medicineCard.querySelector('button');
            if (medicine.stock !== 'Out of Stock') {
                addToCartBtn.addEventListener('click', () => addToCart(medicine));
            }
            
            medicinesList.appendChild(medicineCard);
        });
    }
    
    function addToCart(medicine) {
        const existingItemIndex = cart.findIndex(item => item.id === medicine.id);
        
        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ ...medicine, quantity: 1 });
        }
        
        updateCartUI();
        showToast(`Added ${medicine.name} to cart`, 'success');
    }
    
    function removeFromCart(medicineId) {
        cart = cart.filter(item => item.id !== medicineId);
        updateCartUI();
    }
    
    function updateCartUI() {
        if (cart.length === 0) {
            emptyCart.classList.remove('hidden');
            cartContent.classList.add('hidden');
            return;
        }
        
        emptyCart.classList.add('hidden');
        cartContent.classList.remove('hidden');
        
        // Update cart items
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'flex justify-between items-start';
            cartItem.innerHTML = `
                <div>
                    <h4 class="font-medium text-gray-800">${item.name}</h4>
                    <p class="text-gray-500 text-sm">₹${item.price} x ${item.quantity}</p>
                </div>
                <div class="flex items-center">
                    <button 
                        class="text-red-500 hover:text-red-700 p-0"
                        data-id="${item.id}"
                    >
                        Remove
                    </button>
                </div>
            `;
            
            const removeBtn = cartItem.querySelector('button');
            removeBtn.addEventListener('click', () => removeFromCart(item.id));
            
            cartItems.appendChild(cartItem);
        });
        
        // Update totals
        const subtotal = calculateSubtotal();
        const deliveryFee = 40;
        const total = subtotal + deliveryFee;
        
        subtotalAmount.textContent = `₹${subtotal}`;
        totalAmount.textContent = `₹${total}`;
    }
    
    function calculateSubtotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    function placeOrder() {
        if (cart.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }
        
        const address = document.getElementById('addressInput').value;
        if (!address.trim()) {
            showToast('Please enter your delivery address', 'error');
            return;
        }
        
        // Check if any medicine requires prescription
        const prescriptionRequired = cart.some(item => item.prescriptionRequired);
        if (prescriptionRequired && !prescriptionUpload.files.length) {
            showToast('Please upload a prescription for prescription-only medicines', 'error');
            return;
        }
        
        // Simulate order placement
        showToast('Order placed successfully! Your medicine will be delivered soon.', 'success');
        
        // Reset form and cart
        cart = [];
        document.getElementById('addressInput').value = '';
        document.getElementById('specialInstructions').value = '';
        fileNameDisplay.textContent = 'No file chosen';
        prescriptionUpload.value = '';
        updateCartUI();
    }
    
    function showToast(message, type = 'info') {
        // This function is implemented in main.js
        // We'll just use it here
        window.showToast(message, type);
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
