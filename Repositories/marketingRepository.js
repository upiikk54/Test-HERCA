const {
    Marketing,
    Penjualan,
    sequelize
} = require('../models');
const { Op } = require('sequelize');

class marketingRepository {
    // ------------------------- Total Commission ------------------------- //
    static async totalCommission() {
        try {
            // Tambahkan logging untuk melihat data mentah
            const rawData = await Penjualan.findAll({
                attributes: [
                    'marketing_id',
                    'total_balance',
                    'date'
                ],
                include: [{
                    model: Marketing,
                    attributes: ['id', 'name']
                }],
                where: {
                    date: {
                        [Op.and]: [
                            sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM date')), '2023'),
                            sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM date')), {
                                [Op.in]: [5, 6]
                            })
                        ]
                    }
                },
                raw: true
            });

            console.log('Raw Data:', JSON.stringify(rawData, null, 2));

            // Kelompokkan data per marketing per bulan
            const groupedData = {};
            rawData.forEach(data => {
                const month = new Date(data.date).getMonth() + 1;
                const key = `${data['Marketing.id']}-${month}`;
                if (!groupedData[key]) {
                    groupedData[key] = {
                        id: data['Marketing.id'],
                        name: data['Marketing.name'],
                        month: month,
                        total: 0
                    };
                }
                groupedData[key].total += parseFloat(data.total_balance);
            });

            console.log('Grouped Data:', JSON.stringify(groupedData, null, 2));

            const marketings = await Marketing.findAll({
                attributes: ['id', 'name'],
                order: [['name', 'ASC']],
                raw: true
            });

            const bulanMap = { 5: 'May', 6: 'June' };
            const fullData = [];

            // Ubah urutan loop: bulan dulu, baru marketing
            [5, 6].forEach(month => {
                marketings.forEach(marketing => {
                    const key = `${marketing.id}-${month}`;
                    const monthlyOmset = groupedData[key] ? groupedData[key].total : 0;
                    let komisiPersen = 0;

                    if (monthlyOmset >= 500000000) komisiPersen = 10;
                    else if (monthlyOmset >= 200000000) komisiPersen = 5;
                    else if (monthlyOmset >= 100000000) komisiPersen = 2.5;

                    fullData.push({
                        id: marketing.id,
                        name: marketing.name,
                        bulan: bulanMap[month],
                        total_omset: monthlyOmset.toString(),
                        komisi_persen: komisiPersen
                    });
                });
            });

            console.log('Final Data:', JSON.stringify(fullData, null, 2));
            return fullData;
        } catch (error) {
            console.error('Error in marketingRepository.totalCommission:', error);
            throw error;
        }
    };
    // ------------------------- End Total Commission ------------------------- //
}

module.exports = marketingRepository;