import { useState, useEffect } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

interface Request {
  id: string
  startDate: string
  endDate: string
  petType: 'DOG' | 'CAT'
  description: string
  location: {
    lat: number
    lng: number
    address: string
  }
  owner: {
    name: string
    email: string
  }
}

const BrowseRequests = () => {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    petType: '' as '' | 'DOG' | 'CAT',
  })

  useEffect(() => {
    fetchRequests()
  }, [filters])

  const fetchRequests = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.startDate) {
        params.append('startDate', filters.startDate.toISOString())
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate.toISOString())
      }
      if (filters.petType) {
        params.append('petType', filters.petType)
      }

      const response = await axios.get(`/api/requests?${params.toString()}`)
      setRequests(response.data)
    } catch (error) {
      setError('Failed to fetch requests')
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Browse Pet Sitting Requests</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {requests.map((request) => (
                <Marker
                  key={request.id}
                  position={[request.location.lat, request.location.lng]}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{request.petType}</h3>
                      <p>{request.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.startDate).toLocaleDateString()} -{' '}
                        {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pet Type
                </label>
                <select
                  name="petType"
                  value={filters.petType}
                  onChange={handleFilterChange}
                  className="input mt-1"
                >
                  <option value="">All</option>
                  <option value="DOG">Dogs</option>
                  <option value="CAT">Cats</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
                  onChange={handleFilterChange}
                  className="input mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''}
                  onChange={handleFilterChange}
                  className="input mt-1"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Available Requests</h3>
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold">{request.petType}</h4>
                  <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(request.startDate).toLocaleDateString()} -{' '}
                    {new Date(request.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{request.location.address}</p>
                  <button className="btn btn-primary mt-3 w-full">
                    Contact Owner
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrowseRequests 