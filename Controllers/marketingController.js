const marketingService = require('../Services/marketingService');

// ------------------------- Total Commission ------------------------- //
const totalCommission = async (req, res) => {

    const {
        status,
        statusCode,
        message,
        data
    } =
    await marketingService.totalCommission();

    res.status(statusCode).send({
        status: status,
        message: message,
        data: data,
    });
};
// ------------------------- End Total Commission ------------------------- //

module.exports = {
    totalCommission
}
