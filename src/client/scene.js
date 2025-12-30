// scene.js
// Handles scene, skybox, and lighting setup

export function createScene(engine) {
    const scene = new BABYLON.Scene(engine);

    const skybox = scene.createDefaultSkybox(
        new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/TropicalSunnyDay", scene),
        false,
        undefined,
    );
    skybox.renderingGroupId = 0; // doesnt do shit
    // ^ trying to make all the game objects render after the skybox so the sky seems infinitely far away

    // Lighting
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), scene);
    light.intensity = 0.7;
    
    return scene;
}
