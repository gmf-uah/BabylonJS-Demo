// game.js
// Handles game logic and cube creation

export function createGame(scene) {
    // Create a blue cube at the center
    const cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 200 }, scene);
    cube.position = new BABYLON.Vector3(0, 1, 0);
    cube.renderingGroupId = 1;
    const cubeMaterial = new BABYLON.StandardMaterial("cubeMaterial", scene);
    cubeMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
    cubeMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    cube.material = cubeMaterial;

    // Spin the cube and snap skybox to camera
    scene.onBeforeRenderObservable.add(() => {
        // const dt = scene.getEngine().getDeltaTime() * 0.001;
        // cube.rotation.y += 1.0 * dt;
        // cube.rotation.x += 0.6 * dt;
    });

    // Expose cube for later game logic (this is dumb)
    scene._mainCube = cube;
}
