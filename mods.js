// --- 1. UNIVERSAL DRAG LOGIC ---
function makeDraggable(element, handle) {
    let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
    handle.onmousedown = (e) => {
        e.preventDefault();
        p3 = e.clientX; p4 = e.clientY;
        document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
        document.onmousemove = (e) => {
            p1 = p3 - e.clientX; p2 = p4 - e.clientY;
            p3 = e.clientX; p4 = e.clientY;
            element.style.top = (element.offsetTop - p2) + "px";
            element.style.left = (element.offsetLeft - p1) + "px";
            element.style.transform = "none";
        };
    };
}

const mBtn = document.getElementById("mod-floating-btn");
const mMenu = document.getElementById("mod-menu-overlay");
const mHandle = document.getElementById("menu-drag-handle");

makeDraggable(mBtn, mBtn);
makeDraggable(mMenu, mHandle);

// --- 2. MENU TOGGLE ---
let clickStart;
mBtn.onmousedown = () => clickStart = Date.now();
mBtn.onmouseup = () => {
    if (Date.now() - clickStart < 200) {
        mMenu.style.display = (mMenu.style.display === 'block') ? 'none' : 'block';
    }
};

function toggleMenu() {
    mMenu.style.display = (mMenu.style.display === 'block') ? 'none' : 'block';
}

// --- 3. STORAGE MODS ---
function applyStorageMod(type) {
    const key = Object.keys(localStorage).find(k => k.includes("RetroBowl") && k.includes(".ini"));
    if (!key) return alert("Save Not Found. Play one week first!");
    
    let data = localStorage.getItem(key);
    if (type === 'credits') {
        data = data.replace(/coach_credit="(\d+)"/g, 'coach_credit="50000"');
    }
    
    localStorage.setItem(key, data);
    location.reload();
}

// --- 4. REAL-TIME GOD MODE ---
let godActive = false;
function toggleGodMode() {
    godActive = !godActive;
    const btn = document.getElementById('god-btn');
    btn.innerText = godActive ? "GOD: ON" : "GOD: OFF";
    btn.style.background = godActive ? "#00ff00" : "#222";
    btn.style.color = godActive ? "#000" : "#fff";

    if (godActive) {
        window.godLoop = setInterval(() => {
            // Attempt to inject into the active GameMaker instance
            const gm = window.g_pBuiltIn || null;
            if (gm) {
                try {
                    gm.stamina = 100;
                    gm.player_condition = 100;
                    gm.morale = 100;
                } catch(e) {}
            }
        }, 500);
    } else {
        clearInterval(window.godLoop);
    }
}
