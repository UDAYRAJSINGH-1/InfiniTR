// Infinitr AI Tracking Website - JavaScript
// --- 1. SINGLE PAGE ROUTING ---
function switchPage(pageId) {
    // Hide all section modules
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    // Remove active link states
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected item
    document.getElementById(`page-${pageId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- 2. LIVE REAL-TIME SIMULATOR (Data Tracker Engine) ---
function updateLiveMetrics() {
    // Generates highly realistic fluctuating parameters
    const baseCompute = (78.4 + Math.random() * 4.2).toFixed(1);
    const activeAgents = Math.floor(1420000 + Math.random() * 85000).toLocaleString();
    const inferenceTime = Math.floor(22 + Math.random() * 9);

    const computeEl = document.getElementById('stat-compute');
    const agentsEl = document.getElementById('stat-agents');
    const speedEl = document.getElementById('stat-speed');

    if (computeEl) computeEl.innerText = `${baseCompute} EFLOPS`;
    if (agentsEl) agentsEl.innerText = activeAgents;
    if (speedEl) speedEl.innerText = `${inferenceTime} ms`;
}

// Continuous background ticker execution
setInterval(updateLiveMetrics, 2500);

// Live Dynamic Feed Injector
const breakingNews = [
    "Quantum-accelerated transformers achieve 40% reduction in validation error.",
    "Open-source local reasoning frameworks hit 150k tokens per second output speeds.",
    "Sub-surface edge silicon nodes successfully deployed across renewable energy stations.",
    "Distributed reinforcement frameworks finish mapping complex multi-modal biospheres."
];

function populateNewsTicker() {
    const feedContainer = document.getElementById('live-news-feed');
    if(!feedContainer) return;

    feedContainer.innerHTML = "";
    breakingNews.forEach(news => {
        const item = document.createElement('div');
        item.className = "feed-item";
        
        const timestamp = new Date().toLocaleTimeString();
        item.innerHTML = `
            <span class="feed-text">${news}</span>
            <span class="feed-time">[${timestamp}]</span>
        `;
        feedContainer.prepend(item);
    });
}

// --- 3. SEARCH DIRECTORY REPOSITORY ENGINE ---
const aiDirectoryData = [
    { title: "Large Language Models (LLMs)", desc: "Deep learning models trained on trillions of parameters to process, generate, and reason using syntax structures.", tag: "Generative" },
    { title: "Computer Vision Systems", desc: "Convolutional neural structures engineered to decode frame spatial properties, object maps, and classification maps.", tag: "Vision" },
    { title: "Autonomous Agents", desc: "Self-correcting recursive execution graphs that can execute programmatic workflows, API interactions, and goal paths.", tag: "Robotics" },
    { title: "Neural Graphics Ensembles", desc: "Radiance pipelines and vector weights utilizing machine learning grids to construct spatial 3D renders from physical inputs.", tag: "Graphics" },
    { title: "Edge Computing Hardware Integration", desc: "Micro-architecture arrays optimized to handle direct local inference matrix math natively with low wattage consumption.", tag: "Hardware" }
];

function buildDirectory() {
    const grid = document.getElementById('directory-grid');
    if(!grid) return;

    grid.innerHTML = aiDirectoryData.map(item => `
        <div class="dir-card">
            <span class="dir-tag">${item.tag}</span>
            <h3 style="margin: 0.5rem 0">${item.title}</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height:1.4">${item.desc}</p>
        </div>
    `).join('');
}

function filterDirectory() {
    const searchTerm = document.getElementById('directory-search').value.toLowerCase();
    const cards = document.querySelectorAll('.dir-card');

    cards.forEach((card, index) => {
        const item = aiDirectoryData[index];
        const match = item.title.toLowerCase().includes(searchTerm) || 
                      item.desc.toLowerCase().includes(searchTerm) || 
                      item.tag.toLowerCase().includes(searchTerm);
        card.style.display = match ? "block" : "none";
    });
}

// --- 4. INTERACTIVE KNOWLEDGE PATTERN CHAT ---
const fallbackKnowledgeBase = {
    "deep learning": "Deep learning is a subset of machine learning based on artificial neural networks with multiple layers (hence 'deep'). These layers mimic structural biological node behaviors to analyze non-linear complex patterns.",
    "llm": "Large Language Models use massive Transformer-based neural network matrices containing billions of tunable weight channels, predicting sequence arrays based on contextual attention parameters.",
    "gpu": "Graphics Processing Units are hardware processors explicitly built with thousands of small arithmetic engine cores running mathematical vector matrices completely parallel.",
    "default": "Query indexed successfully. Based on real-time trends, the development pattern requested is accelerating heavily. Core research suggests deep reinforcement testing and attention layers remain foundational to this subsystem."
};

function handleChatSubmit(e) {
    if (e.key === 'Enter') submitChatQuery();
}

function submitChatQuery() {
    const inputEl = document.getElementById('chat-input');
    const outputContainer = document.getElementById('chat-output');
    if (!inputEl || !inputEl.value.trim()) return;

    const queryText = inputEl.value;
    inputEl.value = ""; // clear prompt buffer

    // Append User Prompt Card
    const userDiv = document.createElement('div');
    userDiv.className = "user-msg";
    userDiv.innerText = `> ${queryText}`;
    outputContainer.appendChild(userDiv);

    // AI Core response resolution parsing loop
    setTimeout(() => {
        const aiDiv = document.createElement('div');
        aiDiv.className = "ai-msg";
        
        let answer = fallbackKnowledgeBase["default"];
        const structuredLower = queryText.toLowerCase();

        for (let key in fallbackKnowledgeBase) {
            if (structuredLower.includes(key) && key !== "default") {
                answer = fallbackKnowledgeBase[key];
                break;
            }
        }

        aiDiv.innerText = `[INFINITR-CORE]: ${answer}`;
        outputContainer.appendChild(aiDiv);
        outputContainer.scrollTop = outputContainer.scrollHeight;
    }, 450);
}

// --- INITIALIZING NODE ENGINE LIFE ---
window.onload = () => {
    updateLiveMetrics();
    populateNewsTicker();
    buildDirectory();
};