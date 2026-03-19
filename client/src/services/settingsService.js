const API_URL = import.meta.env.VITE_API_URL + '/settings';

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

export const updateProfile = async (token, profileData) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(profileData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update profile');
    return data;
};

export const setup2FA = async (token) => {
    const response = await fetch(`${API_URL}/2fa/setup`, {
        method: 'POST',
        headers: getAuthHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send verification code');
    return data;
};

export const verify2FA = async (token, otp) => {
    const response = await fetch(`${API_URL}/2fa/verify`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ otp })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Invalid or expired code');
    return data;
};

export const disable2FA = async (token) => {
    const response = await fetch(`${API_URL}/2fa/disable`, {
        method: 'POST',
        headers: getAuthHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to disable 2FA');
    return data;
};

export const requestDeleteAccount = async (token) => {
    const response = await fetch(`${API_URL}/delete-account/request`, {
        method: 'POST',
        headers: getAuthHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send deletion code');
    return data;
};

export const confirmDeleteAccount = async (token, otp) => {
    const response = await fetch(`${API_URL}/delete-account/confirm`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ otp })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Invalid or expired deletion code');
    return data;
};
