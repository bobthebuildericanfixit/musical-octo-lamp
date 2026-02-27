/**
 * PROSPECT1700 INTERNAL MOD ENGINE
 */

// 1. BRANDING INJECTION (REPLACING "NEW STAR GAMES")
const _decode = window.decodeURIComponent;
window.decodeURIComponent = function(str) {
    let res = _decode(str);
    // Directly target the dev name and news reel strings
    return res.replace(/New Star Games/g, "PROSPECT1700")
              .replace(/Retro Bowl/g, "PROSPECT BOWL");
};

// 2. SPEED ENGINE
window.g_fSpeedScale = 1.5; 
function toggleSpeed() {
    const btn = document.getElementById("speed-btn");
    if (window.g_fSpeedScale === 1.5) {
        window.g_fSpeedScale = 2.5;
        btn.innerText = "SPEED: 2.5x (INSANE)";
    } else {
        window.g_fSpeedScale = 1.5;
        btn.innerText = "SPEED: 1.5x";
    }
}

// 3. GPA & STAMINA INJECTION (GOD MODE)
let gpaActive = false;
function toggleGPA() {
    gpaActive = !gpaActive;
    document.getElementById("gpa-btn").innerText = gpaActive ? "AUTO-GPA: ON" : "AUTO-GPA: OFF";
}

setInterval(() => {
    const gm = window.g_pBuiltIn;
    if (gm) {
        try {
            // Force God Mode (Condition/Stamina)
            gm.stamina = 100;
            gm.player_condition = 100;
            
            // Force Perfect GPA (Academic Eligibility)
            if (gpaActive) {
                gm.player_gpa = 4.0;
                gm.academic_eligibility = 1;
            }
        } catch(e) {}
    }
}, 500);

// 4. STORAGE OVERRIDE (Credits & Cap)
function modSave(type) {
    const key = Object.keys(localStorage).find(k => k.includes("RetroBowl") && k.includes(".ini"));
    if (!key) return alert("Finish your first week to create a save!");
    
    let data = localStorage.getItem(key);
    if (type === 'credits') {
        data = data.replace(/coach_credit="(\d+)"/g, 'coach_credit="50000"');
    } else if (type === 'cap') {
        data = data.replace(/salary_cap="(\d+)"/g, 'salary_cap="500"');
    }
    
    localStorage.setItem(key, data);
    location.reload(); 
}
