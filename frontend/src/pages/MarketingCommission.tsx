import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { CommissionData } from '../types'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const MarketingCommission = () => {
  const [commissions, setCommissions] = useState<CommissionData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Helper function untuk mengkonversi string angka dengan format Indonesia ke number
  const parseIDRNumber = (str: string): number => {
    // Hapus semua titik dan koma, lalu konversi ke number
    return Number(str.replace(/\./g, '').replace(/,/g, ''))
  }

  // Helper function untuk format currency
  const formatIDR = (number: number): string => {
    return new Intl.NumberFormat('id-ID').format(number)
  }

  const fetchCommissions = async () => {
    try {
      setIsLoading(true)
      setError('')
      const result = await api.getMarketingCommissions()
      if (result.status && result.data.commissions) {
        setCommissions(result.data.commissions)
      }
    } catch (err) {
      setError('Gagal mengambil data komisi')
      setCommissions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Hitung total
  const totalOmzet = commissions.reduce((sum, commission) => 
    sum + parseIDRNumber(commission.Omzet), 0
  )

  const totalKomisi = commissions.reduce((sum, commission) => 
    sum + parseIDRNumber(commission["Komisi Nominal"]), 0
  )

  // Function untuk export ke PDF
  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(16)
    doc.text('Laporan Komisi Marketing', 14, 15)
    doc.setFontSize(10)
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 22)

    autoTable(doc, {
      head: [[
        'Marketing',
        'Bulan',
        'Omzet',
        'Komisi %',
        'Komisi Nominal'
      ]],
      body: commissions.map(commission => [
        commission.Marketing,
        commission.Bulan,
        `Rp ${formatIDR(parseIDRNumber(commission.Omzet))}`,
        commission["Komisi %"],
        `Rp ${formatIDR(parseIDRNumber(commission["Komisi Nominal"]))}`
      ]),
      foot: [[
        'TOTAL',
        '',
        `Rp ${formatIDR(totalOmzet)}`,
        '-',
        `Rp ${formatIDR(totalKomisi)}`
      ]],
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 64, 175] },
      footStyles: { fillColor: [241, 245, 249] }
    })

    doc.save('laporan-komisi-marketing.pdf')
  }

  // Function untuk export ke Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(commissions.map(commission => ({
      'Marketing': commission.Marketing,
      'Bulan': commission.Bulan,
      'Omzet': `Rp ${formatIDR(parseIDRNumber(commission.Omzet))}`,
      'Komisi %': commission["Komisi %"],
      'Komisi Nominal': `Rp ${formatIDR(parseIDRNumber(commission["Komisi Nominal"]))}`
    })))

    // Tambahkan total di bawah
    XLSX.utils.sheet_add_json(worksheet, [{
      'Marketing': 'TOTAL',
      'Bulan': '',
      'Omzet': `Rp ${formatIDR(totalOmzet)}`,
      'Komisi %': '-',
      'Komisi Nominal': `Rp ${formatIDR(totalKomisi)}`
    }], {
      skipHeader: true,
      origin: -1 // -1 means append to bottom
    })

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Komisi Marketing')
    XLSX.writeFile(workbook, 'laporan-komisi-marketing.xlsx')
  }

  useEffect(() => {
    fetchCommissions()
  }, [])

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-700 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Komisi Marketing</h2>
              <p className="text-blue-100 mt-1">Laporan komisi marketing per bulan</p>
            </div>
            {!isLoading && !error && commissions.length > 0 && (
              <div className="flex space-x-3">
                <button
                  onClick={exportToExcel}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={exportToPDF}
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

          {!isLoading && !error && commissions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marketing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Omzet</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Komisi %</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Komisi Nominal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {commissions.map((commission, index) => (
                    <tr 
                      key={index}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {commission.Marketing}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {commission.Bulan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        Rp {formatIDR(parseIDRNumber(commission.Omzet))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {commission["Komisi %"]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <span className={`${parseIDRNumber(commission["Komisi Nominal"]) > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                          Rp {formatIDR(parseIDRNumber(commission["Komisi Nominal"]))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      Rp {formatIDR(totalOmzet)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                      Rp {formatIDR(totalKomisi)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarketingCommission 