# BabylonJS-Demo

A simple 3D web application using BabylonJS that allows users to fly their camera around a scene with a cube as a reference point.

## Features

- **Fly Camera Controls**: Navigate the 3D scene freely
  - W/A/S/D or Arrow Keys - Move camera forward/left/backward/right
  - Mouse - Look around
  - Space - Move up
  - Shift - Move down
- **3D Scene**: A red cube positioned at the center as a reference point
- **Ground Plane**: Green ground for spatial orientation
- **Sky Background**: Blue sky for an immersive environment

## Requirements

- Node.js and npm
- Modern web browser with WebGL 2.0 support (or WebGPU for enhanced performance)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gmf-uah/BabylonJS-Demo.git
   cd BabylonJS-Demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Demo

Start the local server:
```bash
npm start
```

Then open your browser and navigate to:
```
http://localhost:8089/index.html
```

## Project Structure

- `index.html` - Main HTML page with canvas element
- `app.js` - BabylonJS scene setup and camera controls (with WebGPU support)
- `glslang/` - WebGPU shader compiler dependencies (glslang.js and glslang.wasm)
- `package.json` - Project dependencies and scripts
- `WEBGPU_FIXES.md` - Documentation of WebGPU initialization fixes

## Technologies Used

- [BabylonJS](https://www.babylonjs.com/) - WebGL/WebGPU-based 3D engine (loaded from CDN)
- WebGPU - Modern graphics rendering API (with WebGL 2.0 fallback)
- JavaScript - Scene logic and controls

## BabylonJS CDN Usage

This project loads BabylonJS dynamically from the official Babylon.js CDN:
```html
<script src="https://cdn.babylonjs.com/babylon.js"></script>
```

**Important Note**: The current implementation uses the unversioned CDN URL which always points to the latest stable version. This is suitable for demos and prototypes but may introduce breaking changes over time.

### Version Locking (Recommended for Production)

For production applications or to ensure stability, lock to a specific version to avoid potential breaking changes from future updates:

```html
<!-- Lock to specific version (e.g., 6.49.0) -->
<script src="https://cdn.babylonjs.com/babylon.6.49.0.js"></script>
```

### Security Considerations

For enhanced security in production environments, consider:
1. **Subresource Integrity (SRI)**: Add integrity attributes with SRI hashes to ensure scripts haven't been tampered with
2. **Self-Hosting**: Host Babylon.js on your own CDN/server for better control and reliability
3. **Version Pinning**: Always use versioned URLs in production

For more information about available CDN versions and usage, visit: https://doc.babylonjs.com/setup/frameworkPackages/CDN