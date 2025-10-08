// ===== CONFIG & STATE =====
const CONFIG = {
    animationDelay: 100,
    debounceDelay: 50
};

let state = {
    currentService: null,
    isModalOpen: false
};

// ===== DOM CACHE =====
const DOM = {
    hamburger: null,
    navMenu: null,
    serviceModal: null,
    modalBody: null
};

// ===== SERVICE DATA =====
const SERVICE_DATA = {
    perawatan1: {
        title: "Perawatan Wajah Lengkap",
        description: "Treatment komprehensif untuk semua jenis kulit wajah.",
        features: ["Pembersihan mendalam", "Eksfoliasi", "Masker khusus", "Moisturizing"],
        price: "Rp 150.000 - 500.000",
        duration: "90 menit",
        icon: "💆"
    },
    perawatan2: {
        title: "Perawatan Tangan & Kaki", 
        description: "Manicure dan pedicure profesional dengan teknik steril.",
        features: ["Manicure & Pedicure", "Nail Care", "Hand & Foot Spa"],
        price: "Rp 100.000 - 250.000", 
        duration: "60 menit",
        icon: "💅"
    },
    perawatan3: {
        title: "Perawatan Tubuh Total",
        description: "Relaksasi dan perawatan tubuh menyeluruh.",
        features: ["Body Massage", "Body Scrub", "Aromatherapy"],
        price: "Rp 200.000 - 750.000",
        duration: "120 menit", 
        icon: "🧖"
    }
};

// ===== INITIALIZATION =====
function init() {
    cacheDOM();
    setupEventListeners();
    setupPerformance();
    console.log('Klinik Sehat initialized');
}

function cacheDOM() {
    DOM.hamburger = document.querySelector('.hamburger');
    DOM.navMenu = document.querySelector('.nav-menu');
    DOM.serviceModal = document.getElementById('serviceModal');
    DOM.modalBody = document.getElementById('modalBody');
}

// ===== EVENT DELEGATION =====
function setupEventListeners() {
    // Single event listener for all clicks
    document.addEventListener('click', handleDocumentClick, { passive: true });
    
    // Form submissions
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit, { passive: false });
    }
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit, { passive: false });
    }
    
    // Keyboard events
    document.addEventListener('keydown', handleKeydown, { passive: true });
    
    // Mobile menu
    if (DOM.hamburger) {
        DOM.hamburger.addEventListener('click', toggleMobileMenu, { passive: true });
    }
}

function handleDocumentClick(e) {
    const target = e.target;
    const action = target.dataset.action;
    const service = target.closest('.service-card')?.dataset.service;
    
    // Handle data-action buttons
    if (action) {
        e.preventDefault();
        handleAction(action, service);
        return;
    }
    
    // Close modal when clicking outside
    if (target === DOM.serviceModal) {
        closeModal();
    }
}

function handleAction(action, service) {
    const actions = {
        'scroll-to-services': () => smoothScrollTo('services'),
        'open-booking': () => smoothScrollTo('booking'),
        'service-detail': () => service && showServiceDetail(service),
        'close-modal': closeModal
    };
    
    if (actions[action]) {
        actions[action]();
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function setupPerformance() {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduce-motion');
    }
    
    // Lazy load non-critical components
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements for lazy animation
    document.querySelectorAll('.service-card, .feature').forEach(el => {
        observer.observe(el);
    });
}

// ===== MOBILE NAVIGATION =====
function toggleMobileMenu() {
    const isExpanded = DOM.hamburger.getAttribute('aria-expanded') === 'true';
    
    DOM.hamburger.classList.toggle('active');
    DOM.navMenu.classList.toggle('active');
    DOM.hamburger.setAttribute('aria-expanded', !isExpanded);
    
    // Close menu when clicking links (delegated)
}

// ===== SMOOTH SCROLL =====
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = target.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// ===== MODAL SYSTEM =====
function showServiceDetail(serviceId) {
    const service = SERVICE_DATA[serviceId];
    if (!service || !DOM.modalBody) return;
    
    state.currentService = serviceId;
    state.isModalOpen = true;
    
    DOM.modalBody.innerHTML = `
        <div class="modal-header">
            <div class="service-icon">${service.icon}</div>
            <h2>${service.title}</h2>
        </div>
        <div class="modal-body">
            <p>${service.description}</p>
            <div class="service-info">
                <div><strong>Harga:</strong> ${service.price}</div>
                <div><strong>Durasi:</strong> ${service.duration}</div>
            </div>
            <div class="features">
                <h4>Fitur:</h4>
                <ul>
                    ${service.features.map(feat => `<li>${feat}</li>`).join('')}
                </ul>
            </div>
        </div>
        <div class="modal-footer">
            <button class="cta-button secondary" data-action="close-modal">Tutup</button>
            <button class="cta-button primary" data-action="open-booking">Booking</button>
        </div>
    `;
    
    DOM.serviceModal.style.display = 'block';
    DOM.serviceModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!DOM.serviceModal) return;
    
    DOM.serviceModal.style.display = 'none';
    DOM.serviceModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    state.isModalOpen = false;
    state.currentService = null;
}

// ===== FORM HANDLING =====
function handleBookingSubmit(e) {
    e.preventDefault();
    
    if (validateForm(e.target)) {
        showLoadingState(e.submitter);
        simulateSubmission(e.target, 'booking')
            .finally(() => restoreButtonState(e.submitter));
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    if (validateForm(e.target)) {
        showLoadingState(e.submitter);
        simulateSubmission(e.target, 'contact')
            .finally(() => restoreButtonState(e.submitter));
    }
}

function validateForm(form) {
    let isValid = true;
    const required = form.querySelectorAll('[required]');
    
    required.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Field ini wajib diisi');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    field.parentNode.appendChild(error);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
}

function showLoadingState(button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = 'Memproses...';
}

function restoreButtonState(button) {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Submit';
}

async function simulateSubmission(form, type) {
    return new Promise(resolve => {
        setTimeout(() => {
            const message = type === 'booking' 
                ? '🎉 Booking berhasil! Kami akan menghubungi Anda.'
                : '📧 Pesan terkirim! Kami akan membalas segera.';
                
            showNotification(message, 'success');
            form.reset();
            resolve();
        }, 1500);
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) notification.remove();
    }, 4000);
}

// ===== KEYBOARD HANDLING =====
function handleKeydown(e) {
    if (e.key === 'Escape' && state.isModalOpen) {
        closeModal();
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', init);

// ===== DYNAMIC STYLES =====
const dynamicStyles = `
.notification {
    position: fixed; top: 80px; right: 20px;
    background: white; border-left: 4px solid #2c7873;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-radius: 6px; z-index: 10000;
    max-width: 300px; animation: slideIn 0.3s ease;
}
.notification-content {
    padding: 12px; display: flex;
    align-items: center; justify-content: space-between;
}
.field-error {
    color: #e53e3e; font-size: 0.8rem;
    margin-top: 4px;
}
.form-input.error {
    border-color: #e53e3e;
}
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
.fade-in {
    animation: fadeIn 0.6s ease;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

// Inject styles
const style = document.createElement('style');
style.textContent = dynamicStyles;
document.head.appendChild(style);