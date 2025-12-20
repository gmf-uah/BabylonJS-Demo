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
- Node.js (for running a local development server)

## Getting Started

1. Start a local development server:
   ```bash
   npx http-server -p 8080
   ```
   Or use Python:
   ```bash
   python3 -m http.server 8080
   ```
   Or use Node.js:
   ```bash
   npx serve
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

That's it! No build step required - the application loads Babylon.js directly from the CDN.

## Project Structure

- `index.html` - Main HTML file with the 3D canvas and UI
- `src/main.js` - Main application logic and scene setup
- No build artifacts or bundled files needed!

## How It Works

The application loads Babylon.js directly from the official CDN (`https://cdn.babylonjs.com/babylon.js`). This means:
- No build step required
- No bundling needed
- Edit `src/main.js` and refresh the browser to see changes
- Babylon.js is always up-to-date from the CDN

## Technology Stack

- **Babylon.js** - 3D engine framework (loaded from CDN)
- **WebGPU** - Modern graphics API
