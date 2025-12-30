const getElapsedTime = (function(){
    const programStartTime = Date.now();
    return (function() {
        return (Date.now() - programStartTime) * 0.001;
    })
})()

export function initCamera(canvas, scene) {
    const position = (function(){
    // Camera position using spherical coordinates
        const rho = 20; // fixed distance
        const theta = Math.random() * Math.PI * 2; // horizontal angle [0, 2π]
        // vertical angle phi in range [π/4, 5π/12], so camera looks slightly downward
        // https://www.desmos.com/3d/twmjgedzbx
        const phi = (Math.PI / 4) + Math.random() * (Math.PI / 6);
        const cameraX = rho * Math.sin(phi) * Math.cos(theta);
        const cameraY = rho * Math.cos(phi);
        const cameraZ = rho * Math.sin(phi) * Math.sin(theta);
        return new BABYLON.Vector3(cameraX, cameraY, cameraZ)
    })()

    // Parameters : name, position, scene
    const camera = new BABYLON.UniversalCamera("UniversalCamera", position, scene);

    // Targets the camera to a particular position. In this case the scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, true);
    camera.inputs.attached.mouse.buttons = [2]; // an array holding the number 2, representing rmb

    { // Pointer lock management
        let pointerDownHandler = null;
        let pointerUpHandler = null;
        
        function updatePointerLockHandlers(usePointerLock) {
            // Remove existing handlers regardless of whether pointer lock is being enabled or disabled
            // This inherently prevents a memory leak in case pointer lock were to be enabled twice in a row
            if (pointerDownHandler) {
                canvas.removeEventListener("pointerdown", pointerDownHandler);
                pointerDownHandler = null;
            }
            if (pointerUpHandler) {
                canvas.removeEventListener("pointerup", pointerUpHandler);
                pointerUpHandler = null;
            }
            
            // Add handlers if pointer lock is enabled
            if (usePointerLock) {
                pointerDownHandler = (event) => {
                    if (event.button === 2) {
                        canvas.requestPointerLock().catch(() => {});
                    }
                };
                pointerUpHandler = (event) => {
                    if (event.button === 2) {
                        document.exitPointerLock();
                    }
                };
                canvas.addEventListener("pointerdown", pointerDownHandler);
                canvas.addEventListener("pointerup", pointerUpHandler);
            }
        }
        
        // Initialize with current setting and expose update function
        updatePointerLockHandlers(window.usePointerLock || false);
        window.updatePointerLock = updatePointerLockHandlers;
    }
    
    camera.keysUp.push(87); // w
    camera.keysDown.push(83); // a
    camera.keysLeft.push(65); // s
    camera.keysRight.push(68); // d
    camera.keysUpward.push(69); // e
    camera.keysDownward.push(81); // q
    camera.angularSensibility = 3000;
    camera.speed = 1.4;
    camera.inertia = 0.8;
}