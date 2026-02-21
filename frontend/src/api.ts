import axios from 'axios';

const api = axios.create({
    baseURL: '/blackrock/challenge/v1',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.reload(); // Force re-auth
        }
        return Promise.reject(error);
    }
);

// --- Interface Definitions ---

export interface Transaction {
    date: string;
    amount: number;
}

export interface Rule {
    type: string;
    value?: number;
    start_date: string;
    end_date: string;
}

export interface CorpusProfile {
    id: number;
    name: string;
    age: number;
    wage: number;
    inflation: number;
    transactions: Transaction[];
    rules: Rule[];
}

export interface ReturnsRequest {
    transactions: Transaction[];
    q_rules: { fixed: number; start: string; end: string }[];
    p_rules: { extra: number; start: string; end: string }[];
    k_periods: { start: string; end: string }[];
    inflation: number;
    wage?: number;
}

export interface SavingsByDate {
    date: string;
    amount: number;
}

export interface ReturnsResponse {
    total_invested: number;
    total_remanent: number;
    projected_returns: number;
    inflation_adjusted_returns: number;
    tax_benefit?: number;
    savings_over_time: SavingsByDate[];
}

export default api;
