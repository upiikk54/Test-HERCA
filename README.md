# Test-HERCA

## Struktur Database

### Tabel Marketing
- id (integer)
- name (string)

### Tabel Penjualan
- id (integer)
- transaction_number (string)
- marketing_id (integer)
- date (date)
- cargo_fee (integer)
- total_balance (integer)
- grand_total (integer)

### Tabel Pembayaran
- id (integer)
- penjualan_id (integer)
- payment_number (string)
- payment_date (date)
- payment_amount (decimal)
- payment_method (enum: 'cash', 'transfer', 'debit', 'credit')
- payment_status (enum: 'pending', 'completed')
- remaining_balance (decimal)
- notes (text)

## API Endpoints

### Pembayaran
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create new payment

### Penjualan
- `GET /api/penjualan/:id` - Get penjualan by ID

### Marketing
- `GET /marketing/commission` - Get marketing commission report

## Instalasi
1. Clone repository
2. Install dependencies `yarn install` on folder TEST-HERCA for `backend` 
3. Install dependencies with `cd frontend` then `yarn install` on folder frontend for `frontend`
4. Configuration `.env` on folder `TEST-HERCA` for `backend`
5. Run create database `npx sequelize-cli db:create`
6. Run migration `npx sequelize-cli db:migrate`
7. Run server `yarn dev` for `backend`
8. Run server `yarn start` for `frontend`

## Penggunaan Aplikasi

### Membuat Pembayaran Baru
1. Masukkan ID Penjualan
2. Sistem akan menampilkan detail transaksi
3. Masukkan jumlah pembayaran
4. Pilih metode pembayaran
5. Tambahkan catatan (opsional)
6. Klik "Simpan Pembayaran"

### Export Data
1. Untuk Pembayaran:
   - Klik tombol "Export Excel" atau "Export PDF" di section Daftar Pembayaran
2. Untuk Komisi Marketing:
   - Buka halaman Komisi Marketing
   - Klik tombol "Export Excel" atau "Export PDF"

## License

[MIT License](LICENSE)

## Contact

Praditya Luthfi Surya Laksono - pradityaluthfi54@gmail.com

Project Link: https://github.com/upiikk54/Test-HERCA