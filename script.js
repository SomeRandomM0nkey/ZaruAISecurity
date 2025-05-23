// Initialize AOS (Animate On Scroll) library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        easing: 'ease-out-cubic'
    });
});

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'hsl(0 0% 100% / 0.98)';
        navbar.style.boxShadow = '0 2px 10px hsl(220 13% 18% / 0.1)';
    } else {
        navbar.style.backgroundColor = 'hsl(0 0% 100% / 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form validation and submission
const waitlistForm = document.getElementById('waitlist-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateName(name) {
    return name.trim().length >= 2 && /^[a-zA-Z\s-']+$/.test(name.trim());
}

function validateRequired(value) {
    return value.trim().length > 0;
}

// Show error message
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    errorElement.textContent = message;
    inputElement.style.borderColor = '#dc3545';
    inputElement.setAttribute('aria-invalid', 'true');
}

// Clear error message
function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    errorElement.textContent = '';
    inputElement.style.borderColor = 'hsl(220 13% 91%)';
    inputElement.removeAttribute('aria-invalid');
}

// Real-time validation
document.querySelectorAll('#waitlist-form input, #waitlist-form select').forEach(field => {
    field.addEventListener('blur', function() {
        validateField(this.id, this.value);
    });
    
    field.addEventListener('input', function() {
        // Clear error on input if there was one
        const errorElement = document.getElementById(`${this.id}-error`);
        if (errorElement.textContent) {
            clearError(this.id);
        }
    });
});

// Individual field validation
function validateField(fieldId, value) {
    let isValid = true;
    
    switch (fieldId) {
        case 'firstName':
            if (!validateRequired(value)) {
                showError(fieldId, 'First name is required');
                isValid = false;
            } else if (!validateName(value)) {
                showError(fieldId, 'Please enter a valid first name');
                isValid = false;
            } else {
                clearError(fieldId);
            }
            break;
            
        case 'lastName':
            if (!validateRequired(value)) {
                showError(fieldId, 'Last name is required');
                isValid = false;
            } else if (!validateName(value)) {
                showError(fieldId, 'Please enter a valid last name');
                isValid = false;
            } else {
                clearError(fieldId);
            }
            break;
            
        case 'email':
            if (!validateRequired(value)) {
                showError(fieldId, 'Email address is required');
                isValid = false;
            } else if (!validateEmail(value)) {
                showError(fieldId, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(fieldId);
            }
            break;
            
        case 'role':
            if (!validateRequired(value)) {
                showError(fieldId, 'Please select your role');
                isValid = false;
            } else {
                clearError(fieldId);
            }
            break;
            
        case 'school':
            if (!validateRequired(value)) {
                showError(fieldId, 'School/Organization is required');
                isValid = false;
            } else if (value.trim().length < 2) {
                showError(fieldId, 'Please enter a valid school/organization name');
                isValid = false;
            } else {
                clearError(fieldId);
            }
            break;
    }
    
    return isValid;
}

// Form submission
waitlistForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        role: formData.get('role'),
        school: formData.get('school')
    };
    
    // Validate all fields
    let isFormValid = true;
    Object.keys(data).forEach(key => {
        if (!validateField(key, data[key])) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        // Focus on first error field
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            const fieldId = firstError.id.replace('-error', '');
            document.getElementById(fieldId).focus();
        }
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    try {
        // Simulate API call (replace with actual API endpoint)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success - show modal and reset form
        showSuccessModal();
        waitlistForm.reset();
        
        // Clear any remaining error states
        document.querySelectorAll('#waitlist-form input, #waitlist-form select').forEach(field => {
            clearError(field.id);
        });
        
        // Analytics tracking (if needed)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'waitlist_signup', {
                'event_category': 'engagement',
                'event_label': data.role,
                'value': 1
            });
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error submitting your information. Please try again.');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
});

// Success modal functionality
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus on the modal for accessibility
    const modalContent = modal.querySelector('.modal-content');
    modalContent.focus();
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Intersection Observer for navbar highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentSection = entry.target.getAttribute('id');
            
            // Remove active class from all nav links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current section's nav link
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Tab navigation for mobile menu
    if (e.key === 'Tab' && navMenu.classList.contains('active')) {
        const focusableElements = navMenu.querySelectorAll('a[href]');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'hsl(0 0% 100% / 0.98)';
        navbar.style.boxShadow = '0 2px 10px hsl(220 13% 18% / 0.1)';
    } else {
        navbar.style.backgroundColor = 'hsl(0 0% 100% / 0.95)';
        navbar.style.boxShadow = 'none';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Form auto-save to localStorage (optional)
function saveFormData() {
    const formData = new FormData(waitlistForm);
    const data = Object.fromEntries(formData.entries());
    localStorage.setItem('zaruai-waitlist-form', JSON.stringify(data));
}

function loadFormData() {
    const savedData = localStorage.getItem('zaruai-waitlist-form');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = document.getElementById(key);
                if (field && data[key]) {
                    field.value = data[key];
                }
            });
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
    }
}

// Auto-save form data on input
waitlistForm.addEventListener('input', debounce(saveFormData, 500));

// Load saved form data on page load
document.addEventListener('DOMContentLoaded', loadFormData);

// Clear saved form data on successful submission
function clearSavedFormData() {
    localStorage.removeItem('zaruai-waitlist-form');
}

// Add to success handling
const originalShowSuccessModal = showSuccessModal;
showSuccessModal = function() {
    clearSavedFormData();
    originalShowSuccessModal();
};

// Error handling for network issues
window.addEventListener('online', function() {
    console.log('Network connection restored');
});

window.addEventListener('offline', function() {
    console.log('Network connection lost');
    // Could show a notification to users about offline status
});

// Lazy loading for better performance (if images were present)
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Console welcome message for developers
console.log(`
🎓 Welcome to ZaruAI! 

We're building the future of safe AI in education.
Interested in joining our team? Check out our careers page!

Built with ❤️ for educators and students everywhere.
`);
