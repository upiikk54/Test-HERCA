const PenjualanRepository = require('../Repositories/penjualanRepository');

class PenjualanService {
    static async getPenjualanById(id) {
        try {
            const penjualan = await PenjualanRepository.getById(id);
            if (!penjualan) {
                return {
                    status: false,
                    statusCode: 404,
                    message: "Data penjualan tidak ditemukan",
                    data: null
                };
            }
            
            return {
                status: true,
                statusCode: 200,
                message: "Data penjualan berhasil diambil",
                data: penjualan
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

module.exports = PenjualanService; 