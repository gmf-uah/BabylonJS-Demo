// Client-side persistence manager
// Handles loading and saving user preferences via API calls

let cachedPreferences = null;

// Load preferences from server
async function loadPreferences() {
    try {
        const response = await fetch('/api/preferences');
        if (response.ok) {
            cachedPreferences = await response.json();
            // console.log('Loaded preferences:', cachedPreferences);
            return cachedPreferences;
        } else {
            console.warn('Failed to load preferences from server');
            cachedPreferences = { usePointerLock: false };
            return cachedPreferences;
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
        cachedPreferences = { usePointerLock: false };
        return cachedPreferences;
    }
}

// Save preferences to server
async function savePreferences(newPreferences) {
    try {
        const response = await fetch('/api/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPreferences)
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                cachedPreferences = result.preferences;
                console.log('Saved preferences:', cachedPreferences);
                return true;
            } else {
                console.error('Server reported failure saving preferences:', result.error);
                return false;
            }
        } else {
            console.error('Failed to save preferences, status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error saving preferences:', error);
        return false;
    }
}

// Update a specific preference
async function updatePreference(key, value) {
    const current = await getPreferences();
    const newPreferences = {
        ...current,
        [key]: value
    };
    return await savePreferences(newPreferences);
}

// Get current preferences (loads from server if not already loaded)
async function getPreferences() {
    if (!cachedPreferences) {
        await loadPreferences();
    }
    return cachedPreferences;
}

// Get a specific preference value
async function getPreference(key, defaultValue = null) {
    const prefs = await getPreferences();
    return prefs.hasOwnProperty(key) ? prefs[key] : defaultValue;
}

// Export functions
export { loadPreferences, savePreferences, updatePreference, getPreferences, getPreference };

// Make functions available globally for HTML script tags
window.getPreferences = getPreferences;
window.updatePreference = updatePreference;