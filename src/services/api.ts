import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-backend-url.com/api'
    : 'http://localhost:3000/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle authentication errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (collegeId: string, password: string) =>
        api.post('/login', {collegeId, password}),

    register: (collegeId: string, password: string, phone: string) =>
        api.post('/register', {collegeId, password, phone}),
};

export const mealsAPI = {
    getTodaysMeals: () => api.get('/meals/today'),

    createMeal: (mealData: { name: string; quantity: number; price: number; description?: string }) =>
        api.post('/meals', mealData),
};

export const ordersAPI = {
    createOrder: (mealId: string) => api.post('/order', {meal_id: mealId}),

    getMyOrders: () => api.get('/orders/my'),

    getAllOrders: () => api.get('/orders/all'),
};

export default api;