import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import TripCard from '../components/TripCard'
import { useI18n } from '../context/I18nContext'
import { Plus, Compass } from 'lucide-react'

interface Trip {
  id: number
  title: string
  destination: string
  start_date: string
  end_date: string
  status: string
  budget: string
  total_expenses: string
  cover_image: string | null
}

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useI18n()

  useEffect(() => {
    api.get('/trips/')
      .then((res) => setTrips(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-16">
        <Compass className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{t('noTrips')}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('createFirstTrip')}</p>
        <Link
          to="/trips/new"
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <Plus className="h-5 w-5 mr-2" />
          {t('newTrip')}
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('myTrips')}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t('createFirstTrip')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  )
}
