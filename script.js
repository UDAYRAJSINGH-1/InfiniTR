// Infinitr AI Tracking Website - JavaScript
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // ⚙️ CLOUD DATABASE CONFIGURATION
    // ==========================================
    const SUPABASE_URL = "https://bdthpyarytpqeohxjtwl.supabase.co"; 
    const SUPABASE_KEY = "sb_publishable_xxyOIvtN9Gpj0ZjxC2wLHw_9yWhvXdx";          
    
    // Global Constants (Make sure these are defined at the very top of your file!)
    // const SUPABASE_URL = "your_supabase_url";
    // const SUPABASE_KEY = "your_supabase_anon_key";

    const authScreen = document.getElementById('auth-screen');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const loginTriggerBtn = document.getElementById('login-trigger-btn');
    const authCloseBtn = document.getElementById('auth-close-btn');
    const authError = document.getElementById('auth-error');
    
    const userDisplayName = document.getElementById('user-display-name');
    const userRoleSub = document.getElementById('user-role-sub');
    const portalRoleBadge = document.getElementById('portal-role-badge');
    const opinionForm = document.getElementById('opinion-form');
    
    const statsQueriesCount = document.getElementById('stats-queries-count');
    const statsFeedbackCount = document.getElementById('stats-feedback-count');

    // ==========================================
    // 🔐 CREDENTIALS REGISTRY MATRIX
    // ==========================================
    const CREDENTIALS_REGISTRY = {
        'admin@infinitr.io': { password: 'Uday3333', role: 'Administrator Tier', name: 'admin@infinitr.io' },
        'member@infinitr.io': { password: 'Uday4973', role: 'Premium Tier User', name: 'member@infinitr.io' },
        'auditor@infinitr.io': { password: 'Uday4973', role: 'Standard Tier User', name: 'auditor@infinitr.io' }
    };

    // 1. SESSION MANAGEMENT LIFECYCLE
    function checkAuthState() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const savedRole = localStorage.getItem('userRole');
        const savedName = localStorage.getItem('userDisplayName');

        if (isLoggedIn === 'true') {
            if (userDisplayName) userDisplayName.textContent = savedName;
            if (userRoleSub) userRoleSub.textContent = savedRole;
            
            if (portalRoleBadge) {
                portalRoleBadge.textContent = "Verified Account";
                portalRoleBadge.style.display = "inline-block";
            }
            if (logoutBtn) logoutBtn.style.display = "inline-block";
            if (loginTriggerBtn) loginTriggerBtn.style.display = "none";
            if (authScreen) authScreen.style.display = "none";
        } else {
            if (userDisplayName) userDisplayName.textContent = "guest_account@infinitr.io";
            if (userRoleSub) userRoleSub.textContent = "";
            if (portalRoleBadge) portalRoleBadge.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "none";
            if (loginTriggerBtn) loginTriggerBtn.style.display = "inline-block";
        }
        
        // Safely fire off page-specific functions
        if (statsQueriesCount || statsFeedbackCount) { renderLedgerMetrics(); }
        if (document.getElementById('opinions-timeline-container')) { fetchLiveOpinionsTimeline(); }
    }

    // Modal Interaction Handlers
    if (loginTriggerBtn) { loginTriggerBtn.addEventListener('click', () => { if (authScreen) authScreen.style.display = "flex"; }); }
    if (authCloseBtn) { authCloseBtn.addEventListener('click', () => { if (authScreen) authScreen.style.display = "none"; }); }

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
            } else {
                if (authError) {
                    authError.textContent = "Check Your Details";
                    authError.style.display = 'block';
                }
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

    // 2. METRICS & TIMELINE GRAPH RENDERING
    async function renderLedgerMetrics() {
        if (!statsQueriesCount) return;
        statsQueriesCount.textContent = '1420';

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/user_opinions?select=id`, {
                method: 'GET',
                headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
            });
            if (response.ok && statsFeedbackCount) {
                const data = await response.json();
                statsFeedbackCount.textContent = data.length;
            }
        } catch (err) { console.error("Database connection link offline.", err); }
    }

    async function fetchLiveOpinionsTimeline() {
        const timelineContainer = document.getElementById('opinions-timeline-container');
        if (!timelineContainer) return;

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/user_opinions?select=*&order=created_at.desc`, {
                method: 'GET',
                headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.length === 0) {
                    timelineContainer.innerHTML = `<p style="color: var(--text-muted); font-style: italic; padding: 1rem;">No insight data records logged in matrix.</p>`;
                    return;
                }
                timelineContainer.innerHTML = data.map(item => `
                    <div style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; border-left: 3px solid var(--accent);">
                        <strong style="color: white; font-size: 0.85rem;">${item.display_name}</strong>
                        <p style="color: #e2e8f0; font-size: 0.85rem; margin-top: 0.25rem;">${item.content}</p>
                    </div>
                `).join('');
            }
        } catch (err) { timelineContainer.innerHTML = ''; }
    }

    if (opinionForm) {
        opinionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                if (authScreen) authScreen.style.display = "flex";
                return;
            }
            const textarea = document.getElementById('user-opinion-text');
            if (!textarea) return;

            const payload = {
                username: localStorage.getItem('userRawUsername') || 'anonymous',
                display_name: localStorage.getItem('userDisplayName') || 'Anonymous User',
                content: textarea.value.trim()
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
                if (response.ok) { textarea.value = ''; renderLedgerMetrics(); fetchLiveOpinionsTimeline(); }
            } catch (err) { console.error(err); }
        });
    }

    // ==========================================
    // 📨 UNIFIED CONTACT FORM SUBMISSION HANDLER
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('contact-name')?.value.trim() || 'Anonymous';
            const emailInput = document.getElementById('contact-email')?.value.trim() || 'No Email';
            const messageInput = document.getElementById('contact-message')?.value.trim() || '';

            if (!messageInput) {
                alert("Please write a message payload before dispatching.");
                return;
            }

            const submissionPayload = {
                name: nameInput,
                email: emailInput,
                message: messageInput
            };

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(submissionPayload)
                });

                if (response.ok) {
                    alert("Message secured and transmitted successfully!");
                    contactForm.reset();
                } else {
                    const errData = await response.json();
                    alert("Database rejected submission. Make sure RLS is open or configured for INSERT.");
                    console.error("Supabase Error Details:", errData);
                }
            } catch (err) {
                console.error("Network connection offline:", err);
                alert("Network routing error occurred.");
            }
        });
    }

    // 3. APEXCHARTS INDEX GENERATION
    if (document.querySelector("#marketAnalyticsChart")) {
        const options = {
            series: [
                { name: 'System Volume Delta', data: [34, 44, 54, 21, 67, 88, 95] },
                { name: 'Predictive Moving Mean', data: [15, 25, 47, 32, 54, 44, 61] }
            ],
            chart: { type: 'area', height: 300, toolbar: { show: false }, background: 'transparent' },
            colors: ['#10B981', '#06B6D4'],
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 2 },
            theme: { mode: 'dark' },
            grid: { borderColor: '#1E293B' },
            xaxis: {
                categories: ['04:00', '08:00', '12:00', '16:00', '20:00', '00:00', '04:00'],
                labels: { style: { colors: '#64748B' } }
            },
            yaxis: { labels: { style: { colors: '#64748B' } } },
            legend: { labels: { colors: '#FFFFFF' }, position: 'top' }
        };
        new ApexCharts(document.querySelector("#marketAnalyticsChart"), options).render();
    }

    checkAuthState();
});