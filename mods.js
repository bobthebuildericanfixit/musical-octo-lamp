/**
 * MODS.JS - Real-Time Injection & Drag Logic
 */

// --- 1. DRAG & UI LOGIC ---
const mBtn = document.getElementById("mod-floating-btn");
const mMenu = document.getElementById("mod-menu-overlay");
const mHandle = document.getElementById("menu-drag-handle");

function setupDraggable(el, handle) {
    let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
    handle.onmousedown = (e) => {
        e.preventDefault();
        p3 = e.clientX; p4 = e.clientY;
        document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
        document.onmousemove = (e) => {
            p1 = p3 - e.clientX; p2 = p4 - e.clientY;
            p3 = e.clientX; p4 = e.clientY;
            el.style.top = (el.offsetTop - p2) + "px";
            el.style.left = (el.offsetLeft - p1) + "px";
            el.style.transform = "none";
        };
    };
}
setupDraggable(mBtn, mBtn);
setupDraggable(mMenu, mHandle);

let clickStart;
mBtn.onmousedown = () => clickStart = Date.now();
mBtn.onmouseup = () => { if (Date.now() - clickStart < 200) toggleMenu(); };

function toggleMenu() {
    mMenu.style.display = (mMenu.style.display === 'block') ? 'none' : 'block';
}

// --- 2. STORAGE CHEATS (Requires Refresh) ---
function applyStorageMod(type) {
    const key = Object.keys(localStorage).find(k => k.includes("RetroBowl") && k.includes(".ini"));
    if (!key) return alert("Save Not Found! Play 1 week first.");
    
    let data = localStorage.getItem(key);
    if (type === 'credits') data = data.replace(/coach_credit="(\d+)"/g, 'coach_credit="50000"');
    
    localStorage.setItem(key, data);
    location.reload(); 
}

// --- 3. REAL-TIME GAMEPLAY HOOK (No Refresh) ---
let godMode = false;
function toggleGodMode() {
    godMode = !godMode;
    const b = document.getElementById('god-btn');
    b.innerText = godMode ? "GOD: ON" : "GOD: OFF";
    b.style.background = godMode ? "#00ff00" : "#222";
    b.style.color = godMode ? "#000" : "#fff";

    if (godMode) {
        // Runs every 500ms to force live memory values
        window.godLoop = setInterval(() => {
            // Target the global GameMaker variables
            const g = window.g_pBuiltIn || null;
            if (g) {
                try {
                    // Injecting into active RAM
                    g.stamina = 100;
                    g.player_condition = 100;
                    g.morale = 100;
                    // Some versions use these minified names
                    if (g.h1) g.h1 = 100; 
                } catch(e) {}
            }
        }, 500);
    } else {
        clearInterval(window.godLoop);
    }
}
