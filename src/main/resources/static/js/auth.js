// Authentication utilities and helpers

class AuthManager {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = this.getStoredUser();
    }

    getStoredUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    isAuthenticated() {
        return this.token && this.user;
    }

    isJobSeeker() {
        return this.user && this.user.role === 'JOB_SEEKER';
    }

    isRecruiter() {
        return this.user && this.user.role === 'RECRUITER';
    }

    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    login(token, userData) {
        this.token = token;
        this.user = userData;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }

    updateUser(userData) {
        this.user = userData;
        localStorage.setItem('userData', JSON.stringify(userData));
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Route protection
function requireAuth() {
    if (!authManager.isAuthenticated()) {
        showToast('Error', 'Please login to access this feature', 'error');
        showLogin();
        return false;
    }
    return true;
}

function requireJobSeeker() {
    if (!requireAuth()) return false;
    
    if (!authManager.isJobSeeker()) {
        showToast('Error', 'This feature is only available for job seekers', 'error');
        return false;
    }
    return true;
}

function requireRecruiter() {
    if (!requireAuth()) return false;
    
    if (!authManager.isRecruiter()) {
        showToast('Error', 'This feature is only available for recruiters', 'error');
        return false;
    }
    return true;
}

// Password validation
function validatePassword(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long`);
    }
    
    if (!hasUpperCase) {
        errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!hasLowerCase) {
        errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!hasNumbers) {
        errors.push('Password must contain at least one number');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form validation helpers
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const existingError = field.parentNode.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-danger small mt-1';
    errorDiv.textContent = message;
    
    field.classList.add('is-invalid');
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const existingError = field.parentNode.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.remove('is-invalid');
}

function clearAllFieldErrors(formId) {
    const form = document.getElementById(formId);
    const errors = form.querySelectorAll('.field-error');
    const invalidFields = form.querySelectorAll('.is-invalid');
    
    errors.forEach(error => error.remove());
    invalidFields.forEach(field => field.classList.remove('is-invalid'));
}

// Session management
function checkSession() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        try {
            const user = JSON.parse(userData);
            // In a real app, you would validate the token with the server
            return { token, user };
        } catch (error) {
            console.error('Invalid user data in localStorage:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
        }
    }
    
    return null;
}

// Auto-logout on token expiration (if using JWT)
function setupAutoLogout() {
    const token = localStorage.getItem('authToken');
    
    if (token && token !== 'dummy-token') {
        try {
            // Decode JWT token to get expiration time
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();
            
            if (expirationTime <= currentTime) {
                // Token has expired
                authManager.logout();
                showToast('Session Expired', 'Please login again', 'warning');
                updateNavigation(false);
                showHome();
            } else {
                // Set timeout to auto-logout when token expires
                const timeUntilExpiration = expirationTime - currentTime;
                setTimeout(() => {
                    authManager.logout();
                    showToast('Session Expired', 'Please login again', 'warning');
                    updateNavigation(false);
                    showHome();
                }, timeUntilExpiration);
            }
        } catch (error) {
            console.error('Error parsing JWT token:', error);
        }
    }
}

// Initialize session check on page load
document.addEventListener('DOMContentLoaded', function() {
    const session = checkSession();
    if (session) {
        authManager.login(session.token, session.user);
        updateNavigation(true);
    }
    
    // Setup auto-logout if using real JWT tokens
    setupAutoLogout();
});