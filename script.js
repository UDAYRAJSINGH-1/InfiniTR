// Infinitr AI Tracking Website - JavaScript
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // ⚙️ CLOUD DATABASE CONFIGURATION
    // ==========================================
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
    const opinionForm = document.getElementById('opinion-form');
    
    const statsQueriesCount = document.getElementById('stats-queries-count');
    const statsFeedbackCount = document.getElementById('stats-feedback-count');

    // Sanitized Consumer Access Matrix (Hiding Admin/Developer Mechanics)
    const CREDENTIALS_REGISTRY = {
        'member@infinitr.io': { password: 'userpassword', role: 'Premium Tier', name: 'member@infinitr.io' },
        'auditor@infinitr.io': { password: 'userpassword', role: 'Standard Tier', name: 'auditor@infinitr.io' }
    };

    // Anonymized Metric Search Database (No tool names exposed)
    const INTERNET_SEARCH_MOCK_DATABASE = [
        { title: "AI Ecosystem Growth Trends", snippet: "Recent analytics indicate a massive migration towards localized web application pipelines and predictive matrix streams.", category: "AI Analytics" },
        { title: "Market Index Performance Layers", snippet: "Single page architectures deploying automated metrics show record-high calculation speed on public networks.", category: "System Velocity" },
        { title: "Open Source Trend Vector Analysis", snippet: "Free predictive data models offer pattern recognition automation libraries without public API footprint disclosure.", category: "News Signals" },
        { title: "System Dashboard Metric Clusters", snippet: "How backend intelligence models capture user metrics and predictive vectors natively.", category: "System Velocity" }
    ];

    // 1. DATA INFRASTRUCTURE ARCHITECTURE LOGIC
    function initializeDatabaseState() {
        if (!localStorage.getItem('database_query_clicks')) {
            localStorage.setItem('database_query_clicks', '1420');
        }
        renderLedgerMetrics();
        fetchLiveOpinionsTimeline(); // Load clean news/comments stream on boot
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
            console.error("Failed to fetch metric counters:", err);
        }
    }

    // 🔄 FETCH & RENDER COMMUNITY COMMENTS TIMELINE
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
                    timelineContainer.innerHTML = `<p style="color: var(--text-secondary); font-style: italic; padding: 1rem;">No discussion vectors found inside platform tables.</p>`;
                    return;
                }

                timelineContainer.innerHTML = data.map(item => {
                    const formattedDate = new Date(item.created_at).toLocaleString();
                    return `
                        <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 6px; margin-bottom: 0.75rem; border-left: 3px solid var(--accent); transition: 0.2s;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                                <strong style="color: white; font-size: 0.95rem;">${item.display_name}</strong>
                                <small style="color: var(--text-secondary); font-size: 0.75rem;">${formattedDate}</small>
                            </div>
                            <p style="color: #e2e8f0; font-size: 0.9rem; line-height: 1.4; margin: 0;">${item.content}</p>
                        </div>
                    `;
                }).join('');
            }
        } catch (err) {
            console.error("Failed syncing live feed:", err);
            timelineContainer.innerHTML = `<p style="color: #ef4444; font-size: 0.85rem; padding: 1rem;">System data link offline.</p>`;
        }
    }

    // 2. PRIVILEGE VERIFICATION ENGINE (Profile Limits)
    function checkAuthState() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const savedRole = localStorage.getItem('userRole');
        const savedName = localStorage.getItem('userDisplayName');

        if (isLoggedIn === 'true') {
            if (authScreen) authScreen.style.setProperty('display', 'none', 'important');
            if (appScreen) appScreen.style.display = 'flex';
            if (userDisplayName) userDisplayName.textContent = savedName; // ONLY showing profile email
            if (userRoleSub) userRoleSub.textContent = savedRole;
            
            if (portalRoleBadge) {
                portalRoleBadge.textContent = `${savedRole} Verified`;
                portalRoleBadge.style.color = '#10B981';
            }

            renderLedgerMetrics();
            fetchLiveOpinionsTimeline(); 
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
                    authError.textContent = "Access Denied. Check account parameters.";
                    authError.style.display = 'block';
                }
            }
        });
    }

    // 🌐 USER FEEDBACK COMMENT SUBMISSION
    if (opinionForm) {
        opinionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const textarea = document.getElementById('user-opinion-text');
            const newOpinion = textarea.value.trim();
            if(!newOpinion) return;
            
            const payload = {
                username: localStorage.getItem('userRawUsername') || 'anonymous',
                display_name: localStorage.getItem('userDisplayName') || 'Anonymous User',
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
                    fetchLiveOpinionsTimeline(); 
                } else {
                    alert("System rejected comment vector. Verify profile session status.");
                }
            } catch (err) {
                console.error("Network link error:", err);
            }
        });
    }

    // 3. CLEAN USER SEARCH ENGINE (Zero Tool Leakage)
    const globalSearchBar = document.getElementById('global-search-bar');
    const webSearchBox = document.getElementById('web-search-results-box');
    const searchResultsContainer = document.getElementById('search-results-output-container');

    if (globalSearchBar) {
        globalSearchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            
            if (term === "") {
                if (webSearchBox) webSearchBox.style.display = "none";
                return;
            }

            const filteredWebResults = INTERNET_SEARCH_MOCK_DATABASE.filter(item => 
                item.title.toLowerCase().includes(term) || 
                item.snippet.toLowerCase().includes(term) || 
                item.category.toLowerCase().includes(term)
            );

            if (filteredWebResults.length > 0) {
                if (webSearchBox) webSearchBox.style.display = "block";
                if (searchResultsContainer) {
                    searchResultsContainer.innerHTML = filteredWebResults.map(res => `
                        <div style="background: var(--bg-main); padding: 0.75rem; border-radius: 4px; border-left: 3px solid var(--accent); margin-bottom: 0.5rem;">
                            <h5 style="color:white; margin-bottom:0.25rem;"><i class="fa-solid fa-chart-line" style="font-size:0.8rem; color:var(--text-secondary); margin-right: 5px;"></i> ${res.title}</h5>
                            <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">${res.snippet}</p>
                            <span style="font-size: 0.7rem; color: var(--accent); text-transform: uppercase; font-weight: bold;">${res.category}</span>
                        </div>
                    `).join('');
                }
            } else {
                if (webSearchBox) webSearchBox.style.display = "none";
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userDisplayName');
            localStorage.removeItem('userRawUsername');
            checkAuthState();
        });
    }

    // 4. CLIENT SIDE NAVIGATION ROUTER
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