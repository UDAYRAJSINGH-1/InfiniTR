// Infinitr AI Tracking Website - JavaScript
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // ⚙️ CLOUD DATABASE CONFIGURATION
    // ==========================================
    // PLACE YOUR ACTUAL SUPABASE KEYS HERE
    const SUPABASE_URL = "https://bdthpyarytpqeohxjtwl.supabase.co"; 
    const SUPABASE_KEY = "sb_publishable_xxyOIvtN9Gpj0ZjxC2wLHw_9yWhvXdx";          

    const authScreen = document.getElementById('auth-screen');
    const appScreen = document.getElementById('app-screen');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const authError = document.getElementById('auth-error');
    const userDisplayName = document.getElementById('user-display-name');
    const userRoleSub = document.getElementById('user-role-sub');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.app-section');
    
    const portalRoleBadge = document.getElementById('portal-role-badge');
    const adminOnlyPanel = document.getElementById('admin-only-panel');
    const opinionForm = document.getElementById('opinion-form');
    
    const statsQueriesCount = document.getElementById('stats-queries-count');
    const statsFeedbackCount = document.getElementById('stats-feedback-count');

    // Hardcoded Verification Credentials Matrix
    const CREDENTIALS_REGISTRY = {
        'admin': { password: 'adminpassword', role: 'Admin', name: 'Udayraj Singh' },
        'user1': { password: 'userpassword', role: 'User', name: 'Standard Auditor' }
    };

    // Internet Search Cloud Simulation Data Matrix Dictionary
    const INTERNET_SEARCH_MOCK_DATABASE = [
        { title: "AI Ecosystem Growth Trends 2026", snippet: "Recent documentation analytics indicate a massive migration towards localized web application pipelines and subfolder static hosts.", category: "AI" },
        { title: "GitHub Static Pages Security Protocols", snippet: "Single page architectures deploying strict CSS parameters prevent client-side authorization leakage on public networks.", category: "system" },
        { title: "Open Source Language Models", snippet: "Free model clusters offer text automation and translation libraries without relying on expensive remote APIs.", category: "news" },
        { title: "System Dashboard Integration Guide", snippet: "How to bind localStorage states to capture user interaction lists dynamically without dedicated database instances.", category: "system" }
    ];

    // 1. DATA INFRASTRUCTURE ARCHITECTURE LOGIC (HYBRID CLOUD FRAMEWORK)
    function initializeDatabaseState() {
        if (!localStorage.getItem('database_query_clicks')) {
            localStorage.setItem('database_query_clicks', '1420');
        }
        renderLedgerMetrics();
        fetchLiveOpinionsTimeline(); // Automatically load live timeline stream on boot
    }

    async function renderLedgerMetrics() {
        const totalClicks = localStorage.getItem('database_query_clicks') || '1420';
        if (statsQueriesCount) statsQueriesCount.textContent = totalClicks;

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/user_opinions?select=id`, {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (statsFeedbackCount) statsFeedbackCount.textContent = data.length;
            }
        } catch (err) {
            console.error("Failed to fetch cloud counter snapshot:", err);
        }
    }

    // 🔄 NEW: FETCH & RENDER LIVE TIMELINE DATA FROM SUPABASE
    async function fetchLiveOpinionsTimeline() {
        const timelineContainer = document.getElementById('opinions-timeline-container');
        if (!timelineContainer) return;

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/user_opinions?select=*&order=created_at.desc`, {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.length === 0) {
                    timelineContainer.innerHTML = `<p style="color: var(--text-secondary); font-style: italic; padding: 1rem;">No data records found inside live cloud tables.</p>`;
                    return;
                }

                timelineContainer.innerHTML = data.map(item => {
                    const formattedDate = new Date(item.created_at).toLocaleString();
                    return `
                        <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 6px; margin-bottom: 0.75rem; border-left: 3px solid var(--accent); transition: 0.2s;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                                <strong style="color: white; font-size: 0.95rem;">${item.display_name} <span style="font-weight: normal; color: var(--text-secondary); font-size: 0.8rem;">(@${item.username})</span></strong>
                                <small style="color: var(--text-secondary); font-size: 0.75rem;">${formattedDate}</small>
                            </div>
                            <p style="color: #e2e8f0; font-size: 0.9rem; line-height: 1.4; margin: 0;">${item.content}</p>
                        </div>
                    `;
                }).join('');
            }
        } catch (err) {
            console.error("Failed syncing cloud live datastream feed:", err);
            timelineContainer.innerHTML = `<p style="color: #ef4444; font-size: 0.85rem; padding: 1rem;">Network interface link offline.</p>`;
        }
    }

    // 2. PRIVILEGE VERIFICATION ENGINE
    function checkAuthState() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const savedRole = localStorage.getItem('userRole');
        const savedName = localStorage.getItem('userDisplayName');

        if (isLoggedIn === 'true') {
            if (authScreen) authScreen.style.setProperty('display', 'none', 'important');
            if (appScreen) appScreen.style.display = 'flex';
            if (userDisplayName) userDisplayName.textContent = savedName;
            if (userRoleSub) userRoleSub.textContent = savedRole + " Security Clearance";
            
            const adminButtons = document.querySelectorAll('.admin-action-btn');

            if (savedRole === 'Admin') {
                if (portalRoleBadge) {
                    portalRoleBadge.textContent = 'Root Admin Mode';
                    portalRoleBadge.style.color = '#ef4444';
                }
                if (adminOnlyPanel) adminOnlyPanel.style.setProperty('display', 'block', 'important');
                
                adminButtons.forEach(btn => {
                    btn.style.setProperty('display', 'inline-block', 'important');
                });
            } else {
                if (portalRoleBadge) {
                    portalRoleBadge.textContent = 'User Space (Read-Only Terminal)';
                    portalRoleBadge.style.color = '#3b82f6';
                }
                if (adminOnlyPanel) adminOnlyPanel.style.setProperty('display', 'none', 'important');
                
                adminButtons.forEach(btn => {
                    btn.style.setProperty('display', 'none', 'important');
                });
            }

            renderLedgerMetrics();
            fetchLiveOpinionsTimeline(); // Sync fresh records upon view entrance
            handleRouting(); 
        } else {
            if (authScreen) authScreen.style.setProperty('display', 'flex', 'important');
            if (appScreen) appScreen.style.display = 'none';
            if (!window.location.hash.includes('')) {
                window.location.hash = ''; 
            }
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username').value.trim().toLowerCase();
            const passwordInput = document.getElementById('password').value;
            
            const accountFound = CREDENTIALS_REGISTRY[usernameInput];

            if (accountFound && accountFound.password === passwordInput) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', accountFound.role);
                localStorage.setItem('userDisplayName', accountFound.name);
                localStorage.setItem('userRawUsername', usernameInput);
                
                if (authError) authError.style.display = 'none';
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                
                checkAuthState();
                window.location.hash = '#dashboard'; 
            } else {
                if (authError) {
                    authError.textContent = "Access Denied. Check credentials registry mapping.";
                    authError.style.display = 'block';
                }
            }
        });
    }

    // 🌐 USER FEEDBACK CLOUD ENGINE SUBMISSION
    if (opinionForm) {
        opinionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const textarea = document.getElementById('user-opinion-text');
            const newOpinion = textarea.value.trim();
            if(!newOpinion) return;
            
            const payload = {
                username: localStorage.getItem('userRawUsername') || 'anonymous',
                display_name: localStorage.getItem('userDisplayName') || 'Anonymous',
                content: newOpinion
            };

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/user_opinions`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    textarea.value = '';
                    renderLedgerMetrics();
                    fetchLiveOpinionsTimeline(); // Re-render feed items dynamically without alerts
                } else {
                    alert("Cloud rejected request. Verify your database connection keys.");
                }
            } catch (err) {
                console.error("Network interface error:", err);
            }
        });
    }

    // ADMINISTRATIVE TOOL CHAIN ASSIGNMENTS
    const adminFlushBtn = document.getElementById('admin-flush-btn');
    if (adminFlushBtn) {
        adminFlushBtn.addEventListener('click', async () => {
            if (confirm("Are you sure you want to drop all cloud database feedback records?")) {
                try {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/user_opinions?id=neq.0`, {
                        method: 'DELETE',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`
                        }
                    });
                    if (response.ok) {
                        localStorage.setItem('database_query_clicks', '1420');
                        renderLedgerMetrics();
                        fetchLiveOpinionsTimeline();
                    }
                } catch (err) {
                    console.error("Administrative purge execution dropped:", err);
                }
            }
        });
    }

    const adminLogBtn = document.getElementById('admin-log-btn');
    if (adminLogBtn) {
        adminLogBtn.addEventListener('click', () => {
            fetchLiveOpinionsTimeline();
        });
    }

    // 3. GLOBAL MATRIX SEARCH SYSTEM & WEB CRAWLER SIMULATOR
    const globalSearchBar = document.getElementById('global-search-bar');
    const webSearchBox = document.getElementById('web-search-results-box');
    const searchResultsContainer = document.getElementById('search-results-output-container');

    if (globalSearchBar) {
        globalSearchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.tool-card');
            
            if (term === "") {
                if (webSearchBox) webSearchBox.style.display = "none";
                cards.forEach(card => card.style.display = "block");
                return;
            }

            cards.forEach(card => {
                const searchTags = card.getAttribute('data-tags') || '';
                const cardTitle = card.querySelector('h4').textContent.toLowerCase();
                const cardText = card.querySelector('p').textContent.toLowerCase();

                if (searchTags.includes(term) || cardTitle.includes(term) || cardText.includes(term)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });

            const filteredWebResults = INTERNET_SEARCH_MOCK_DATABASE.filter(item => 
                item.title.toLowerCase().includes(term) || 
                item.snippet.toLowerCase().includes(term) || 
                item.category.toLowerCase().includes(term)
            );

            if (filteredWebResults.length > 0) {
                if (webSearchBox) webSearchBox.style.display = "block";
                if (searchResultsContainer) {
                    searchResultsContainer.innerHTML = filteredWebResults.map(res => `
                        <div style="background: var(--bg-main); padding: 0.75rem; border-radius: 4px; border-left: 3px solid var(--accent);">
                            <h5 style="color:white; margin-bottom:0.25rem;"><i class="fa-solid fa-link" style="font-size:0.8rem; color:var(--text-secondary);"></i> ${res.title}</h5>
                            <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">${res.snippet}</p>
                        </div>
                    `).join('');
                }
            } else {
                if (webSearchBox) webSearchBox.style.display = "none";
            }
        });
    }

    document.querySelectorAll('.admin-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let currentClicks = parseInt(localStorage.getItem('database_query_clicks') || '1420');
            currentClicks++;
            localStorage.setItem('database_query_clicks', currentClicks.toString());
            renderLedgerMetrics();
        });
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userDisplayName');
            localStorage.removeItem('userRawUsername');
            checkAuthState();
        });
    }

    // 4. CLIENT SIDE COMPONENT ROUTER ENVIRONMENT
    function handleRouting() {
        if (localStorage.getItem('isLoggedIn') !== 'true') return;

        let currentHash = window.location.hash;
        
        if (window.location.href.includes('?')) {
            const parts = window.location.href.split('#');
            if (parts.length > 1) {
                currentHash = '#' + parts[1];
            }
        }

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
    
    // Platform Boot Initialization Sequences
    initializeDatabaseState();
    checkAuthState();
});