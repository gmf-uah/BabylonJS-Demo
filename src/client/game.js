// game.js
// Handles game logic and cube creation
import { createBox } from "./util/createBox.js";

export function createGame(scene) {
    // Create a blue cube at the center
    for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
            for (let z = -2; z <= 2; z++) {
                const cube = createBox(scene, 0.8, new BABYLON.Vector3(x, y, z), new BABYLON.Color3(0, 0, 1));
            }
        }
    }

    // Spin the cube and snap skybox to camera
    scene.onBeforeRenderObservable.add(() => {
        // const dt = scene.getEngine().getDeltaTime() * 0.001;
        // cube.rotation.y += 1.0 * dt;
        // cube.rotation.x += 0.6 * dt;
    });

    // Expose cube for later game logic (this is dumb)
    // scene._mainCube = cube;
}
