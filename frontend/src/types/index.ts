export interface Penjualan {
  transaction_number: string;
  grand_total: number;
}

export type PaymentMethod = 'cash' | 'transfer' | 'debit' | 'credit';

export interface Payment {
  id: number;
  penjualan_id: number;
  payment_number: string;
  payment_date: string;
  payment_amount: string;
  payment_method: PaymentMethod;
  payment_status: string;
  remaining_balance: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  Penjualan: Penjualan;
}

export interface PaymentInput {
  penjualan_id: number;
  payment_amount: number;
  payment_method: PaymentMethod;
  notes: string;
}

export interface CommissionData {
  Marketing: string;
  Bulan: string;
  Omzet: string;
  "Komisi %": string;
  "Komisi Nominal": string;
}

export interface CommissionResponse {
  status: boolean;
  message: string;
  data: {
    commissions: CommissionData[];
  };
}

export interface ApiResponse<T> {
    status: boolean;
    statusCode: number;
    message: string;
    data: T | null;
} 