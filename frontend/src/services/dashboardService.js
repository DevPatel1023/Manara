// services/dashboardService.js

import axios from 'axios';

const API_URL = 'localhost://5173' || 'https://api.yourdomain.com';
const API_TIMEOUT = 15000; // 15 seconds timeout

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      // You can implement token refresh logic here
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fetch dashboard stats
export const fetchStats = async () => {
  try {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default values if API fails
    return {
      activeQuotations: { value: 0, change: 0 },
      pendingRfqs: { value: 0, change: 0 },
      openInvoices: { value: 0, change: 0 },
      totalSpent: { value: 0, change: 0 }
    };
  }
};

// Fetch recent activity
export const fetchActivity = async () => {
  try {
    const response = await apiClient.get('/dashboard/activity');
    return response.data;
  } catch (error) {
    console.error('Error fetching activity:', error);
    return [];
  }
};

// Fetch upcoming payments
export const fetchPayments = async () => {
  try {
    const response = await apiClient.get('/dashboard/payments');
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
};

// Fetch recent quotations
export const fetchQuotations = async () => {
  try {
    const response = await apiClient.get('/dashboard/quotations');
    return response.data;
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return [];
  }
};

// Fetch recent invoices
export const fetchInvoices = async () => {
  try {
    const response = await apiClient.get('/dashboard/invoices');
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};

// Pay an invoice
export const payInvoice = async (invoiceId) => {
  try {
    const response = await apiClient.post(`/invoices/${invoiceId}/pay`);
    return response.data;
  } catch (error) {
    console.error('Error paying invoice:', error);
    throw error;
  }
};

// View invoice details
export const getInvoiceDetails = async (invoiceId) => {
  try {
    const response = await apiClient.get(`/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    throw error;
  }
};

// View quotation details
export const getQuotationDetails = async (quotationId) => {
  try {
    const response = await apiClient.get(`/quotations/${quotationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quotation details:', error);
    throw error;
  }
};