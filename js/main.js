/**
 * Main JavaScript file for CampusConnect
 * Contains common functionality used across the application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dropdowns
    initializeDropdowns();
    
    // Initialize mobile menu toggle
    initializeMobileMenu();
    
    // Password toggle visibility
    initializePasswordToggles();
});

/**
 * Initialize dropdown menus
 */
function initializeDropdowns() {
    const dropdownTriggers = document.querySelectorAll('.profile-btn, .notification-btn');
    
    dropdownTriggers.forEach(trigger => {
        const dropdown = trigger.nextElementSibling;
        
        if (dropdown && dropdown.classList.contains('dropdown')) {
            // Show dropdown on click
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const isVisible = dropdown.style.display === 'block';
                
                // Close all dropdowns first
                document.querySelectorAll('.dropdown').forEach(d => {
                    d.style.display = 'none';
                });
                
                // Toggle this dropdown
                dropdown.style.display = isVisible ? 'none' : 'block';
            });
        }
    });
    
    // Close all dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    });
    
    // Prevent dropdown from closing when clicking inside it
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
            
            if (authButtons) {
                authButtons.style.display = authButtons.style.display === 'flex' ? 'none' : 'flex';
            }
        });
    }
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(inputId = 'password') {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.querySelector(`#${inputId} + .password-toggle i`);
    
    if (passwordInput && toggleIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }
}

/**
 * Initialize password visibility toggles
 */
function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Create element with attributes and children
 * @param {String} tag - The tag name
 * @param {Object} attributes - Element attributes
 * @param {Array|String|Node} children - Child elements
 * @returns {HTMLElement}
 */
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.entries(value).forEach(([prop, val]) => {
                element.style[prop] = val;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Append children
    if (Array.isArray(children)) {
        children.forEach(child => {
            if (child) {
                appendChild(element, child);
            }
        });
    } else if (children) {
        appendChild(element, children);
    }
    
    return element;
}

/**
 * Append a child to an element
 * @param {HTMLElement} element - The parent element
 * @param {String|Node} child - The child to append
 */
function appendChild(element, child) {
    if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
        element.appendChild(child);
    }
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {Date|String} date - The date to format
 * @returns {String} Formatted relative time
 */
function formatRelativeTime(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    const diffWeek = Math.round(diffDay / 7);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);
    
    if (diffSec < 60) {
        return 'just now';
    } else if (diffMin < 60) {
        return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHour < 24) {
        return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDay < 7) {
        return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
    } else if (diffWeek < 4) {
        return `${diffWeek} ${diffWeek === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffMonth < 12) {
        return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;
    } else {
        return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
    }
}

/**
 * Show toast notification
 * @param {String} message - The message to display
 * @param {String} type - The notification type (success, error, warning, info)
 * @param {Number} duration - How long to show the toast (in ms)
 */
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = createElement('div', { className: 'toast-container' });
        document.body.appendChild(toastContainer);
        
        // Add styles if not already defined in CSS
        const style = document.createElement('style');
        style.textContent = `
            .toast-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
            }
            .toast {
                padding: 12px 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                color: white;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                min-width: 250px;
                max-width: 450px;
                animation: slideIn 0.3s, fadeOut 0.5s ${duration/1000 - 0.5}s forwards;
            }
            .toast i {
                margin-right: 10px;
                font-size: 18px;
            }
            .toast-success { background-color: var(--success-color, #0CAA6E); }
            .toast-error { background-color: var(--danger-color, #E16745); }
            .toast-warning { background-color: var(--warning-color, #F7C833); }
            .toast-info { background-color: var(--primary-color, #0A66C2); }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create toast element
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const toast = createElement('div', { className: `toast toast-${type}` }, [
        createElement('i', { className: iconMap[type] || iconMap.info }),
        message
    ]);
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.remove();
    }, duration);
} 