// ===== GLOBAL VARIABLES =====
let currentService = null;
let cart = [];
let chatOpen = false;

// ===== MOBILE NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL =====
function scrollToServices() {
    document.getElementById('services').scrollIntoView({
        behavior: 'smooth'
    });
}

// ===== SERVICE DETAILS DATA =====
const serviceDetails = {
    perawatan1: {
        title: "Perawatan Wajah Lengkap",
        description: "Treatment komprehensif untuk semua jenis kulit wajah. Membersihkan, melembabkan, dan meremajakan kulit Anda dengan teknologi modern dan produk berkualitas tinggi.",
        features: [
            "Konsultasi kulit dengan ahli",
            "Pembersihan wajah mendalam",
            "Eksfoliasi dan chemical peeling",
            "Ekstraksi komedo dan blackhead",
            "Masker khusus sesuai jenis kulit",
            "Moisturizing dan sun protection"
        ],
        duration: "90-120 menit",
        price: "Rp 150.000 - 500.000",
        image: "💆",
        recommendedFor: ["Kulit berminyak", "Jerawat", "Flek hitam", "Penuaan dini"]
    },
    perawatan2: {
        title: "Perawatan Tangan & Kaki Profesional",
        description: "Manicure dan pedicure profesional dengan teknik steril, produk premium, dan perhatian pada detail untuk tangan dan kaki yang sehat dan indah.",
        features: [
            "Pemotongan dan shaping kuku",
            "Cuticle care dan treatment",
            "Hand & foot spa massage",
            "Scrub dan moisturizing",
            "Callus removal (jika diperlukan)",
            "Nail polish atau gel (opsional)"
        ],
        duration: "60-75 menit",
        price: "Rp 100.000 - 250.000",
        image: "💅",
        recommendedFor: ["Kuku rapuh", "Kulit kering", "Kapalan", "Perawatan rutin"]
    },
    perawatan3: {
        title: "Perawatan Tubuh Total & Relaksasi",
        description: "Pengalaman relaksasi dan perawatan tubuh menyeluruh dari ujung kepala hingga ujung kaki untuk merevitalisasi tubuh dan pikiran.",
        features: [
            "Body massage tradisional / sport",
            "Body scrub dengan bahan alami",
            "Aromatherapy essential oils",
            "Moisturizing full body treatment",
            "Relaxation therapy",
            "Steam / sauna (opsional)"
        ],
        duration: "120-150 menit",
        price: "Rp 200.000 - 750.000",
        image: "🧖",
        recommendedFor: ["Stres & kelelahan", "Kulit kering", "Detoksifikasi", "Relaksasi"]
    },
    perawatan4: {
        title: "Konsultasi Kulit dengan Dermatologis",
        description: "Konsultasi mendalam dengan ahli dermatologi untuk analisis kulit dan rekomendasi perawatan yang personalized.",
        features: [
            "Analisis kulit mendalam",
            "Diagnosis masalah kulit",
            "Rencana perawatan personalized",
            "Rekomendasi produk yang tepat",
            "Follow-up konsultasi",
            "Educational session"
        ],
        duration: "60-90 menit",
        price: "Rp 300.000 - 800.000",
        image: "🧴",
        recommendedFor: ["Masalah kulit kompleks", "Alergi kulit", "Kondisi medis kulit", "Konsultasi profesional"]
    }
};

// ===== MODAL FUNCTIONS =====
function showServiceDetail(serviceId) {
    const service = serviceDetails[serviceId];
    const modalBody = document.getElementById('modalBody');
    
    if (!service || !modalBody) return;
    
    currentService = serviceId;
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="service-icon">${service.image}</div>
            <h2>${service.title}</h2>
        </div>
        
        <div class="modal-body">
            <p class="service-description">${service.description}</p>
            
            <div class="service-info-grid">
                <div class="info-item">
                    <strong>💰 Harga:</strong>
                    <span>${service.price}</span>
                </div>
                <div class="info-item">
                    <strong>⏱️ Durasi:</strong>
                    <span>${service.duration}</span>
                </div>
            </div>
            
            <div class="recommended-for">
                <h4>✅ Cocok Untuk:</h4>
                <div class="tags">
                    ${service.recommendedFor.map(item => `<span class="tag">${item}</span>`).join('')}
                </div>
            </div>
            
            <div class="features-section">
                <h4>📋 Fitur Perawatan:</h4>
                <ul class="features-list">
                    ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="modal-footer">
            <button class="cta-button secondary" onclick="closeModal()">Tutup</button>
            <button class="cta-button primary" onclick="bookThisService()">Booking Layanan Ini</button>
        </div>
    `;
    
    document.getElementById('serviceModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('serviceModal').style.display = 'none';
    currentService = null;
}

function bookThisService() {
    if (currentService) {
        const service = serviceDetails[currentService];
        showNotification(`Berhasil memilih "${service.title}". Silakan lengkapi form booking di bawah.`, 'success');
        closeModal();
        
        // Scroll to booking section
        setTimeout(() => {
            document.getElementById('booking').scrollIntoView({
                behavior: 'smooth'
            });
        }, 500);
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// ===== BOOKING SYSTEM =====
document.getElementById('bookingForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = this.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'red';
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (isValid) {
        showNotification('🎉 Booking berhasil! Kami akan menghubungi Anda untuk konfirmasi.', 'success');
        this.reset();
        
        // Set minimum date to today
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    } else {
        showNotification('❌ Harap lengkapi semua field yang wajib diisi.', 'error');
    }
});

// ===== CONTACT FORM =====
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const requiredFields = this.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'red';
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (isValid) {
        showNotification('📧 Pesan berhasil dikirim! Kami akan membalas dalam 1x24 jam.', 'success');
        this.reset();
    } else {
        showNotification('❌ Harap lengkapi semua field yang wajib diisi.', 'error');
    }
});

// ===== FAQ SYSTEM =====
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('.faq-icon');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-answer').forEach(item => {
        if (item !== answer) {
            item.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.faq-icon').forEach(item => {
        if (item !== icon) {
            item.textContent = '+';
        }
    });
    
    // Toggle current FAQ
    answer.classList.toggle('active');
    icon.textContent = answer.classList.contains('active') ? '−' : '+';
}

// ===== GALLERY SYSTEM =====
function openGallery(imageId) {
    showNotification(`🖼️ Membuka galeri: ${imageId}`, 'info');
    // In a real implementation, this would open a lightbox with the actual image
}

// ===== CART SYSTEM =====
function addToCart(productId) {
    const products = {
        'serum-vitamin-c': { name: 'Serum Vitamin C', price: 250000 },
        'facial-cleanser': { name: 'Facial Cleanser', price: 120000 },
        'moisturizing-cream': { name: 'Moisturizing Cream', price: 180000 }
    };
    
    const product = products[productId];
    if (product) {
        cart.push(product);
        updateCart();
        showNotification(`🛒 ${product.name} ditambahkan ke keranjang!`, 'success');
    }
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartItems && cartTotal) {
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>Rp ${item.price.toLocaleString()}</span>
                    <button onclick="removeFromCart(${index})">❌</button>
                </div>
            `;
        });
        
        cartTotal.textContent = total.toLocaleString();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function showCart() {
    updateCart();
    document.getElementById('cartModal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        showNotification('🛒 Keranjang kosong!', 'error');
        return;
    }
    
    showNotification('🚀 Checkout berhasil! Terima kasih atas pembelian Anda.', 'success');
    cart = [];
    closeCart();
}

// ===== ADMIN SYSTEM =====
function showAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'block';
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'none';
}

document.getElementById('adminLoginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Simple authentication (in real app, this would be server-side)
    if (username === 'admin' && password === 'admin123') {
        closeAdminLogin();
        showAdminDashboard();
        showNotification('🔑 Login admin berhasil!', 'success');
    } else {
        showNotification('❌ Username atau password salah!', 'error');
    }
});

function showAdminDashboard() {
    // Sample bookings data
    const bookings = [
        { name: 'Sarah Putri', service: 'Perawatan Wajah', date: '2024-01-15', time: '14:00', status: 'Confirmed' },
        { name: 'Budi Pratama', service: 'Perawatan Tubuh', date: '2024-01-16', time: '10:00', status: 'Pending' },
        { name: 'Maya Sari', service: 'Konsultasi Kulit', date: '2024-01-17', time: '13:00', status: 'Confirmed' }
    ];
    
    const bookingsTable = document.getElementById('bookingsTable');
    if (bookingsTable) {
        bookingsTable.innerHTML = bookings.map(booking => `
            <tr>
                <td>${booking.name}</td>
                <td>${booking.service}</td>
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td>${booking.status}</td>
                <td>
                    <button class="action-btn" onclick="editBooking('${booking.name}')">✏️</button>
                    <button class="action-btn" onclick="deleteBooking('${booking.name}')">🗑️</button>
                </td>
            </tr>
        `).join('');
    }
    
    document.getElementById('adminDashboard').style.display = 'block';
}

function closeAdminDashboard() {
    document.getElementById('adminDashboard').style.display = 'none';
}

function openAdminTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show the specific tab content
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to the clicked button
    event.currentTarget.classList.add('active');
}

function editBooking(bookingName) {
    showNotification(`✏️ Mengedit booking: ${bookingName}`, 'info');
}

function deleteBooking(bookingName) {
    if (confirm(`Apakah Anda yakin ingin menghapus booking ${bookingName}?`)) {
        showNotification(`🗑️ Booking ${bookingName} telah dihapus`, 'success');
    }
}

// ===== APPOINTMENT REMINDER =====
function showReminder() {
    document.getElementById('reminderModal').style.display = 'block';
}

function closeReminder() {
    document.getElementById('reminderModal').style.display = 'none';
}

function confirmAppointment() {
    showNotification('✅ Appointment dikonfirmasi! Sampai jumpa besok.', 'success');
    closeReminder();
}

// ===== CHAT WIDGET =====
function toggleChat() {
    const chatBox = document.querySelector('.chat-box');
    chatOpen = !chatOpen;
    
    if (chatBox) {
        if (chatOpen) {
            chatBox.classList.add('show');
        } else {
            chatBox.classList.remove('show');
        }
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatMessage');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (chatInput && chatInput.value.trim() !== '') {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.textContent = chatInput.value;
        chatMessages.appendChild(userMessage);
        
        // Clear input
        chatInput.value = '';
        
        // Auto reply after delay
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot';
            botMessage.textContent = 'Terima kasih atas pesan Anda! Tim kami akan membalas segera. Untuk pertanyaan mendesak, silakan hubungi 0812-3456-7890.';
            chatMessages.appendChild(botMessage);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Enter key to send message in chat
document.getElementById('chatMessage')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        
        // Set color based on type
        if (type === 'error') {
            notification.style.borderLeftColor = '#ff6b6b';
        } else if (type === 'success') {
            notification.style.borderLeftColor = '#4CAF50';
        } else {
            notification.style.borderLeftColor = '#2c7873';
        }
        
        notification.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
}

// ===== UTILITY FUNCTIONS =====
function showBookingModal() {
    document.getElementById('booking').scrollIntoView({
        behavior: 'smooth'
    });
}

// Set minimum date for appointment date
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    // Show reminder after 10 seconds (for demo)
    setTimeout(() => {
        showReminder();
    }, 10000);
});

// ===== INITIALIZATION =====
console.log('Klinik Sehat Website loaded successfully!');

// Add some sample interactions for demo
setTimeout(() => {
    // Auto-populate some form fields for demo
    const patientName = document.getElementById('patientName');
    const patientEmail = document.getElementById('patientEmail');
    
    if (patientName && patientEmail) {
        patientName.value = 'Nama Demo';
        patientEmail.value = 'demo@email.com';
    }
}, 2000);