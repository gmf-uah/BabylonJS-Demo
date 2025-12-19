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
- `app.js` - BabylonJS scene setup and camera controls
- `babylon.js` - BabylonJS library (v6.49.0)
- `package.json` - Project dependencies and scripts

## Technologies Used

- [BabylonJS](https://www.babylonjs.com/) - WebGL/WebGPU-based 3D engine
- WebGPU - Modern graphics rendering API (with WebGL 2.0 fallback)
- JavaScript - Scene logic and controls