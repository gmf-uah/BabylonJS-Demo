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
        console.log(phi)
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

    canvas.addEventListener("pointerdown", (event) => {
        if (event.button === 2) {
            canvas.requestPointerLock().catch(() => {});
        }
    });

    canvas.addEventListener("pointerup", (event) => {
        if (event.button === 2) {
            document.exitPointerLock();
        }
    });
    
    camera.keysUp.push(87); // w
    camera.keysDown.push(83); // a
    camera.keysLeft.push(65); // s
    camera.keysRight.push(68); // d
    camera.keysUpward.push(69); // e
    camera.keysDownward.push(81); // q
    camera.angularSensibility = 5000;
    camera.speed = .5;
}