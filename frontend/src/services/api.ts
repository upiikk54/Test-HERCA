import axios from 'axios';
import { PaymentInput, Payment } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8898';

export const api = {
  // Get all payments
  getAllPayments: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payments`);
      // Pastikan kita mengakses data dari response yang benar
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment by ID
  getPaymentById: async (id: number): Promise<Payment> => {
    const response = await axios.get(`${API_URL}/api/payments/${id}`);
    return response.data;
  },

  // Create new payment
  createPayment: async (data: PaymentInput) => {
    try {
      const response = await axios.post(`${API_URL}/api/payments`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get marketing commissions
  getMarketingCommissions: async () => {
    try {
      const response = await axios.get(`${API_URL}/marketing/commission`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get penjualan by ID
  getPenjualanById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/api/penjualan/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 