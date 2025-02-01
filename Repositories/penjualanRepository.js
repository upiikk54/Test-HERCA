const db = require('../models');

class PenjualanRepository {
    static async getById(id) {
        try {
            return await db.Penjualan.findByPk(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PenjualanRepository; 