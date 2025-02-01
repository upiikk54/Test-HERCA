require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8898;
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

const marketingController = require('./Controllers/marketingController');
const pembayaranController = require('./Controllers/pembayaranController');
const penjualanController = require('./Controllers/penjualanController');

app.get('/marketing/commission', marketingController.totalCommission);

// ------------------- Pembayaran ------------------- //
app.post('/api/payments', pembayaranController.createPayment);
app.get('/api/payments', pembayaranController.getAllPayments);
app.get('/api/payments/:id', pembayaranController.getPaymentById);
// ------------------- End Pembayaran ------------------- //

// ------------------- Penjualan ------------------- //
app.get('/api/penjualan/:id', penjualanController.getPenjualanById);
// ------------------- End Penjualan ------------------- //

// ------------------- Listen Server ------------------- //
app.listen(PORT, () => {
    console.log(`Server berhasil berjalan di port http://localhost:${PORT}`);
});
// ------------------- End Listen Server ------------------- //