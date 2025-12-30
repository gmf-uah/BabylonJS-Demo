// Client-side persistence manager
// Handles loading and saving user preferences via API calls

class PreferencesManager {
    constructor() {
        this.preferences = {
            usePointerLock: false
        };
        this.loaded = false;
    }

    // Load preferences from server
    async loadPreferences() {
        try {
            const response = await fetch('/api/preferences');
            if (response.ok) {
                this.preferences = await response.json();
                this.loaded = true;
                // console.log('Loaded preferences:', this.preferences);
                return this.preferences;
            } else {
                // console.warn('Failed to load preferences from server');
                this.loaded = true; // Use defaults
                return this.preferences;
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
            this.loaded = true; // Use defaults
            return this.preferences;
        }
    }

    // Save preferences to server
    async savePreferences(newPreferences) {
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
                    this.preferences = result.preferences;
                    console.log('Saved preferences:', this.preferences);
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
    async updatePreference(key, value) {
        const newPreferences = {
            ...this.preferences,
            [key]: value
        };
        return await this.savePreferences(newPreferences);
    }

    // Get current preferences (loads from server if not already loaded)
    async getPreferences() {
        if (!this.loaded) {
            await this.loadPreferences();
        }
        return this.preferences;
    }

    // Get a specific preference value
    async getPreference(key, defaultValue = null) {
        const prefs = await this.getPreferences();
        return prefs.hasOwnProperty(key) ? prefs[key] : defaultValue;
    }
}

// Create singleton instance
window.preferencesManager = new PreferencesManager();

export default window.preferencesManager;