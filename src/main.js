const canvas = document.getElementById("renderCanvas");
const errorMessage = document.getElementById("error-message");

// Validate that required DOM elements exist
if (!canvas || !errorMessage) {
    throw new Error("Required DOM elements not found. Ensure index.html has the correct structure.");
}

async function initWebGPU() {
    try {
        // Check if WebGPU is supported
        if (!navigator.gpu) {
            throw new Error("WebGPU is not supported in your browser.");
        }

        // Create the WebGPU engine
        const engine = new BABYLON.WebGPUEngine(canvas);
        await engine.initAsync();

        // Create the scene
        const scene = createScene(engine);

        // Run the render loop
        engine.runRenderLoop(() => {
            scene.render();
        });

        // Handle window resize
        window.addEventListener("resize", () => {
            engine.resize();
        });

        return { engine, scene };
    } catch (error) {
        showError(error.message);
        throw error;
    }
}

function createScene(engine) {
    // Create a basic scene
    const scene = new BABYLON.Scene(engine);
    scene.fogEnd = 100;
    
    // Create a skybox
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    // Ensure skybox renders first
    skybox.renderingGroupId = 0;
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    // Use a crisper, less noisy skybox texture
    // Use a crisp, low-noise skybox texture
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = skyboxMaterial;

    // Create a FreeCamera with fly-like movement
    // Camera will be placed outside the cube's hitbox, facing the cube
    const cubeSize = 20; // Must match the cube's size
    const cubePosition = new BABYLON.Vector3(0, 1, 0); // Must match the cube's position
    const cameraDistance = cubeSize * 5 + 100;
    const cameraHeight = cubePosition.y + cubeSize / 2; // Eye-level with cube center
    const camera = new BABYLON.FreeCamera(
        "camera",
        new BABYLON.Vector3(cubePosition.x, cameraHeight, cubePosition.z - cameraDistance),
        scene
    );
    
    // Point the camera at the center of the cube
    camera.setTarget(cubePosition);
    
    // Set up pointer lock for camera panning with RMB (custom mouse controls)
    let isPointerLocked = false;
    canvas.addEventListener("pointerdown", (event) => {
        if (event.button === 2) { // Right mouse button
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
    canvas.addEventListener("mousemove", (event) => {
        if (isPointerLocked) {
            let movementX = event.movementX;
            let movementY = event.movementY;
            if (!Number.isFinite(movementX)) movementX = 0;
            if (!Number.isFinite(movementY)) movementY = 0;
            let newY = camera.rotation.y + movementX / camera.angularSensibility;
            let newRotationX = camera.rotation.x + movementY / camera.angularSensibility;
            // Clamp values to prevent NaN/Infinity
            if (!Number.isFinite(newY)) newY = 0;
            if (!Number.isFinite(newRotationX)) newRotationX = 0;
            camera.rotation.y = newY;
            camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newRotationX));
        }
    });
    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    // Attach Babylon controls but DISABLE built-in mouse (second arg = false)
    camera.attachControl(canvas, false);

    // Configure camera for fly-like movement
    camera.keysUp.push(87);    // W key
    camera.keysDown.push(83);  // S key
    camera.keysLeft.push(65);  // A key
    camera.keysRight.push(68); // D key
    camera.keysUpward.push(69);// E key
    camera.keysDownward.push(81);// Q key

    // Remove default mouse input (should be redundant, but safe)
    // camera.inputs.removeByType("FreeCameraMouseInput");
    camera.angularSensibility = 5000;

    // Adjust camera speed for better flying experience
    camera.speed = 5;
    // camera.angularSensibility is now set after removeByType above

    // Create a light
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Create a blue cube at the center as orientation reference
    const cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 20 }, scene);
    cube.position = new BABYLON.Vector3(0, 1, 0);
    // Render cube after skybox
    cube.renderingGroupId = 1;
    
    // Create a blue material for the cube
    const cubeMaterial = new BABYLON.StandardMaterial("cubeMaterial", scene);
    cubeMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1); // Blue color
    cubeMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    cube.material = cubeMaterial;

    scene.onBeforeRenderObservable.add(() => {
        const dt = scene.getEngine().getDeltaTime() * 0.001;
        cube.rotation.y += 1.0 * dt;
        cube.rotation.x += 0.6 * dt;
        // Snap skybox to camera position
        skybox.position.copyFrom(camera.position);
    });

    return scene;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    console.error(message);
}

// Initialize the WebGPU engine and create the scene
initWebGPU().then(() => {
    console.log("WebGPU initialized successfully!");
    console.log("Scene created with FreeCamera, cube, and ground.");
}).catch((error) => {
    console.error("Failed to initialize WebGPU:", error);
});