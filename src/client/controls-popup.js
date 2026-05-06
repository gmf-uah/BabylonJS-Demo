// Shared pointer lock setting
window.usePointerLock = false;

// Load controls content from external file
let controlsHtml = "";

window.addEventListener("DOMContentLoaded", async () => {
    // Load controls content first
    try {
        const response = await fetch("pages/controls-popup.html");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        controlsHtml = text.trim();
    } catch (err) {
        console.error("Could not load controls-popup.html:", err);
    }

    // Load user preferences from server
    try {
        const preferences = await window.getPreferences();
        window.usePointerLock = preferences.usePointerLock;
        // console.log('Loaded pointer lock setting:', window.usePointerLock);
    } catch (err) {
        console.error("Could not load preferences:", err);
    }

    const btn = document.getElementById("controls-toggle");
    const popup = document.getElementById("controls-popup");
    let visible = false;

    // Set content once at startup
    if (controlsHtml) {
        popup.innerHTML = controlsHtml;

        // Set checkbox state after content is loaded
        const checkbox = popup.querySelector("#pointer-lock-toggle");
        if (checkbox) {
            checkbox.checked = window.usePointerLock;
        }
    }

    function toggleControlPopup(e) 
    {
        e.stopPropagation(); // Prevent event bubbling
        visible = !visible;
        popup.style.display = visible ? "block" : "none";
    }

    btn.addEventListener("click", (e) => {
        toggleControlPopup(e);
    });

    document.addEventListener("keydown", (e) => {
        if(e.key === "c" || e.key === "C"){
            toggleControlPopup(e);
        }
    });

    // Hide popup if clicking outside
    document.addEventListener("click", (e) => {
        if (visible && !btn.contains(e.target) && !popup.contains(e.target)) {
            popup.style.display = "none";
            visible = false;
        }
    });
});
