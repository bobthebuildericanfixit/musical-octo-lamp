/**
 * RETRO BOWL COLLEGE MOD CLIENT ENGINE
 */

// --- 1. UNIVERSAL DRAG LOGIC ---
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        element.style.transform = "none"; // Fixes transform:translate conflict
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Initialize dragging
const mBtn = document.getElementById("mod-floating-btn");
const mMenu = document.getElementById("mod-menu-overlay");
const mHandle = document.getElementById("menu-drag-handle");

makeDraggable(mBtn, mBtn);
makeDraggable(mMenu, mHandle);

// --- 2. TOGGLE LOGIC ---
let clickStartTime;
mBtn.addEventListener('mousedown', () => clickStartTime = Date.now());
mBtn.addEventListener('mouseup', () => {
    // If the button was held for less than 200ms, it's a click, not a drag
    if (Date.now() - clickStartTime < 200) {
        toggleMenu();
    }
});

function toggleMenu() {
    mMenu.style.display = (mMenu.style.display === 'block') ? 'none' : 'block';
}

// --- 3. STABLE STORAGE CHEATS ---
function getSaveKey() {
    return Object.keys(localStorage).find(key => key.includes("RetroBowl") && key.includes(".ini"));
}

function applyStorageMod(type) {
    const key = getSaveKey();
    if (!key) {
        alert("No save file found! Play 1 week in career mode first.");
        return;
    }

    let data = localStorage.getItem(key);

    switch(type) {
        case 'credits':
            data = data.replace(/coach_credit="(\d+)"/g, 'coach_credit="50000"');
            break;
        case 'cap':
            data = data.replace(/salary_cap="(\d+)"/g, 'salary_cap="500"');
            break;
        case 'stamina':
            data = data.replace(/stamina="(\d+)"/g, 'stamina="100"');
            data = data.replace(/condition="(\d+)"/g, 'condition="100"');
            break;
    }

    localStorage.setItem(key, data);
    
    // Feedback and Refresh
    const targetBtn = event.target;
    targetBtn.innerText = "APPLYING...";
    targetBtn.style.background = "#00ff00";
    targetBtn.style.color = "#000";

    setTimeout(() => {
        location.reload();
    }, 500);
}

console.log("Mod Menu Initialized: Drag the 'M' or the Menu Header to move.");
