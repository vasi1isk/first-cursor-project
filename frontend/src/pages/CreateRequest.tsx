import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'

interface RequestFormData {
  startDate: Date | null
  endDate: Date | null
  petType: 'DOG' | 'CAT'
  description: string
  location: {
    lat: number
    lng: number
    address: string
  }
}

const CreateRequest = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RequestFormData>({
    startDate: null,
    endDate: null,
    petType: 'DOG',
    description: '',
    location: {
      lat: 0,
      lng: 0,
      address: '',
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/requests', formData)
      navigate('/')
    } catch (error) {
      console.error('Failed to create request:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        address: e.target.value,
      },
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Create Pet Sitting Request</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              className="input mt-1"
              minDate={new Date()}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
              className="input mt-1"
              minDate={formData.startDate || new Date()}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="petType" className="block text-sm font-medium text-gray-700">
            Pet Type
          </label>
          <select
            id="petType"
            name="petType"
            value={formData.petType}
            onChange={handleChange}
            className="input mt-1"
          >
            <option value="DOG">Dog</option>
            <option value="CAT">Cat</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location.address}
            onChange={handleLocationChange}
            placeholder="Enter your address"
            className="input mt-1"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Create Request
        </button>
      </form>
    </div>
  )
}

export default CreateRequest 