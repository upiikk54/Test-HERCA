const marketingRepository = require('../Repositories/marketingRepository');

class marketingService {
    static async totalCommission() {
        try {
            const marketingData = await marketingRepository.totalCommission();
            
            const calculatedCommissions = marketingData.map(marketing => {
                const omset = parseFloat(marketing.total_omset);
                const komisiPersen = parseFloat(marketing.komisi_persen);
                const komisiNominal = Math.round(omset * (komisiPersen / 100));

                const bulanMap = {
                    'May': 'Mei',
                    'June': 'Juni'
                };

                return {
                    nama: marketing.name,
                    bulan: bulanMap[marketing.bulan],
                    omzet: omset,
                    komisi_persen: komisiPersen,
                    komisi_nominal: komisiNominal
                };
            });

            calculatedCommissions.sort((a, b) => {
                const bulanOrder = { 'Mei': 1, 'Juni': 2 };
                if (bulanOrder[a.bulan] !== bulanOrder[b.bulan]) {
                    return bulanOrder[a.bulan] - bulanOrder[b.bulan];
                }
                const nameOrder = { 'Alfandy': 1, 'Mery': 2, 'Danang': 3 };
                return nameOrder[a.nama] - nameOrder[b.nama];
            });
            
            return {
                status: true,
                statusCode: 200,
                message: "Data komisi marketing berhasil diambil",
                data: {
                    commissions: calculatedCommissions.map(comm => ({
                        Marketing: comm.nama,
                        Bulan: comm.bulan,
                        Omzet: Math.round(comm.omzet).toLocaleString('id-ID'),
                        'Komisi %': `${comm.komisi_persen}%`,
                        'Komisi Nominal': Math.round(comm.komisi_nominal).toLocaleString('id-ID')
                    }))
                }
            };
        } catch (err) {
            console.error('Error in marketingService.totalCommission:', err);
            return {
                status: false,
                statusCode: 500,
                message: "Gagal mengambil data komisi marketing: " + err.message,
                data: {
                    commissions: null
                }
            };
        }
    }
}

module.exports = marketingService;
