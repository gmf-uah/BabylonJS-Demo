Precursor to a 3D minesweeper game, inspired by [this one.](http://egraether.com/mine3d/)

## Setup

1. Install Node.js dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

The server will run on `https://localhost:8089` and serve the game files while providing IP-based data persistence.

## Features

- **IP-based persistence**: User preferences (like pointer lock setting) are saved per IP address
- **Data storage**: Persistence files are stored in the `persistence/` folder as JSON files
- **HTTPS support**: Uses existing SSL certificates (cert.pem, key.pem)

## Controls

- **WASD, QE** to move
- **Hold RMB** to pan the camera
- **Pointer Lock toggle** in controls popup (saves per IP address)

camera problems
- https://forum.babylonjs.com/t/camera-angularsensibility-vs-speed/61894
- https://forum.babylonjs.com/t/to-show-your-cursor-press-esc/61901