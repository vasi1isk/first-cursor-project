import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary-600">
            Pet Sitting
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'OWNER' && (
                  <Link to="/create-request" className="btn btn-primary">
                    Create Request
                  </Link>
                )}
                {user.role === 'SITTER' && (
                  <Link to="/browse-requests" className="btn btn-primary">
                    Browse Requests
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="btn btn-primary">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={logout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 