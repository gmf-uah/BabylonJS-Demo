// Simple Express server with IP-based persistence
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const port = 8089;

// Middleware to parse JSON bodies
app.use(express.json());

// Trust proxy headers if behind reverse proxy (for accurate IP detection)
app.set('trust proxy', true);

// Serve static files from pages directory (HTML files)
app.use(express.static(path.join(__dirname, '../../pages')));
// Serve JS files from src/client with /src/client prefix
app.use('/src/client', express.static(path.join(__dirname, '../client')));
// Serve other static assets (like CSS, images) from root
app.use(express.static(path.join(__dirname, '../..')));

// Helper function to get client IP address
function getClientIP(req) {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null);
}

// Helper function to sanitize IP for filename (replace colons and dots with underscores)
function sanitizeIP(ip) {
    return ip.replace(/[:.]/g, '_');
}

// Helper function to get persistence file path for an IP
function getPersistenceFilePath(ip) {
    const sanitized = sanitizeIP(ip);
    return path.join(__dirname, '../../persistence', `user_${sanitized}.json`);
}

// Helper function to load user preferences
function loadUserPreferences(ip) {
    try {
        const filePath = getPersistenceFilePath(ip);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading preferences for IP', ip, ':', error);
    }
    // Return default preferences
    return {
        usePointerLock: false,
        lastUpdated: new Date().toISOString()
    };
}

// Helper function to save user preferences
function saveUserPreferences(ip, preferences) {
    try {
        const filePath = getPersistenceFilePath(ip);
        const data = {
            ...preferences,
            lastUpdated: new Date().toISOString()
        };
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving preferences for IP', ip, ':', error);
        return false;
    }
}

// API endpoint to get user preferences
app.get('/api/preferences', (req, res) => {
    const clientIP = getClientIP(req);
    console.log('GET preferences for IP:', clientIP);
    
    const preferences = loadUserPreferences(clientIP);
    res.json(preferences);
});

// API endpoint to update user preferences
app.post('/api/preferences', (req, res) => {
    const clientIP = getClientIP(req);
    console.log('POST preferences for IP:', clientIP, 'Data:', req.body);
    
    const currentPreferences = loadUserPreferences(clientIP);
    const updatedPreferences = {
        ...currentPreferences,
        ...req.body
    };
    
    const success = saveUserPreferences(clientIP, updatedPreferences);
    if (success) {
        res.json({ success: true, preferences: updatedPreferences });
    } else {
        res.status(500).json({ success: false, error: 'Failed to save preferences' });
    }
});

// Create persistence directory if it doesn't exist
const persistenceDir = path.join(__dirname, '../../persistence');
if (!fs.existsSync(persistenceDir)) {
    fs.mkdirSync(persistenceDir, { recursive: true });
}

// Start server with HTTPS (using existing certificates)
const options = {
    key: fs.readFileSync(path.join(__dirname, '../../key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../../cert.pem'))
};

https.createServer(options, app).listen(port, () => {
    console.log(`3D Minesweeper server running on https://localhost:${port}`);
    console.log('Persistence data will be stored in:', persistenceDir);
});