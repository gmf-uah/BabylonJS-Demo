# BabylonJS-Demo

A WebGPU-powered 3D demo using Babylon.js, featuring a fly camera that allows users to navigate through a 3D scene.

## Features

- **WebGPU Engine**: Uses Babylon.js WebGPU API for modern, high-performance 3D graphics
- **Fly Camera**: Navigate the 3D space with keyboard controls
- **Pointer Lock**: Hold right mouse button to look around without cursor limitations
- **3D Scene**: Includes a rotating blue cube and ground plane for orientation
- **Error Handling**: Displays appropriate messages if WebGPU is not supported

## Controls

- **W** - Move Forward
- **S** - Move Backward
- **A** - Move Left
- **D** - Move Right
- **RMB (Hold)** - Look Around (with pointer lock)

## Requirements

- A modern browser with WebGPU support:
  - Chrome 113+ or Edge 113+ with WebGPU enabled
  - Or any browser with native WebGPU support

## Getting Started

### Option 1: View the Demo Directly

Simply open `index.html` in a WebGPU-supported browser. The bundled JavaScript is already included.

### Option 2: Build from Source

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the bundle:
   ```bash
   npm run build
   ```

3. Open `index.html` in your browser or use a local server:
   ```bash
   python3 -m http.server 8080
   ```
   Then navigate to `http://localhost:8080`

## Project Structure

- `index.html` - Main HTML file with the 3D canvas and UI
- `src/main.js` - Main application logic and scene setup
- `dist/bundle.js` - Bundled JavaScript (generated from src/main.js)
- `package.json` - NPM dependencies and build scripts

## Technology Stack

- **Babylon.js** - 3D engine framework
- **WebGPU** - Modern graphics API
- **esbuild** - Fast JavaScript bundler
