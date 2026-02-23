import axios from 'axios';

const API_BASE = '/api';

export const api = {
    getProjects: () => axios.get(`${API_BASE}/projects`).then(r => r.data),
    getExperience: () => axios.get(`${API_BASE}/experience`).then(r => r.data),
    getSkills: () => axios.get(`${API_BASE}/skills`).then(r => r.data),
    submitContact: (data: { name: string; email: string; message: string }) =>
        axios.post(`${API_BASE}/contact`, data).then(r => r.data),
    chatbot: (query: string) =>
        axios.post(`${API_BASE}/chatbot`, { query }).then(r => r.data),
    getAnalytics: () => axios.get(`${API_BASE}/analytics`).then(r => r.data),
    recordVisit: () => axios.post(`${API_BASE}/analytics/visit`).then(r => r.data),
};
