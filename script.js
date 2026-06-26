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
    const opinionForm = document.getElementById('opinion-form');

    // Secure Verification Map Registry
    const CREDENTIALS_REGISTRY = {
        'admin': { password: 'adminpassword', role: 'Admin', name: 'System Administrator (You)' },
        'user1': { password: 'userpassword', role: 'User', name: 'Standard Portal User' }
    };

    // 1. AUTHENTICATION CONTROLLER (Updated Privilege Check)
    function checkAuthState() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const savedRole = localStorage.getItem('userRole');
        const savedName = localStorage.getItem('userDisplayName');

        if (isLoggedIn === 'true') {
            if (authScreen) authScreen.style.setProperty('display', 'none', 'important');
            if (appScreen) appScreen.style.display = 'flex';
            if (userDisplayName) userDisplayName.textContent = savedName || 'User Portal';
            
            // Target all administrative components
            const adminButtons = document.querySelectorAll('.admin-action-btn');

            if (savedRole === 'Admin') {
                if (portalRoleBadge) {
                    portalRoleBadge.textContent = 'Admin Mode';
                    portalRoleBadge.style.color = '#ef4444';
                }
                if (adminOnlyPanel) adminOnlyPanel.style.display = 'block';
                
                // FORCE SHOW action buttons ONLY for Admin
                adminButtons.forEach(btn => {
                    btn.style.setProperty('display', 'inline-block', 'important');
                });
            } else {
                // FORCE LOCKDOWN for standard users
                if (portalRoleBadge) {
                    portalRoleBadge.textContent = 'User View (Read-Only)';
                    portalRoleBadge.style.color = '#3b82f6';
                }
                if (adminOnlyPanel) adminOnlyPanel.style.display = 'none';
                
                // Force hide modifying buttons completely from standard users
                adminButtons.forEach(btn => {
                    btn.style.setProperty('display', 'none', 'important');
                });
            }

            handleRouting(); 
        } else {
            if (authScreen) authScreen.style.setProperty('display', 'flex', 'important');
            if (appScreen) appScreen.style.display = 'none';
            if (window.location.hash !== '') {
                window.location.hash = ''; 
            }
        }
    }

    // OPINION FORM SUBMISSION LOGIC
    if (opinionForm) {
        opinionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const opinionText = document.getElementById('user-opinion-text').value;
            alert(`Opinion received successfully!\n"${opinionText}"\nSaved to system dashboard logs.`);
            document.getElementById('user-opinion-text').value = '';
        });
    }

    // SEARCH FILTER LOGIC (AI Directory Component Filtering)
    const searchInput = document.getElementById('directory-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.tool-card');
            cards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const text = card.querySelector('p').textContent.toLowerCase();
                if (title.includes(term) || text.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear(); 
            checkAuthState();
        });
    }

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