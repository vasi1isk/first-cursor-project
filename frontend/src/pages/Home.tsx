import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Pet Sitting
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Find trusted pet sitters or offer your services to pet owners
        </p>

        {!user ? (
          <div className="space-x-4">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
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
          </div>
        )}
      </div>
    </div>
  )
}

export default Home 