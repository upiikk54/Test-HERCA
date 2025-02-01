import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { Payment, PaymentInput, Penjualan } from '../types'
import PaymentDetail from '../components/PaymentDetail'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Tunai' },
  { value: 'transfer', label: 'Transfer Bank' },
  { value: 'debit', label: 'Kartu Debit' },
  { value: 'credit', label: 'Kartu Kredit' }
] as const;

type PaymentMethod = typeof PAYMENT_METHODS[number]['value'];

const Pembayaran = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentInput>({
    penjualan_id: 0,
    payment_amount: 0,
    payment_method: 'transfer',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<Payment | null>(null)
  const [currentPenjualan, setCurrentPenjualan] = useState<Penjualan | null>(null);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await api.getAllPayments();
      console.log('API Response:', result); // Untuk debugging
      
      if (result.status && Array.isArray(result.data)) {
        setPayments(result.data);
      } else {
        setError('Format data tidak sesuai');
        setPayments([]);
      }
    } catch (err) {
      console.error('Error fetching payments:', err); // Untuk debugging
      setError('Gagal mengambil data pembayaran');
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchPenjualan = async (id: number) => {
    try {
      const response = await api.getPenjualanById(id);
      if (response.status && response.data) {
        setCurrentPenjualan(response.data);
        setError(''); // Clear any existing errors
      } else {
        setCurrentPenjualan(null);
        if (response.message) {
          setError(response.message);
        }
      }
    } catch (err) {
      setCurrentPenjualan(null);
      // Jangan tampilkan error saat pencarian
      console.log('Penjualan tidak ditemukan:', err);
    }
  };

  const handlePenjualanIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = Number(e.target.value);
    setPaymentData({ ...paymentData, penjualan_id: id });
    
    // Clear current penjualan if ID is invalid
    if (id <= 0) {
      setCurrentPenjualan(null);
      return;
    }
    
    // Tambahkan delay untuk menghindari terlalu banyak request
    const timeoutId = setTimeout(() => {
      fetchPenjualan(id);
    }, 500); // Delay 500ms

    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        setIsLoading(true)
        setError('') // Reset error message
        
        if (selectedPayment) {
            await api.updatePayment(selectedPayment.id, paymentData)
        } else {
            const response = await api.createPayment(paymentData)
            if (!response.status) {
                setError(response.message || 'Gagal menyimpan pembayaran')
                return
            }
        }
        
        fetchPayments()
        resetForm()
    } catch (err: any) {
        // Handle error message from backend
        const errorMessage = err.response?.data?.message || 'Gagal menyimpan pembayaran'
        setError(errorMessage)
    } finally {
        setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedPayment(null)
    setPaymentData({
      penjualan_id: 0,
      payment_amount: 0,
      payment_method: 'transfer',
      notes: ''
    })
  }

  // Function untuk export daftar pembayaran ke PDF
  const exportPaymentsToPDF = () => {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(16)
    doc.text('Daftar Pembayaran', 14, 15)
    doc.setFontSize(10)
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 22)

    autoTable(doc, {
      head: [[
        'No. Pembayaran',
        'No. Transaksi',
        'Tanggal',
        'Metode',
        'Jumlah',
        'Sisa',
        'Status',
        'Catatan'
      ]],
      body: payments.map(payment => [
        payment.payment_number,
        payment.Penjualan?.transaction_number || '-',
        new Date(payment.payment_date).toLocaleDateString('id-ID'),
        PAYMENT_METHODS.find(m => m.value === payment.payment_method)?.label || payment.payment_method,
        `Rp ${Number(payment.payment_amount).toLocaleString('id-ID')}`,
        `Rp ${Number(payment.remaining_balance).toLocaleString('id-ID')}`,
        payment.payment_status,
        payment.notes
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 64, 175] }
    })

    doc.save('daftar-pembayaran.pdf')
  }

  // Function untuk export daftar pembayaran ke Excel
  const exportPaymentsToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(payments.map(payment => ({
      'No. Pembayaran': payment.payment_number,
      'No. Transaksi': payment.Penjualan?.transaction_number || '-',
      'Tanggal': new Date(payment.payment_date).toLocaleDateString('id-ID'),
      'Metode Pembayaran': PAYMENT_METHODS.find(m => m.value === payment.payment_method)?.label || payment.payment_method,
      'Jumlah': `Rp ${Number(payment.payment_amount).toLocaleString('id-ID')}`,
      'Sisa': `Rp ${Number(payment.remaining_balance).toLocaleString('id-ID')}`,
      'Status': payment.payment_status,
      'Catatan': payment.notes
    })))

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Pembayaran')
    XLSX.writeFile(workbook, 'daftar-pembayaran.xlsx')
  }

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-700 p-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedPayment ? 'Edit Pembayaran' : 'Form Pembayaran'}
          </h2>
          <p className="text-blue-100 mt-1">Isi detail pembayaran di bawah ini</p>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700">{error}</p>
                  {error.includes('sudah lunas') && (
                    <p className="text-red-600 text-sm mt-1">
                      Transaksi ini sudah dibayar penuh dan tidak memerlukan pembayaran tambahan.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="penjualan_id" className="block text-sm font-medium text-gray-700">
                  ID Penjualan
                </label>
                <input
                  type="number"
                  id="penjualan_id"
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={paymentData.penjualan_id}
                  onChange={handlePenjualanIdChange}
                  required
                />
              </div>

              {currentPenjualan && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800">Info Penjualan</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-blue-600">
                      No. Transaksi: {currentPenjualan.transaction_number}
                    </p>
                    <p className="text-sm text-blue-600">
                      Total: Rp {currentPenjualan.grand_total.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="payment_amount" className="block text-sm font-medium text-gray-700">
                  Jumlah Pembayaran
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">Rp</span>
                  </div>
                  <input
                    type="number"
                    id="payment_amount"
                    className={`block w-full pl-12 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      currentPenjualan && paymentData.payment_amount > currentPenjualan.grand_total
                        ? 'border-yellow-500 focus:ring-yellow-500'
                        : ''
                    }`}
                    value={paymentData.payment_amount}
                    onChange={(e) => setPaymentData({...paymentData, payment_amount: Number(e.target.value)})}
                    required
                  />
                </div>
                {currentPenjualan && paymentData.payment_amount > currentPenjualan.grand_total && (
                  <p className="mt-1 text-sm text-yellow-600">
                    Jumlah pembayaran melebihi total transaksi
                  </p>
                )}
                {currentPenjualan && paymentData.payment_amount < currentPenjualan.grand_total && (
                  <p className="mt-1 text-sm text-blue-600">
                    Sisa yang harus dibayar: Rp {(currentPenjualan.grand_total - paymentData.payment_amount).toLocaleString('id-ID')}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                Metode Pembayaran
              </label>
              <select
                id="payment_method"
                className="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={paymentData.payment_method}
                onChange={(e) => setPaymentData({...paymentData, payment_method: e.target.value as PaymentMethod})}
                required
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Catatan
              </label>
              <textarea
                id="notes"
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={paymentData.notes}
                onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                required
              />
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-primary to-blue-700 text-white py-2 px-4 rounded-lg hover:from-primary/90 hover:to-blue-700/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  selectedPayment ? 'Update Pembayaran' : 'Simpan Pembayaran'
                )}
              </button>
              
              {selectedPayment && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Payment List Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-700 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Daftar Pembayaran</h2>
              <p className="text-blue-100 mt-1">Klik pada baris untuk melihat detail</p>
            </div>
            {!isLoading && !error && payments.length > 0 && (
              <div className="flex space-x-3">
                <button
                  onClick={exportPaymentsToExcel}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={exportPaymentsToPDF}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Export PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {!isLoading && !error && (!payments || payments.length === 0) ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat pembayaran baru.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Pembayaran</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Transaksi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sisa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(payments) && payments.map((payment) => (
                    <tr 
                      key={payment.id}
                      onClick={() => setSelectedPaymentDetail(payment)}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.payment_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.Penjualan?.transaction_number || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.payment_date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        Rp {Number(payment.payment_amount).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rp {Number(payment.remaining_balance).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.payment_status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {payment.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{payment.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedPaymentDetail && (
        <PaymentDetail
          payment={selectedPaymentDetail}
          onClose={() => setSelectedPaymentDetail(null)}
        />
      )}
    </div>
  )
}

export default Pembayaran 