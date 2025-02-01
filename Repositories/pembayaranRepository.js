const { Pembayaran, Penjualan, sequelize } = require('../models');
const { Op } = require('sequelize');

class PembayaranRepository {
    static async create(data) {
        const t = await sequelize.transaction();
        try {
            // Cek penjualan
            const penjualan = await Penjualan.findByPk(data.penjualan_id);
            if (!penjualan) {
                throw new Error('Penjualan tidak ditemukan');
            }

            // Hitung sisa pembayaran sebelumnya
            const totalPembayaran = await Pembayaran.sum('payment_amount', {
                where: { 
                    penjualan_id: data.penjualan_id,
                    payment_status: 'completed'
                }
            }) || 0;

            const remainingBalance = penjualan.grand_total - totalPembayaran - data.payment_amount;
            
            if (remainingBalance < 0) {
                throw new Error('Pembayaran melebihi total tagihan');
            }

            // Generate payment number
            const date = new Date();
            const paymentCount = await Pembayaran.count() + 1;
            const paymentNumber = `PAY${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${paymentCount.toString().padStart(4, '0')}`;

            // Buat pembayaran baru
            const pembayaran = await Pembayaran.create({
                ...data,
                payment_number: paymentNumber,
                remaining_balance: remainingBalance,
                payment_date: new Date()
            }, { transaction: t });

            await t.commit();
            return pembayaran;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async getAll() {
        return await Pembayaran.findAll({
            include: [{
                model: Penjualan,
                attributes: ['transaction_number', 'grand_total']
            }],
            order: [['payment_date', 'DESC']]
        });
    }

    static async getById(id) {
        return await Pembayaran.findByPk(id, {
            include: [{
                model: Penjualan,
                attributes: ['transaction_number', 'grand_total']
            }]
        });
    }

    static async getByPenjualanId(penjualan_id) {
        try {
            return await Pembayaran.findAll({
                where: { penjualan_id }
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PembayaranRepository; 