const PembayaranService = require('../Services/pembayaranService');

class PembayaranController {
    static async createPayment(req, res) {
        try {
            const result = await PembayaranService.createPayment(req.body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                status: false,
                statusCode: 500,
                message: error.message,
                data: null
            });
        }
    }

    static async getAllPayments(req, res) {
        try {
            const result = await PembayaranService.getAllPayments();
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                status: false,
                statusCode: 500,
                message: error.message,
                data: null
            });
        }
    }

    static async getPaymentById(req, res) {
        try {
            const result = await PembayaranService.getPaymentById(req.params.id);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                status: false,
                statusCode: 500,
                message: error.message,
                data: null
            });
        }
    }
}

module.exports = PembayaranController; 