/**
 * MODS.JS - THE ULTIMATE CLIENT ENGINE
 */

// --- 1. DRAGGING LOGIC ---
function makeDraggable(el, handle) {
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
makeDraggable(document.getElementById("mod-floating-btn"), document.getElementById("mod-floating-btn"));
makeDraggable(document.getElementById("mod-menu-overlay"), document.getElementById("menu-drag-handle"));

// --- 2. MENU TOGGLE ---
let clickStart;
const mBtn = document.getElementById("mod-floating-btn");
const mOverlay = document.getElementById("mod-menu-overlay");

mBtn.onmousedown = () => clickStart = Date.now();
mBtn.onmouseup = () => { if (Date.now() - clickStart < 200) toggleMenu(); };
function toggleMenu() { mOverlay.style.display = (mOverlay.style.display === 'block') ? 'none' : 'block'; }

// --- 3. STORAGE MODS (Credits) ---
function applyStorageMod(type) {
    const key = Object.keys(localStorage).find(k => k.includes("RetroBowl") && k.includes(".ini"));
    if (!key) return alert("Play 1 week first!");
    let data = localStorage.getItem(key);
    if (type === 'credits') data = data.replace(/coach_credit="(\d+)"/g, 'coach_credit="50000"');
    localStorage.setItem(key, data);
    location.reload();
}

// --- 4. REAL-TIME ENGINE LOOP ---
let godActive = false;
let speedActive = false;
const YOUR_NAME = "Prospect1700"; // <--- Put your name here!

function toggleGodMode() {
    godActive = !godActive;
    const btn = document.getElementById('god-btn');
    btn.innerText = godActive ? "ON" : "OFF";
    btn.style.background = godActive ? "#00ff00" : "#222";
    btn.style.color = godActive ? "#000" : "#fff";
}

function toggleSpeed() {
    speedActive = !speedActive;
    const btn = document.getElementById('speed-btn');
    btn.innerText = speedActive ? "FAST" : "NORMAL";
}

// THE HEARTBEAT LOOP (Runs every 200ms)
setInterval(() => {
    const gm = window.g_pBuiltIn || null;
    if (!gm) return;

    // A. GOD MODE INJECTION
    if (godActive) {
        try {
            gm.stamina = 100;
            gm.player_condition = 100;
            gm.morale = 100;
            gm.p_stamina = 100; // Extra catch for some versions
        } catch(e) {}
    }

    // B. SPEED MOD INJECTION
    if (speedActive) {
        try {
            // Adjusts the internal GameMaker timescale
            if (window.g_fSpeedScale !== undefined) window.g_fSpeedScale = 1.5;
            if (gm.game_speed) gm.game_speed = 2;
        } catch(e) {}
    }

    // C. TEXT REPLACEMENT (Moving Credits/News)
    // This scans common GameMaker text buffers to swap names
    try {
        for (let key in gm) {
            if (typeof gm[key] === "string") {
                // If it finds the original dev name or news ticker, it swaps it
                if (gm[key].includes("Retro Bowl") || gm[key].includes("New Star Games")) {
                    gm[key] = `MODDED BY ${YOUR_NAME}`;
                }
            }
        }
    } catch(e) {}

}, 200);
