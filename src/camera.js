export function initCamera(canvas, scene) {
    // Camera position using spherical coordinates
    const rho = scene._mainCube.scaling; // fixed distance
    const theta = Math.random() * Math.PI * 2; // horizontal angle [0, 2π]
    // vertical angle [π/3, π/2] with the horizon, so camera looks slightly downward
    const phi = (Math.PI / 3) + Math.random() * (Math.PI / 6);
    const cameraX = rho * Math.sin(phi) * Math.cos(theta);
    const cameraY = rho * Math.cos(phi);
    const cameraZ = rho * Math.sin(phi) * Math.sin(theta);
    const camera = new BABYLON.FreeCamera(
        "camera",
        new BABYLON.Vector3(cameraX, cameraY, cameraZ),
        // scene
    );
    camera.setTarget(new BABYLON.Vector3(0,0,0));

    // Remove all default camera inputs so only custom RMB works
    // camera.inputs.clear();
    camera.attachControl(canvas, false);
    camera.keysUp.push(87); // w
    camera.keysDown.push(83); // a
    camera.keysLeft.push(65); // s
    camera.keysRight.push(68); // d
    camera.keysUpward.push(69); // e
    camera.keysDownward.push(81); // q
    camera.angularSensibility = 5000;
    camera.speed = 50;

    // Pointer lock controls
    let isPointerLocked = false;

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

    document.addEventListener("pointerlockchange", () => {
        isPointerLocked = document.pointerLockElement === canvas;
    });

    // camera panning
    // wip
    canvas.addEventListener("mousemove", (event) => {
        if (isPointerLocked) {
            let movementX = event.movementX;
            let movementY = event.movementY;
            if (!Number.isFinite(movementX)) movementX = 0;
            if (!Number.isFinite(movementY)) movementY = 0;
            let newY = camera.rotation.y + movementX / camera.angularSensibility;
            let newRotationX = camera.rotation.x + movementY / camera.angularSensibility;
            if (!Number.isFinite(newY)) newY = 0;
            if (!Number.isFinite(newRotationX)) newRotationX = 0;
            camera.rotation.y = newY;
            camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newRotationX));
        }
    });

    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
    
    
    // console.log(camera.inputs.attached)
    // scene.addCamera(camera);
}