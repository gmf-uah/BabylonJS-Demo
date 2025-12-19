// Get the canvas element
const canvas = document.getElementById("renderCanvas");

// Create the scene
const createScene = function(engine) {
    // Create a basic scene
    const scene = new BABYLON.Scene(engine);
    
    // Set background color to a nice blue sky
    scene.clearColor = new BABYLON.Color3(0.5, 0.7, 1.0);
    
    // Create a UniversalCamera (fly camera) at position (0, 5, -10)
    const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 5, -10), scene);
    
    // Point the camera at the origin where the cube will be
    camera.setTarget(BABYLON.Vector3.Zero());
    
    // Attach camera controls to the canvas
    camera.attachControl(canvas, true);
    
    // Configure camera movement speeds
    camera.speed = 0.5;  // Movement speed
    camera.angularSensibility = 1000;  // Mouse sensitivity (lower = more sensitive)
    
    // Enable WASD keys in addition to arrow keys
    camera.keysUp.push(87);    // W
    camera.keysDown.push(83);  // S
    camera.keysLeft.push(65);  // A
    camera.keysRight.push(68); // D
    
    // Create a hemispheric light for ambient lighting
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    
    // Create a directional light for better depth perception
    const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), scene);
    dirLight.position = new BABYLON.Vector3(5, 10, 5);
    dirLight.intensity = 0.5;
    
    // Create a box (cube) as a reference point
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
    
    // Position the box at the origin
    box.position = new BABYLON.Vector3(0, 1, 0);
    
    // Create a material for the cube with a nice color
    const material = new BABYLON.StandardMaterial("boxMaterial", scene);
    material.diffuseColor = new BABYLON.Color3(0.8, 0.3, 0.3);  // Red color
    material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    box.material = material;
    
    // Create a ground plane for better spatial reference
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
    ground.position.y = 0;
    
    // Create a material for the ground
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.5, 0.3);  // Green color
    ground.material = groundMaterial;
    
    return scene;
};

// Initialize the engine and scene
const initEngine = async function() {
    let engine;
    
    // Try to create a WebGPU engine if supported
    if (navigator.gpu) {
        try {
            // Create WebGPU engine with proper options
            // Fixed: Added options parameter and improved error handling for WebGPU initialization
            const webGPUEngine = new BABYLON.WebGPUEngine(canvas, {
                antialias: true,
                stencil: true,
                preserveDrawingBuffer: false,
                powerPreference: "high-performance"
            });
            
            // Initialize WebGPU with local glslang paths to avoid CDN dependency
            // Fixed: Provide local paths for glslang compiler instead of relying on external CDN
            await webGPUEngine.initAsync({
                jsPath: '/glslang/glslang.js',
                wasmPath: '/glslang/glslang.wasm'
            });
            engine = webGPUEngine;
            console.log("WebGPU engine initialized successfully");
        } catch (e) {
            // WebGPU initialization can fail for various reasons:
            // - Browser doesn't fully support WebGPU
            // - Required dependencies (glslang, twgsl) are not available
            // - GPU adapter is not available
            console.warn("WebGPU initialization failed, falling back to WebGL:", e);
            engine = new BABYLON.Engine(canvas, true);
        }
    } else {
        // Fallback to WebGL if WebGPU is not supported
        console.log("WebGPU not supported, using WebGL");
        engine = new BABYLON.Engine(canvas, true);
    }
    
    // Create the scene
    const scene = createScene(engine);
    
    // Run the render loop
    engine.runRenderLoop(function() {
        scene.render();
    });
    
    // Handle window resize
    window.addEventListener("resize", function() {
        engine.resize();
    });
};

// Start the application
initEngine().catch((error) => {
    console.error("Failed to initialize engine:", error);
});
