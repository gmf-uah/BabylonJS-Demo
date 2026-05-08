// Shared pointer lock setting
window.usePointerLock = false;

// Load controls content from external file
let controlsHtml = "";

function setupPointerLockToggle(popup) {
    const checkbox = popup.querySelector("#pointer-lock-toggle");
    if (!checkbox) {
        return;
    }

    checkbox.checked = window.usePointerLock;
    checkbox.addEventListener("change", async () => {
        window.usePointerLock = checkbox.checked;
        window.updatePointerLock?.(checkbox.checked);

        try {
            await window.updatePreference?.("usePointerLock", checkbox.checked);
        } catch (err) {
            console.error("Failed to save preference:", err);
        }
    });
}

window.addEventListener("DOMContentLoaded", async () => {
    // Load controls content first
    try {
        const response = await fetch("assets/html/controls-popup.html");
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
    const btnImg = btn.querySelector("img");
    const popup = document.getElementById("controls-popup");
    let visible = false;
    let btnHovered = false;

    // Set content once at startup
    if (controlsHtml) {
        popup.innerHTML = controlsHtml;
        setupPointerLockToggle(popup);
    }

    //btn.style.transition = "all 0.2s ease";
    function styleButtonIdle()
    {
            btn.style.backgroundColor = "rgba(30,30,30,0.6)";
            btn.style.opacity = "0.5";
            btnImg.style.filter = "invert(0.8)";
    }

    function styleButtonHover()
    {
            btn.style.backgroundColor = "rgba(100,100,100,0.6)";
            btn.style.opacity = "1.0";
            btnImg.style.filter = "invert(0.9)";
    }
    
    function styleButtonSelected()
    {
            btn.style.backgroundColor = "rgba(150,150,150,0.6)";
            btn.style.opacity = "1.0";
            btnImg.style.filter = "invert(0.2)";
    }

    function toggleControlPopup(e) 
    {
        e.stopPropagation(); // Prevent event bubbling
        visible = !visible;
        popup.style.display = visible ? "block" : "none";

        if (visible) styleButtonSelected();
        else if (btnHovered) styleButtonHover();
        else styleButtonIdle();
    }

    btn.addEventListener("mouseenter", (e) => {
        btnHovered = true;
        if(!visible) styleButtonHover();
    })

    btn.addEventListener("mouseleave", (e) => {
        btnHovered = false;
        if(!visible) styleButtonIdle();
    })

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
            styleButtonIdle();
        }
    });
});
