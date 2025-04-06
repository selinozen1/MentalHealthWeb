import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Bir hata oluştu' };
    }
};

const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Bir hata oluştu' };
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser
};

export default authService; 