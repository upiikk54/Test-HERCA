const PembayaranRepository = require('../Repositories/pembayaranRepository');
const db = require('../models');

class PembayaranService {
    static async createPayment(paymentData) {
        try {
            // Ambil data penjualan untuk cek grand_total
            const penjualan = await db.Penjualan.findByPk(paymentData.penjualan_id);
            if (!penjualan) {
                throw new Error('Penjualan tidak ditemukan');
            }

            // Cek apakah sudah ada pembayaran yang completed
            const existingPayments = await PembayaranRepository.getByPenjualanId(paymentData.penjualan_id);
            const hasCompletedPayment = existingPayments.some(payment => payment.payment_status === 'completed');
            
            if (hasCompletedPayment) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Pembayaran tidak dapat dilakukan karena transaksi ini sudah lunas",
                    data: null
                };
            }

            // Tentukan payment status berdasarkan amount
            const payment_status = 
                Number(paymentData.payment_amount) >= penjualan.grand_total 
                    ? 'completed' 
                    : 'pending';

            // Hitung sisa pembayaran
            const remaining_balance = Math.max(
                penjualan.grand_total - Number(paymentData.payment_amount), 
                0
            );

            // Buat payment dengan status yang sesuai
            const pembayaran = await PembayaranRepository.create({
                ...paymentData,
                payment_status,
                remaining_balance
            });
            
            return {
                status: true,
                statusCode: 201,
                message: "Pembayaran berhasil dibuat",
                data: pembayaran
            };
        } catch (error) {
            return {
                status: false,
                statusCode: 400,
                message: error.message,
                data: null
            };
        }
    }

    static async getAllPayments() {
        try {
            const pembayarans = await PembayaranRepository.getAll();
            
            return {
                status: true,
                statusCode: 200,
                message: "Data pembayaran berhasil diambil",
                data: pembayarans
            };
        } catch (error) {
            return {
                status: false,
                statusCode: 500,
                message: error.message,
                data: null
            };
        }
    }

    static async getPaymentById(id) {
        try {
            const pembayaran = await PembayaranRepository.getById(id);
            if (!pembayaran) {
                return {
                    status: false,
                    statusCode: 404,
                    message: "Pembayaran tidak ditemukan",
                    data: null
                };
            }
            
            return {
                status: true,
                statusCode: 200,
                message: "Data pembayaran berhasil diambil",
                data: pembayaran
            };
        } catch (error) {
            return {
                status: false,
                statusCode: 500,
                message: error.message,
                data: null
            };
        }
    }
}

module.exports = PembayaranService; 