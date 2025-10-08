// ===== GLOBAL VARIABLES =====
let currentService = null;

// ===== MOBILE NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function initMobileNavigation() {
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', !isExpanded);
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== SMOOTH SCROLL =====
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
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
            "Moisturizing dan sun protection",
            "Perawatan lanjutan (opsional)"
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
            "Nail polish atau gel (opsional)",
            "Perawatan kutikula"
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
            "Steam / sauna (opsional)",
            "Hydrating body mask"
        ],
        duration: "120-150 menit",
        price: "Rp 200.000 - 750.000",
        image: "🧖",
        recommendedFor: ["Stres & kelelahan", "Kulit kering", "Detoksifikasi", "Relaksasi"]
    }
};

// ===== MODAL SYSTEM =====
function showServiceDetail(serviceId) {
    const service = serviceDetails[serviceId];
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('serviceModal');
    
    if (!service || !modalBody || !modal) return;
    
    currentService = serviceId;
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="service-modal-icon">${service.image}</div>
            <h2 id="modalTitle">${service.title}</h2>
        </div>
        
        <div class="modal-body">
            <p class="service-modal-description">${service.description}</p>
            
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
    
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Restore scroll
        currentService = null;
    }
}

function bookThisService() {
    if (currentService) {
        const service = serviceDetails[currentService];
        // Auto-fill the booking form
        const serviceSelect = document.getElementById('serviceType');
        if (serviceSelect) {
            serviceSelect.value = getServiceSlug(service.title);
        }
        
        // Scroll to booking section
        smoothScrollTo('booking');
        closeModal();
        
        // Show confirmation message
        showNotification(`Berhasil memilih "${service.title}". Silakan lengkapi form booking di bawah.`, 'success');
    }
}

function getServiceSlug(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// ===== BOOKING SYSTEM =====
function initBookingSystem() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateBookingForm()) {
            const formData = new FormData(this);
            const bookingData = {
                name: formData.get('patientName'),
                email: formData.get('patientEmail'),
                phone: formData.get('patientPhone'),
                service: formData.get('serviceType'),
                date: formData.get('appointmentDate'),
                time: formData.get('appointmentTime'),
                message: formData.get('patientMessage'),
                timestamp: new Date().toISOString()
            };
            
            // Simulate API call
            simulateBookingSubmission(bookingData);
        }
    });
    
    // Date validation - disable past dates
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

function validateBookingForm() {
    const requiredFields = [
        'patientName', 'patientEmail', 'patientPhone', 'serviceType', 'appointmentDate', 'appointmentTime'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            showFieldError(field, 'Field ini wajib diisi');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Email validation
    const emailField = document.getElementById('patientEmail');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            showFieldError(emailField, 'Format email tidak valid');
            isValid = false;
        }
    }
    
    // Phone validation
    const phoneField = document.getElementById('patientPhone');
    if (phoneField && phoneField.value) {
        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
        if (!phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
            showFieldError(phoneField, 'Format nomor telepon tidak valid');
            isValid = false;
        }
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function simulateBookingSubmission(bookingData) {
    // Show loading state
    const submitBtn = document.querySelector('#bookingForm .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Memproses...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Save to localStorage (simulate database)
        const bookings = JSON.parse(localStorage.getItem('klinikBookings') || '[]');
        bookings.push({
            ...bookingData,
            id: Date.now().toString(),
            status: 'pending'
        });
        localStorage.setItem('klinikBookings', JSON.stringify(bookings));
        
        // Show success message
        showNotification('🎉 Booking berhasil! Kami akan menghubungi Anda untuk konfirmasi.', 'success');
        
        // Reset form
        document.getElementById('bookingForm').reset();
        
        // Restore button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Log booking data (in real app, send to server)
        console.log('Booking submitted:', bookingData);
        
    }, 2000);
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            const formData = new FormData(this);
            const contactData = {
                name: formData.get('contactName'),
                email: formData.get('contactEmail'),
                subject: formData.get('contactSubject'),
                message: formData.get('contactMessage'),
                timestamp: new Date().toISOString()
            };
            
            // Simulate sending message
            simulateMessageSubmission(contactData);
        }
    });
}

function validateContactForm() {
    const requiredFields = ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            showFieldError(field, 'Field ini wajib diisi');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    return isValid;
}

function simulateMessageSubmission(contactData) {
    const submitBtn = document.querySelector('#contactForm .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Save message (simulate)
        const messages = JSON.parse(localStorage.getItem('klinikMessages') || '[]');
        messages.push({
            ...contactData,
            id: Date.now().toString()
        });
        localStorage.setItem('klinikMessages', JSON.stringify(messages));
        
        showNotification('📧 Pesan berhasil dikirim! Kami akan membalas dalam 1x24 jam.', 'success');
        document.getElementById('contactForm').reset();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        console.log('Message sent:', contactData);
    }, 1500);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===== UTILITY FUNCTIONS =====
function openBookingModal() {
    smoothScrollTo('booking');
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('serviceModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initBookingSystem();
    initContactForm();
    
    // Add loading animation to elements
    const animatedElements = document.querySelectorAll('.service-card, .feature, .contact-item');
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in');
    });
    
    console.log('Klinik Sehat Website initialized successfully!');
});

// ===== STYLING FOR DYNAMIC ELEMENTS =====
const dynamicStyles = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border-left: 4px solid #2c7873;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        border-radius: 8px;
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    }
    
    .notification-success {
        border-left-color: #4CAF50;
    }
    
    .notification-error {
        border-left-color: #f44336;
    }
    
    .notification-content {
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 1rem;
        color: #666;
    }
    
    .field-error {
        color: #f44336;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .form-input.error,
    .form-select.error,
    .form-textarea.error {
        border-color: #f44336;
        box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
    }
    
    .modal-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .service-modal-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }
    
    .service-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin: 1.5rem 0;
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
    }
    
    .info-item {
        display: flex;
        flex-direction: column;
    }
    
    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .tag {
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.875rem;
    }
    
    .features-list {
        list-style: none;
        padding: 0;
    }
    
    .features-list li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
        position: relative;
        padding-left: 1.5rem;
    }
    
    .features-list li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #4CAF50;
        font-weight: bold;
    }
    
    .modal-footer {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid #f0f0f0;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);