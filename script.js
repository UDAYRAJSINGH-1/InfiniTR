// Infinitr AI Tracking Website - JavaScript
document.addEventListener('DOMContentLoaded', () => {
    
    // Select DOM nodes
    const authScreen = document.getElementById('auth-screen');
    const appScreen = document.getElementById('app-screen');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const authError = document.getElementById('auth-error');
    const userDisplayName = document.getElementById('user-display-name');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.app-section');
    
    // Role-based elements
    const portalRoleBadge = document.getElementById('portal-role-badge');
    const adminOnlyPanel = document.getElementById('admin-only-panel');

    // Hardcoded Local Credentials Registry
    const CREDENTIALS_REGISTRY = {
        'admin': { password: 'adminpassword', role: 'Admin', name: 'System Administrator' },
        'user1': { password: 'userpassword', role: 'User', name: 'Standard Portal User' }
    };

    // 1. AUTHENTICATION CONTROLLER
    function checkAuthState() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const savedRole = localStorage.getItem('userRole');
        const savedName = localStorage.getItem('userDisplayName');

        if (isLoggedIn === 'true') {
            authScreen.style.display = 'none';
            appScreen.style.display = 'flex';
            userDisplayName.textContent = savedName || 'User Portal';
            
            // Adjust interface permissions dynamically based on active account role
            if (savedRole === 'Admin') {
                portalRoleBadge.textContent = 'Admin Mode';
                portalRoleBadge.style.color = '#ef4444';
                if (adminOnlyPanel) adminOnlyPanel.style.display = 'block';
            } else {
                portalRoleBadge.textContent = 'User View';
                portalRoleBadge.style.color = '#3b82f6';
                if (adminOnlyPanel) adminOnlyPanel.style.display = 'none';
            }

            handleRouting(); // run router logic when entering app
        } else {
            authScreen.style.display = 'flex';
            appScreen.style.display = 'none';
            window.location.hash = ''; // Force login isolation boundary
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value.trim().toLowerCase();
        const passwordInput = document.getElementById('password').value;
        
        // Match credentials against local mock registry
        const accountFound = CREDENTIALS_REGISTRY[usernameInput];

        if (accountFound && accountFound.password === passwordInput) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', accountFound.role);
            localStorage.setItem('userDisplayName', accountFound.name);
            authError.style.display = 'none';
            
            // Clear inputs safely
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            
            checkAuthState();
            window.location.hash = '#dashboard'; // redirect into app workspace
        } else {
            authError.textContent = "Invalid username or password. Check credentials registry configuration.";
            authError.style.display = 'block';
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.clear(); // Clear all auth data keys safely
        checkAuthState();
    });


    // 2. Client Side Hash Routing System
    function handleRouting() {
        if (localStorage.getItem('isLoggedIn') !== 'true') return;

        let currentHash = window.location.hash;
        
        if (!currentHash || currentHash === '#') {
            currentHash = '#dashboard';
        }

        sections.forEach(sec => sec.style.display = 'none');
        navLinks.forEach(link => link.classList.remove('active'));

        const targetLink = document.querySelector(`.nav-link[href="${currentHash}"]`);
        
        if (targetLink) {
            targetLink.classList.add('active');
            const targetViewId = targetLink.getAttribute('data-target');
            const targetSection = document.getElementById(targetViewId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        } else {
            const defaultDashboard = document.getElementById('dashboard-view');
            if (defaultDashboard) defaultDashboard.style.display = 'block';
            const dashLink = document.querySelector('.nav-link[href="#dashboard"]');
            if (dashLink) dashLink.classList.add('active');
        }
    }

    window.addEventListener('hashchange', handleRouting);
    checkAuthState();
});