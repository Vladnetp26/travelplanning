import { Link } from 'react-router-dom'
import { MapPin, Calendar, Wallet } from 'lucide-react'
import { useI18n } from '../context/I18nContext'

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

interface TripCardProps {
  trip: Trip
}

const statusColors: Record<string, string> = {
  planned: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export default function TripCard({ trip }: TripCardProps) {
  const { t } = useI18n()
  const formatDate = (date: string) => new Date(date).toLocaleDateString(t('appName') === 'TripPlanner' ? 'ru-RU' : 'en-US')

  return (
    <Link to={`/trips/${trip.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border dark:border-gray-700">
        <div className="h-40 bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
          {trip.cover_image ? (
            <img src={trip.cover_image} alt={trip.title} className="w-full h-full object-cover" />
          ) : (
            <MapPin className="h-16 w-16 text-white opacity-50" />
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{trip.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[trip.status]}`}>
              {t('tripStatus', trip.status)}
            </span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {trip.destination}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Wallet className="h-4 w-4 mr-1" />
              {t('budget')}: {trip.budget} ₽
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {t('spent')}: {trip.total_expenses} ₽
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
