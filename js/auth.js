/**
 * Authentication related JavaScript for CampusConnect
 * Handles sign in and sign up functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sign-in form validation
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        initializeSignInForm(signinForm);
    }
    
    // Initialize sign-up form validation
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        initializeSignUpForm(signupForm);
    }
    
    // Initialize password strength meter
    const passwordInput = document.getElementById('password');
    if (passwordInput && document.getElementById('password-strength')) {
        initializePasswordStrengthMeter(passwordInput);
    }
    
    // Initialize skills tags input
    const skillsInput = document.getElementById('skills');
    if (skillsInput && document.getElementById('selected-skills')) {
        initializeSkillsTags(skillsInput);
    }
});

/**
 * Initialize Sign In Form Validation
 * @param {HTMLFormElement} form - The sign-in form element
 */
function initializeSignInForm(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form inputs
        const email = form.querySelector('#email').value.trim();
        const password = form.querySelector('#password').value.trim();
        const remember = form.querySelector('#remember')?.checked || false;
        
        // Reset error messages
        clearErrors(form);
        
        // Validate email
        if (!email) {
            showError('email-error', 'Email is required');
            return;
        } else if (!isValidEmail(email)) {
            showError('email-error', 'Please enter a valid email');
            return;
        }
        
        // Validate password
        if (!password) {
            showError('password-error', 'Password is required');
            return;
        }
        
        // For demonstration purposes, we'll simulate a successful login
        // In a real application, this would be an API call to authenticate
        simulateAuth(email, password, 'signin')
            .then(response => {
                if (response.success) {
                    // Store user session if remember me is checked
                    if (remember) {
                        localStorage.setItem('userEmail', email);
                    } else {
                        sessionStorage.setItem('userEmail', email);
                    }
                    
                    // Redirect to home page
                    window.location.href = 'home.html';
                } else {
                    // Show error message
                    showError('password-error', response.message);
                }
            });
    });
}

/**
 * Initialize Sign Up Form Validation
 * @param {HTMLFormElement} form - The sign-up form element
 */
function initializeSignUpForm(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form inputs
        const firstName = form.querySelector('#firstname').value.trim();
        const lastName = form.querySelector('#lastname').value.trim();
        const email = form.querySelector('#email').value.trim();
        const branch = form.querySelector('#branch').value;
        const year = form.querySelector('#year').value;
        const password = form.querySelector('#password').value.trim();
        const confirmPassword = form.querySelector('#confirm-password').value.trim();
        const termsAccepted = form.querySelector('#terms')?.checked || false;
        
        // Reset error messages
        clearErrors(form);
        
        // Validate first name
        if (!firstName) {
            showError('firstname-error', 'First name is required');
            return;
        }
        
        // Validate last name
        if (!lastName) {
            showError('lastname-error', 'Last name is required');
            return;
        }
        
        // Validate email
        if (!email) {
            showError('email-error', 'Email is required');
            return;
        } else if (!isValidEmail(email)) {
            showError('email-error', 'Please enter a valid email');
            return;
        }
        
        // Validate branch
        if (!branch) {
            showError('branch-error', 'Please select your branch');
            return;
        }
        
        // Validate year
        if (!year) {
            showError('year-error', 'Please select your year');
            return;
        }
        
        // Validate password
        if (!password) {
            showError('password-error', 'Password is required');
            return;
        } else if (password.length < 8) {
            showError('password-error', 'Password must be at least 8 characters long');
            return;
        } else if (!isStrongPassword(password)) {
            showError('password-error', 'Password must include uppercase, lowercase, number, and special character');
            return;
        }
        
        // Validate confirm password
        if (!confirmPassword) {
            showError('confirm-password-error', 'Please confirm your password');
            return;
        } else if (password !== confirmPassword) {
            showError('confirm-password-error', 'Passwords do not match');
            return;
        }
        
        // Validate terms acceptance
        if (!termsAccepted) {
            showError('terms-error', 'You must accept the terms and conditions');
            return;
        }
        
        // For demonstration purposes, we'll simulate a successful registration
        // In a real application, this would be an API call to register the user
        simulateAuth(email, password, 'signup', { firstName, lastName, branch, year })
            .then(response => {
                if (response.success) {
                    // Store user session
                    sessionStorage.setItem('userEmail', email);
                    sessionStorage.setItem('userName', `${firstName} ${lastName}`);
                    
                    // Redirect to home page
                    window.location.href = 'home.html';
                } else {
                    // Show error message
                    showError('email-error', response.message);
                }
            });
    });
}

/**
 * Initialize Password Strength Meter
 * @param {HTMLInputElement} passwordInput - The password input element
 */
function initializePasswordStrengthMeter(passwordInput) {
    const strengthMeter = document.getElementById('password-strength');
    const strengthBar = strengthMeter.querySelector('.strength-bar');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Reset strength classes
        strengthMeter.className = 'password-strength';
        
        if (password.length === 0) {
            strengthBar.style.width = '0';
            return;
        }
        
        // Calculate password strength
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Update strength bar
        if (strength <= 2) {
            strengthBar.style.width = '33%';
            strengthBar.style.backgroundColor = 'var(--danger-color)';
            strengthMeter.classList.add('strength-weak');
        } else if (strength <= 4) {
            strengthBar.style.width = '66%';
            strengthBar.style.backgroundColor = 'var(--warning-color)';
            strengthMeter.classList.add('strength-medium');
        } else {
            strengthBar.style.width = '100%';
            strengthBar.style.backgroundColor = 'var(--success-color)';
            strengthMeter.classList.add('strength-strong');
        }
    });
}

/**
 * Initialize Skills Tags Input
 * @param {HTMLInputElement} input - The skills input element
 */
function initializeSkillsTags(input) {
    const selectedSkills = document.getElementById('selected-skills');
    const skills = new Set();
    
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            
            const skill = this.value.trim().replace(/,/g, '');
            
            if (skill && !skills.has(skill)) {
                // Add skill to set
                skills.add(skill);
                
                // Create skill tag element
                const tagElement = createElement('div', { className: 'skill-tag' }, [
                    skill,
                    createElement('span', { 
                        className: 'remove-tag',
                        onclick: function() {
                            skills.delete(skill);
                            this.parentElement.remove();
                        }
                    }, '×')
                ]);
                
                // Add to selected skills container
                selectedSkills.appendChild(tagElement);
                
                // Clear input
                this.value = '';
            }
        }
    });
    
    // Also add skill when input loses focus
    input.addEventListener('blur', function() {
        const skill = this.value.trim().replace(/,/g, '');
        
        if (skill && !skills.has(skill)) {
            // Add skill to set
            skills.add(skill);
            
            // Create skill tag element
            const tagElement = createElement('div', { className: 'skill-tag' }, [
                skill,
                createElement('span', { 
                    className: 'remove-tag',
                    onclick: function() {
                        skills.delete(skill);
                        this.parentElement.remove();
                    }
                }, '×')
            ]);
            
            // Add to selected skills container
            selectedSkills.appendChild(tagElement);
            
            // Clear input
            this.value = '';
        }
    });
}

/**
 * Show error message
 * @param {String} elementId - The ID of the error element
 * @param {String} message - The error message to display
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Add error class to the parent form group
        const formGroup = errorElement.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('has-error');
        }
    }
}

/**
 * Clear all form errors
 * @param {HTMLElement} form - The form element
 */
function clearErrors(form) {
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
        
        // Remove error class from parent form group
        const formGroup = error.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('has-error');
        }
    });
}

/**
 * Validate email format
 * @param {String} email - The email to validate
 * @returns {Boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check if password is strong
 * @param {String} password - The password to check
 * @returns {Boolean} Whether the password is strong
 */
function isStrongPassword(password) {
    // Must contain at least one uppercase letter, one lowercase letter,
    // one number, and one special character
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    return strongRegex.test(password);
}

/**
 * Simulate authentication (for demo purposes)
 * @param {String} email - The user's email
 * @param {String} password - The user's password
 * @param {String} type - The authentication type ('signin' or 'signup')
 * @param {Object} userData - Additional user data for signup
 * @returns {Promise} Promise resolving to response object
 */
function simulateAuth(email, password, type, userData = {}) {
    return new Promise(resolve => {
        // Simulate network request
        setTimeout(() => {
            if (type === 'signin') {
                // For demo purposes, accept any @college.edu email with password "Password1!"
                if (email.endsWith('@college.edu') && password === 'Password1!') {
                    resolve({
                        success: true,
                        message: 'Authentication successful'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid email or password'
                    });
                }
            } else if (type === 'signup') {
                // For demo purposes, simulate successful registration
                // In real app, we would check if email already exists, etc.
                resolve({
                    success: true,
                    message: 'Registration successful',
                    user: {
                        email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        branch: userData.branch,
                        year: userData.year
                    }
                });
            }
        }, 1000);
    });
} 