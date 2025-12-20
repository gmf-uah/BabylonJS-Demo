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
            throw new Error("WebGPU is not supported in your browser. Please use a browser with WebGPU support (e.g., Chrome 113+, Edge 113+).");
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

    // Create a FreeCamera with fly-like movement
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 5, -10), scene);
    
    // Point the camera at the origin
    camera.setTarget(BABYLON.Vector3.Zero());
    
    // Disable default camera controls initially - we'll set up custom controls
    camera.attachControl(canvas, true);
    
    // Configure camera for fly-like movement
    camera.keysUp.push(87);    // W key
    camera.keysDown.push(83);  // S key
    camera.keysLeft.push(65);  // A key
    camera.keysRight.push(68); // D key
    
    // Adjust camera speed for better flying experience
    camera.speed = 0.5;
    camera.angularSensibility = 1000;
    
    // Disable default mouse input - we'll handle it manually
    camera.inputs.removeByType("FreeCameraMouseInput");
    
    // Set up pointer lock for camera panning with RMB
    let isPointerLocked = false;
    
    // Handle right mouse button down - request pointer lock
    canvas.addEventListener("mousedown", (event) => {
        if (event.button === 2) { // Right mouse button
            canvas.requestPointerLock().catch((error) => {
                console.warn("Pointer lock request failed:", error);
            });
        }
    });
    
    // Handle right mouse button up - exit pointer lock
    canvas.addEventListener("mouseup", (event) => {
        if (event.button === 2) { // Right mouse button
            document.exitPointerLock();
        }
    });
    
    // Track pointer lock state
    document.addEventListener("pointerlockchange", () => {
        isPointerLocked = document.pointerLockElement === canvas;
    });
    
    // Handle mouse movement for camera rotation when pointer is locked
    canvas.addEventListener("mousemove", (event) => {
        if (isPointerLocked) {
            const movementX = event.movementX || 0;
            const movementY = event.movementY || 0;
            
            // Rotate camera based on mouse movement
            camera.rotation.y += movementX / camera.angularSensibility;
            
            // Clamp vertical rotation to prevent camera from flipping upside down
            const newRotationX = camera.rotation.x + movementY / camera.angularSensibility;
            camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newRotationX));
        }
    });
    
    // Prevent context menu on right click
    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    // Create a light
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Create a blue cube at the center as orientation reference
    const cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 2 }, scene);
    cube.position = new BABYLON.Vector3(0, 1, 0);
    
    // Create a blue material for the cube
    const cubeMaterial = new BABYLON.StandardMaterial("cubeMaterial", scene);
    cubeMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1); // Blue color
    cubeMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    cube.material = cubeMaterial;

    // Create a ground plane for reference
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
    
    // Create a material for the ground
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Gray color
    groundMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    ground.material = groundMaterial;

    // Add some rotation to the cube for visual effect
    scene.registerBeforeRender(() => {
        cube.rotation.y += 0.01;
        cube.rotation.x += 0.005;
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
