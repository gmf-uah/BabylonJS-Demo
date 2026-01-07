// Simple Express server with IP-based persistence
const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");

const app = express();
const port = 8089;

// Middleware to parse JSON bodies
app.use(express.json());

// Trust proxy headers if behind reverse proxy (for accurate IP detection)
app.set("trust proxy", true);

// Serve static files from pages directory (HTML files)
app.use(express.static(path.join(__dirname, "../../pages")));
// Serve JS files from src/client with /src/client prefix
app.use("/src/client", express.static(path.join(__dirname, "../client")));
// Serve other static assets (like CSS, images) from root
app.use(express.static(path.join(__dirname, "../..")));

// Helper function to get client IP address
function getClientIP(req) {
    return (
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null)
    );
}

// Helper function to get the main persistence file path
function getPersistenceFilePath() {
    return path.join(__dirname, "../../persistence", "users.json");
}

// Helper function to load all user data
function loadAllUserData() {
    try {
        const filePath = getPersistenceFilePath();
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf8");
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error loading user data:", error);
    }
    // Return default structure
    return { users: {} };
}

// Helper function to save all user data
function saveAllUserData(allUserData) {
    try {
        const filePath = getPersistenceFilePath();
        fs.writeFileSync(filePath, JSON.stringify(allUserData, null, 2));
        return true;
    } catch (error) {
        console.error("Error saving user data:", error);
        return false;
    }
}

// Helper function to load user preferences
function loadUserPreferences(ip) {
    try {
        const allUserData = loadAllUserData();
        if (allUserData.users[ip]) {
            return allUserData.users[ip];
        }
    } catch (error) {
        console.error("Error loading preferences for IP", ip, ":", error);
    }
    // Return default preferences
    return {
        usePointerLock: false,
        lastUpdated: Date.now(),
    };
}

// Helper function to save user preferences
function saveUserPreferences(ip, preferences) {
    console.log(preferences);
    try {
        const allUserData = loadAllUserData();
        const updatedPreferences = {
            ...preferences,
            lastUpdated: Date.now(),
        };

        allUserData.users[ip] = updatedPreferences;
        return saveAllUserData(allUserData);
    } catch (error) {
        console.error("Error saving preferences for IP", ip, ":", error);
        return false;
    }
}

// API endpoint to get user preferences
app.get("/api/preferences", (req, res) => {
    const clientIP = getClientIP(req);
    console.log("GET preferences for IP:", clientIP);

    const preferences = loadUserPreferences(clientIP);
    res.json(preferences);
});

// API endpoint to update user preferences
app.post("/api/preferences", (req, res) => {
    const clientIP = getClientIP(req);
    console.log("POST preferences for IP:", clientIP, "Data:", req.body);

    const currentPreferences = loadUserPreferences(clientIP);
    const updatedPreferences = {
        ...currentPreferences,
        ...req.body,
    };

    const success = saveUserPreferences(clientIP, updatedPreferences);
    if (success) {
        res.json({ success: true, preferences: updatedPreferences });
    } else {
        res.status(500).json({
            success: false,
            error: "Failed to save preferences",
        });
    }
});

// Create persistence directory and file if they don't exist
const persistenceDir = path.join(__dirname, "../../persistence");
if (!fs.existsSync(persistenceDir)) {
    fs.mkdirSync(persistenceDir, { recursive: true });
}

// Initialize users.json file if it doesn't exist
const usersFilePath = getPersistenceFilePath();
if (!fs.existsSync(usersFilePath)) {
    const initialData = { users: {} };
    fs.writeFileSync(usersFilePath, JSON.stringify(initialData, null, 2));
}

// Start server with HTTPS (using existing certificates)
const options = {
    key: fs.readFileSync(path.join(__dirname, "../../key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../../cert.pem")),
};

https.createServer(options, app).listen(port, () => {
    console.log(`3D Minesweeper server running on https://localhost:${port}`);
    // console.log('User data will be stored in:', usersFilePath);
});
