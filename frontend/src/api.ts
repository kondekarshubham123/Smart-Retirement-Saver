import axios from 'axios';

// the frontend will use Vite environment variables to determine the
// backend API host.  when running locally the proxy (see
// vite.config.ts) will forward `/blackrock` to localhost:5477, but for a
// production build you should set `VITE_API_BASE_URL` to the public URL of
// the backend (e.g. the Render address below).
//
// The variable is injected at build time; Vite prepends `import.meta.env.`
// and exposes only vars prefixed with `VITE_`.
const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5477/blackrock/challenge/v1';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Transaction {
    date: string;
    amount: number;
}

export interface QRule {
    fixed: number;
    start: string;
    end: string;
}

export interface PRule {
    extra: number;
    start: string;
    end: string;
}

export interface KPeriod {
    start: string;
    end: string;
}

export interface ReturnsRequest {
    age: number;
    wage: number;
    inflation: number;
    q: QRule[];
    p: PRule[];
    k: KPeriod[];
    transactions: Transaction[];
}

export interface SavingsByDate {
    start: string;
    end: string;
    amount: number;
    profit: number;
    taxBenefit: number;
}

export interface ReturnsResponse {
    totalTranscationAmount: number;
    totalCeiling: number;
    savingByDates: SavingsByDate[];
}

export interface TaskResponse {
    task_id: string;
    status: string;
}

export interface AsyncResultResponse {
    task_id: string;
    status: string;
    result?: ReturnsResponse;
    error?: string;
}

export const fetchNpsReturns = (data: ReturnsRequest) => api.post<ReturnsResponse>('/returns:nps', data);
export const fetchIndexReturns = (data: ReturnsRequest) => api.post<ReturnsResponse>('/returns:index', data);
export const submitNpsAsync = (data: ReturnsRequest) => api.post<TaskResponse>('/returns:nps_async', data);
export const submitIndexAsync = (data: ReturnsRequest) => api.post<TaskResponse>('/returns:index_async', data);
export const checkTaskStatus = (taskId: string) => api.get<AsyncResultResponse>(`/returns/status/${taskId}`);
