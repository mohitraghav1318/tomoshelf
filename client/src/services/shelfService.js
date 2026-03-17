const API_URL = import.meta.env.VITE_API_URL_SHELF;

// Get user's shelf (with optional status filter)
export const getShelf = async (token, status = null) => {
    try {
        const url = status ? `${API_URL}?status=${status}` : API_URL;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch shelf');
        }

        return data.shelf;
    } catch (error) {
        throw error;
    }
};

// Add book to shelf
export const addBookToShelf = async (token, bookId, bookData, status = 'want-to-read') => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ bookId, bookData, status })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to add book to shelf');
        }

        return data.entry;
    } catch (error) {
        throw error;
    }
};

// Update shelf entry (status or progress)
export const updateShelfEntry = async (token, entryId, updates) => {
    try {
        const response = await fetch(`${API_URL}/${entryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update shelf entry');
        }

        return data.entry;
    } catch (error) {
        throw error;
    }
};

// Remove book from shelf
export const removeBookFromShelf = async (token, entryId) => {
    try {
        const response = await fetch(`${API_URL}/${entryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to remove book from shelf');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Check if book is in shelf
export const checkBookInShelf = async (token, bookId) => {
    try {
        const response = await fetch(`${API_URL}/check/${bookId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to check shelf');
        }

        return data;
    } catch (error) {
        throw error;
    }
};