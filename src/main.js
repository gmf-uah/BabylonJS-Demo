
import { createScene } from "./scene.js";
import { createGame } from "./game.js";
import { initCamera } from "./camera.js";

const canvas = document.getElementById("renderCanvas");
const errorMessage = document.getElementById("error-message");
if (!canvas || !errorMessage) {
    throw new Error("Required DOM elements not found. Ensure index.html has the correct structure.");
}

async function initWebGPU() {
    try {
        if (!navigator.gpu) {
            throw new Error("WebGPU is not supported in your browser.");
        }
        const engine = new BABYLON.WebGPUEngine(canvas);
        await engine.initAsync();
        const scene = createScene(engine);
        initCamera(canvas, scene);
        createGame(scene);
        engine.runRenderLoop(() => {
            scene.render();
        });
        window.addEventListener("resize", () => {
            engine.resize();
        });
        return { engine, scene };
    } catch (error) {
        showError(error.message);
        throw error;
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    console.error(message);
}

initWebGPU()/*.then(() => {
    // console.log("WebGPU initialized successfully!");
    // console.log("Scene created with FreeCamera, cube, and ground.");
}).catch((error) => {
    // console.error("Failed to initialize WebGPU:", error);
});*/