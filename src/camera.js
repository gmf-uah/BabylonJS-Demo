const getElapsedTime = (function(){
    const programStartTime = Date.now();
    return (function() {
        return (Date.now() - programStartTime) * 0.001;
    })
})()

export function initCamera(canvas, scene) {
    const position = (function(){
    // Camera position using spherical coordinates
        const rho = 20; // fixed distance
        const theta = Math.random() * Math.PI * 2; // horizontal angle [0, 2π]
        // vertical angle phi in range [π/4, 5π/12], so camera looks slightly downward
        // https://www.desmos.com/3d/twmjgedzbx
        const phi = (Math.PI / 4) + Math.random() * (Math.PI / 6);
        console.log(phi)
        const cameraX = rho * Math.sin(phi) * Math.cos(theta);
        const cameraY = rho * Math.cos(phi);
        const cameraZ = rho * Math.sin(phi) * Math.sin(theta);
        return new BABYLON.Vector3(cameraX, cameraY, cameraZ)
    })()

    // Parameters : name, position, scene
    const camera = new BABYLON.UniversalCamera("UniversalCamera", position, scene);

    // Targets the camera to a particular position. In this case the scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, true);
    camera.inputs.attached.mouse.buttons = [2]; // an array holding the number 2, representing rmb

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
    
    camera.keysUp.push(87); // w
    camera.keysDown.push(83); // a
    camera.keysLeft.push(65); // s
    camera.keysRight.push(68); // d
    camera.keysUpward.push(69); // e
    camera.keysDownward.push(81); // q
    
    // Custom camera roll input
    const CameraRollInput = function () {
        this._keys = [];
        this.keysRollLeft = [90]; // z
        this.keysRollRight = [67]; // c
        this.rollSensibility = 0.01;
    };
    
    CameraRollInput.prototype.getClassName = function () {
        return "CameraRollInput";
    };
    
    CameraRollInput.prototype.getSimpleName = function () {
        return "roll";
    };
    
    CameraRollInput.prototype.attachControl = function (noPreventDefault) {
        const _this = this;
        const engine = this.camera.getEngine();
        const element = engine.getInputElement();
        
        if (!this._onKeyDown) {
            element.tabIndex = 1;
            this._onKeyDown = function (evt) {
                if (_this.keysRollLeft.indexOf(evt.keyCode) !== -1 || _this.keysRollRight.indexOf(evt.keyCode) !== -1) {
                    const index = _this._keys.indexOf(evt.keyCode);
                    if (index === -1) {
                        _this._keys.push(evt.keyCode);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            
            this._onKeyUp = function (evt) {
                if (_this.keysRollLeft.indexOf(evt.keyCode) !== -1 || _this.keysRollRight.indexOf(evt.keyCode) !== -1) {
                    const index = _this._keys.indexOf(evt.keyCode);
                    if (index >= 0) {
                        _this._keys.splice(index, 1);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            
            this._onLostFocus = function () {
                _this._keys = [];
            };
            
            element.addEventListener("keydown", this._onKeyDown, false);
            element.addEventListener("keyup", this._onKeyUp, false);
            BABYLON.Tools.RegisterTopRootEvents(canvas, [{ name: "blur", handler: this._onLostFocus }]);
        }
    };
    
    CameraRollInput.prototype.detachControl = function () {
        const engine = this.camera.getEngine();
        const element = engine.getInputElement();
        
        if (this._onKeyDown) {
            element.removeEventListener("keydown", this._onKeyDown);
            element.removeEventListener("keyup", this._onKeyUp);
            BABYLON.Tools.UnregisterTopRootEvents(canvas, [{ name: "blur", handler: this._onLostFocus }]);
            this._keys = [];
            this._onKeyDown = null;
            this._onKeyUp = null;
        }
    };
    
    CameraRollInput.prototype.checkInputs = function () {
        if (this._onKeyDown) {
            const camera = this.camera;
            // Apply roll by modifying the z rotation directly
            for (let index = 0; index < this._keys.length; index++) {
                const keyCode = this._keys[index];
                if (this.keysRollLeft.indexOf(keyCode) !== -1) {
                    // Roll left (clockwise when looking forward)
                    camera.rotation.z += this.rollSensibility;
                } else if (this.keysRollRight.indexOf(keyCode) !== -1) {
                    // Roll right (counter-clockwise when looking forward)
                    camera.rotation.z -= this.rollSensibility;
                }
            }
        }
    };
    
    // Add the custom roll input to the camera
    camera.inputs.add(new CameraRollInput());
    
    camera.angularSensibility = 5000;
    camera.speed = .5;
    console.log(camera);
}