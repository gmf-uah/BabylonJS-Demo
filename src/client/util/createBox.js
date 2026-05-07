export function createBox(scene, size, pos, color) {
    const cube = BABYLON.MeshBuilder.CreateBox("cube", { size: size }, scene);
    cube.position = pos;
    cube.renderingGroupId = 1;
    const cubeMaterial = new BABYLON.StandardMaterial("cubeMaterial", scene);
    cubeMaterial.diffuseColor = color;
    cubeMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    cube.material = cubeMaterial;
    return cube
}