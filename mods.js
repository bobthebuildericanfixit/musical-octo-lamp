console.log("Mod Menu Script Initialized...");

// 1. Draggable Button Logic
const dragBtn = document.getElementById("mod-floating-btn");
let isDragging = false;
let offset = [0,0];

dragBtn.addEventListener('mousedown', (e) => {
    isDragging = true;
    offset = [dragBtn.offsetLeft - e.clientX, dragBtn.offsetTop - e.clientY];
}, true);

document.addEventListener('mouseup', () => { isDragging = false; }, true);

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        dragBtn.style.left = (e.clientX + offset[0]) + 'px';
        dragBtn.style.top  = (e.clientY + offset[1]) + 'px';
    }
}, true);

// 2. Toggle Menu
dragBtn.addEventListener('click', () => {
    if (!isDragging) toggleMenu();
});

function toggleMenu() {
    const menu = document.getElementById('mod-menu-overlay');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// 3. Real-Time Injection Helpers
function getInternalVars() {
    // We scan the global window for the GameMaker data object
    // In minified RB, it's often 'g_pBuiltIn' or a large object with specific keys
    for (let key in window) {
        if (window[key] && typeof window[key] === 'object' && 'coach_credit' in window[key]) {
            return window[key];
        }
    }
    return null;
}

function addCreditsLive() {
    const game = getInternalVars();
    if (game) {
        game.coach_credit += 5000;
        console.log("Real-time credits added!");
    } else {
        alert("Real-time sync failed. Play 1 week first or refresh.");
    }
}

function maxFundLive() {
    const game = getInternalVars();
    if (game) {
        game.salary_cap = 500; // Standard RB College Max
        console.log("Salary Cap modded!");
    }
}

let staminaOn = false;
function toggleStamina() {
    staminaOn = !staminaOn;
    document.getElementById('stamina-toggle').innerText = staminaOn ? "ON" : "OFF";
    
    if (staminaOn) {
        window.staminaLoop = setInterval(() => {
            const game = getInternalVars();
            if (game) {
                game.stamina = 100;
                game.player_condition = 100;
            }
        }, 500);
    } else {
        clearInterval(window.staminaLoop);
    }
}
