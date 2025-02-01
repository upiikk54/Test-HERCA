const PenjualanService = require('../Services/penjualanService');

class PenjualanController {
    static async getPenjualanById(req, res) {
        try {
            const { id } = req.params;
            const result = await PenjualanService.getPenjualanById(id);
            
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

module.exports = PenjualanController; 