export class Player {
    /**
     * @param {BABYLON.Scene} scene - The Babylon.js scene
     * @param {Object} options - Player options
     * @param {BABYLON.Vector3} [options.position] - Starting position
     * @param {number} [options.radius] - Base radius of the cone
     * @param {number} [options.height] - Height of the cone
     * @param {BABYLON.Color3} [options.color] - Color of the cone
     */
    constructor(scene, options = {}) {
        this.scene = scene;
        // Clamp radius and height to reasonable values
        const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
        this.radius = clamp(options.radius || 1, 0.2, 5);
        this.height = clamp(options.height || 2, 0.5, 10);
        this.position = options.position || new BABYLON.Vector3(0, 0, 0);
        this.color = options.color || new BABYLON.Color3(1, 0, 0); // Default red

        // Create a hollow, smooth cone (player model)
        this.model = BABYLON.MeshBuilder.CreateCylinder(
            "playerCone",
            {
                diameterBottom: this.radius * 2,
                diameterTop: 0,
                height: this.height,
                tessellation: 64, // smoother
            },
            scene
        );
        this.model.position = this.position.clone();
        this.model.renderingGroupId = 1;

        // Material with improved lighting
        this.material = new BABYLON.StandardMaterial("playerConeMat", scene);
        this.material.diffuseColor = this.color.clone();
        this.material.specularColor = new BABYLON.Color3(1, 1, 1); // more reflective
        this.material.specularPower = 64;
        this.model.material = this.material;
    }

    /**
     * Update player properties and model
     * @param {Object} options - Properties to update
     * @param {BABYLON.Vector3} [options.position]
     * @param {number} [options.radius]
     * @param {number} [options.height]
     * @param {BABYLON.Color3} [options.color]
     */
    update(options = {}) {
        if (options.position) {
            this.position = options.position.clone();
            this.model.position = this.position.clone();
        }
        if (options.radius) {
            // Clamp radius
            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
            this.radius = clamp(options.radius, 0.2, 5);
            this.model.scaling.x = this.radius / (this.model.getBoundingInfo().boundingBox.extendSize.x);
            this.model.scaling.z = this.radius / (this.model.getBoundingInfo().boundingBox.extendSize.z);
        }
        if (options.height) {
            // Clamp height
            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
            this.height = clamp(options.height, 0.5, 10);
            this.model.scaling.y = this.height / (this.model.getBoundingInfo().boundingBox.extendSize.y * 2);
        }
        if (options.color) {
            this.color = options.color.clone();
            this.material.diffuseColor = this.color.clone();
        }
    }
}