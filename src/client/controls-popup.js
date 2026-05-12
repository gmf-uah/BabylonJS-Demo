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
        const response = await fetch("assets/html/game-menus.html");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        controlsHtml = doc.getElementById("controls-menu").outerHTML;
    } catch (err) {
        console.error("Could not load controls-popup.html:", err);
    }

    // Load user preferences from server
    try {
        const preferences = await window.getPreferences();
        window.usePointerLock = preferences.usePointerLock;
    } catch (err) {
        console.error("Could not load preferences:", err);
    }

    //const sceneButtons = document.querySelectorAll(".scene-button");

    function toggleControlPopup(e) 
    {
        e.stopPropagation(); // Prevent event bubbling
        visible = !visible;
        //const popup2 = document.getElementById(e.currentTarget.id);
        popup.style.display = visible ? "block" : "none";
        btn.classList.toggle("selected");

        /*if (visible) styleButtonSelected();
        else if (btnHovered) styleButtonHover();
        else styleButtonIdle();*/
    }

    //sceneButtons.forEach((btn) => {
    //
    //});

    const btn = document.getElementById("controls-toggle");
    //const btnImg = btn.querySelector("img");
    const popup = document.getElementById("controls-popup");
    let visible = false;

    // Set content once at startup
    if (controlsHtml) {
        popup.innerHTML = controlsHtml;
        setupPointerLockToggle(popup);
    }



    btn.addEventListener("click", (e) => {
        //alert(e.currentTarget.id);
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
            //styleButtonIdle();
            btn.classList.toggle("selected");
        }
    });
});
