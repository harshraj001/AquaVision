import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

// States API
export const statesAPI = {
    getAll: () => api.get('/states'),
    getOne: (stateCode) => api.get(`/states/${stateCode}`),
    getWells: (stateCode, district) =>
        api.get(`/states/${stateCode}/wells`, { params: { district } }),
};

// Simulation API
export const simulationAPI = {
    getStateData: (stateCode, date, district) =>
        api.get(`/simulation/${stateCode}`, { params: { date, district } }),
    getWellData: (stateCode, wellId, params) =>
        api.get(`/simulation/${stateCode}/${wellId}`, { params }),
    getDateRange: (stateCode) =>
        api.get(`/simulation/${stateCode}/daterange`),
};

// Export API
export const exportAPI = {
    requestExport: (data) => api.post('/export/request', data),
};

export default api;
