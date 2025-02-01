import { Payment } from '../types'

interface PaymentDetailProps {
  payment: Payment
  onClose: () => void
}

const PaymentDetail = ({ payment, onClose }: PaymentDetailProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-primary to-blue-700 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Detail Pembayaran</h2>
              <p className="text-blue-100 mt-1">{payment.payment_number}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Nomor Transaksi</p>
              <p className="text-lg font-semibold">{payment.Penjualan.transaction_number}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Tanggal Pembayaran</p>
              <p className="text-lg font-semibold">
                {new Date(payment.payment_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Metode Pembayaran</p>
              <p className="text-lg font-semibold capitalize">{payment.payment_method}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                payment.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {payment.payment_status}
              </span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Transaksi</span>
              <span className="text-lg font-bold">
                Rp {payment.Penjualan.grand_total.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Jumlah Pembayaran</span>
              <span className="text-lg font-bold text-primary">
                Rp {Number(payment.payment_amount).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sisa Pembayaran</span>
              <span className="text-lg font-bold text-red-600">
                Rp {Number(payment.remaining_balance).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-500 mb-2">Catatan</p>
            <p className="text-gray-700">{payment.notes}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentDetail 