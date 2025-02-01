import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Pembayaran from './pages/Pembayaran'
import MarketingCommission from './pages/MarketingCommission'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Pembayaran />} />
          <Route path="/marketing-commission" element={<MarketingCommission />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App 