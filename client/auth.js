// Authentication utilities

// Detect API base URL based on current port
// If running on port 8080 (client dev server), use server on port 3000
// Otherwise use relative URLs (when served by Express server)
const API_BASE_URL = window.location.port === '8080' 
   

// Get stored token
function getToken() {
    return localStorage.getItem('token');
}

// Get stored user
function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Logout user
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Make authenticated API request
async function apiRequest(url, options = {}) {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
    });

    if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
        logout();
        throw new Error('Session expired. Please login again.');
    }

    return response;
}

// Verify token on page load
async function verifyAuth() {
    const token = getToken();
    if (!token) {
        return false;
    }

    try {
        const response = await apiRequest('/api/me');
        if (response.ok) {
            const user = await response.json();
            localStorage.setItem('user', JSON.stringify(user));
            return true;
        }
    } catch (error) {
        console.error('Auth verification failed:', error);
    }

    return false;
}

