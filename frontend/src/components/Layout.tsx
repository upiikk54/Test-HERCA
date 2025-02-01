import { Link, Outlet, useLocation } from 'react-router-dom'

const Layout = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-primary to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-lg">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold">HERCA Payment System</h1>
                <p className="text-blue-100">Manage your payments efficiently</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-white text-primary' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Pembayaran
              </Link>
              <Link
                to="/marketing-commission"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/marketing-commission' 
                    ? 'bg-white text-primary' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Komisi Marketing
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">&copy; 2024 HERCA. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout 