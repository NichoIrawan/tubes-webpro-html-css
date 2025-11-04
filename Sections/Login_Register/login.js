let validUsers = [];

// Function Fetch Users
async function fetchUsers() {
    try {
        const response = await fetch('../../data/user.json');
        if (!response.ok) {
            throw new Error('Failed to fetch users data');
        }
        const data = await response.json();
        validUsers = data.users;
    } catch (error) {
        console.error('Error loading users:', error);
        validUsers = [
            {
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                email: 'user@example.com',
                password: 'user123',
                role: 'user'
            }
        ];
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Load users data when the page loads
    await fetchUsers();
    
    const loginForm = document.querySelector('.login-form form');
    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');
    const continueBtn = loginForm.querySelector('.continue-btn');
    const rememberMe = loginForm.querySelector('input[type="checkbox"]');

    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
    }

    continueBtn.addEventListener('click', handleLogin);
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    function handleLogin() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }

        // User Authentication
        const user = validUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            if (rememberMe.checked) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userRole', user.role);
            sessionStorage.setItem('userEmail', user.email);

            // Redirect based on role
            console.log('Login successful, redirecting...', user.role);
            const relativePath = user.role === 'admin' ? '../Admin/page.html' : '../Home/page.html';
            window.location.href = relativePath;
        } else {
            showError('Invalid email or password');
        }
    }

    // Error Message 
    function showError(message) {
        let errorDiv = loginForm.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv.className = 'error-message';
            errorDiv.style.color = 'red';
            errorDiv.style.marginBottom = '10px';
            errorDiv.style.fontSize = '14px';
            loginForm.insertBefore(errorDiv, continueBtn);
        }
        errorDiv.textContent = message;

        setTimeout(() => {
            errorDiv.textContent = '';
        }, 3000);
    }

    // Sign Up
    const signupLink = document.querySelector('.signup-link');
    signupLink.addEventListener('click', () => {
        window.location.href = 'register.html';
    });

    // Forgot Password
    const forgotLink = document.querySelector('.forgot');
    forgotLink.addEventListener('click', () => {
        alert('Forgot password functionality will be implemented soon!');
    });

    // Social Media Login
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');

    googleBtn.addEventListener('click', () => {
        alert('Google login will be implemented soon!');
    });

    facebookBtn.addEventListener('click', () => {
        alert('Facebook login will be implemented soon!');
    });
});
