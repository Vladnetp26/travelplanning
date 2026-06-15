import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useI18n } from '../context/I18nContext'
import { useSettings } from '../hooks/useSettings'
import { formatCurrency } from '../utils/format'
import {
  ArrowLeft, MapPin, Calendar, Wallet, Trash2, Edit, Plus, Check, X,
  Plane, Hotel, Train, Car, FileText, Mail, Sparkles, Map as MapIcon
} from 'lucide-react'

interface Trip {
  id: number
  title: string
  description: string
  destination: string
  start_date: string
  end_date: string
  status: string
  budget: string
  total_expenses: string
}

interface ItineraryItem {
  id: number
  date: string
  time: string | null
  title: string
  description: string
  location: string
}

interface Expense {
  id: number
  title: string
  amount: string
  category: string
  date: string
}

interface PackingItem {
  id: number
  name: string
  is_packed: boolean
}

interface Booking {
  id: number
  booking_type: string
  title: string
  confirmation_number: string
  start_date: string
  end_date: string
  location: string
  price: string
}

type TabType = 'itinerary' | 'expenses' | 'packing' | 'bookings' | 'map' | 'recommendations'

const bookingIcons: Record<string, React.ReactNode> = {
  flight: <Plane className="h-4 w-4" />,
  hotel: <Hotel className="h-4 w-4" />,
  train: <Train className="h-4 w-4" />,
  car: <Car className="h-4 w-4" />,
  other: <FileText className="h-4 w-4" />,
}

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const { settings } = useSettings()

  const [trip, setTrip] = useState<Trip | null>(null)
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [packing, setPacking] = useState<PackingItem[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('itinerary')
  const [emailText, setEmailText] = useState('')
  const [aiQuery, setAiQuery] = useState('')
  const [recommendations, setRecommendations] = useState<string[]>([])

  const [newItem, setNewItem] = useState({
    itinerary: { title: '', date: '', time: '', location: '', description: '' },
    expense: { title: '', amount: '', category: 'other', date: '' },
    packing: { name: '' },
    booking: { booking_type: 'flight', title: '', confirmation_number: '', location: '', price: '', start_date: '', end_date: '' },
  })

  useEffect(() => {
    if (id) {
      api.get(`/trips/${id}/`).then((res) => {
        setTrip(res.data)
        setItinerary(res.data.itinerary_items || [])
        setExpenses(res.data.expenses || [])
        setPacking(res.data.packing_items || [])
        setBookings(res.data.bookings || [])
      })
    }
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Удалить поездку?')) return
    await api.delete(`/trips/${id}/`)
    navigate('/')
  }

  const addItinerary = async () => {
    if (!id) return
    const res = await api.post('/itinerary/', { ...newItem.itinerary, trip: id })
    setItinerary([...itinerary, res.data])
    setNewItem({ ...newItem, itinerary: { title: '', date: '', time: '', location: '', description: '' } })
  }

  const addExpense = async () => {
    if (!id) return
    const res = await api.post('/expenses/', { ...newItem.expense, trip: id })
    setExpenses([...expenses, res.data])
    setNewItem({ ...newItem, expense: { title: '', amount: '', category: 'other', date: '' } })
    if (trip) setTrip({ ...trip, total_expenses: String(Number(trip.total_expenses) + Number(res.data.amount)) })
  }

  const addPacking = async () => {
    if (!id) return
    const res = await api.post('/packing/', { ...newItem.packing, trip: id })
    setPacking([...packing, res.data])
    setNewItem({ ...newItem, packing: { name: '' } })
  }

  const addBooking = async () => {
    if (!id) return
    const res = await api.post('/bookings/', { ...newItem.booking, trip: id })
    setBookings([...bookings, res.data])
    setNewItem({ ...newItem, booking: { booking_type: 'flight', title: '', confirmation_number: '', location: '', price: '', start_date: '', end_date: '' } })
  }

  const parseEmail = async () => {
    if (!id || !emailText) return
    const res = await api.post('/parse-booking-email/', { email_text: emailText, trip: id })
    setBookings([...bookings, res.data.booking])
    setEmailText('')
  }

  const getRecommendations = () => {
    setRecommendations([
      `${trip?.destination}: музеи и достопримечательности`,
      `Рестораны ${trip?.destination}: местная кухня`,
      `События в ${trip?.destination} на даты поездки`,
      `Популярные маршруты из ${trip?.destination}`,
    ])
  }

  const togglePacking = async (item: PackingItem) => {
    const res = await api.patch(`/packing/${item.id}/`, { is_packed: !item.is_packed })
    setPacking(packing.map((p) => (p.id === item.id ? res.data : p)))
  }

  const deleteItem = async (type: string, itemId: number) => {
    await api.delete(`/${type}/${itemId}/`)
    if (type === 'itinerary') setItinerary(itinerary.filter((i) => i.id !== itemId))
    if (type === 'expenses') setExpenses(expenses.filter((e) => e.id !== itemId))
    if (type === 'packing') setPacking(packing.filter((p) => p.id !== itemId))
    if (type === 'bookings') setBookings(bookings.filter((b) => b.id !== itemId))
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString('ru-RU')

  const tabs = [
    { key: 'itinerary', label: t('itinerary') },
    { key: 'expenses', label: t('expenses') },
    { key: 'packing', label: t('packing') },
    { key: 'bookings', label: t('bookings') },
    { key: 'map', label: t('map') },
    { key: 'recommendations', label: t('recommendations') },
  ]

  return (
    <div>
      <button onClick={() => navigate('/')} className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('cancel')}
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{trip.title}</h1>
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <MapPin className="h-5 w-5 mr-2" />
              {trip.destination}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
              <Calendar className="h-5 w-5 mr-2" />
              {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
              {t('tripStatus', trip.status)}
            </span>
            <Link to={`/trips/${trip.id}/edit`} className="p-2 text-gray-500 hover:text-primary-600">
              <Edit className="h-5 w-5" />
            </Link>
            <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-600">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        {trip.description && <p className="text-gray-700 dark:text-gray-300 mb-4">{trip.description}</p>}
        <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <Wallet className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('budget')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(trip.total_expenses, settings?.currency || 'RUB')} / {formatCurrency(trip.budget, settings?.currency || 'RUB')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
        <div className="border-b dark:border-gray-700 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabType)}
                className={`px-4 py-3 font-medium whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <input type="text" placeholder={t('title')} value={newItem.itinerary.title}
                  onChange={(e) => setNewItem({ ...newItem, itinerary: { ...newItem.itinerary, title: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <input type="date" value={newItem.itinerary.date}
                  onChange={(e) => setNewItem({ ...newItem, itinerary: { ...newItem.itinerary, date: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <input type="time" value={newItem.itinerary.time}
                  onChange={(e) => setNewItem({ ...newItem, itinerary: { ...newItem.itinerary, time: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <input type="text" placeholder={t('location')} value={newItem.itinerary.location}
                  onChange={(e) => setNewItem({ ...newItem, itinerary: { ...newItem.itinerary, location: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button onClick={addItinerary} className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-1" /> {t('add')}
                </button>
              </div>
              <div className="space-y-2">
                {itinerary.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(item.date)} {item.time} • {item.location}</p>
                      {item.description && <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>}
                    </div>
                    <button onClick={() => deleteItem('itinerary', item.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <input type="text" placeholder={t('title')} value={newItem.expense.title}
                  onChange={(e) => setNewItem({ ...newItem, expense: { ...newItem.expense, title: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <input type="number" placeholder={t('amount')} value={newItem.expense.amount}
                  onChange={(e) => setNewItem({ ...newItem, expense: { ...newItem.expense, amount: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <select value={newItem.expense.category}
                  onChange={(e) => setNewItem({ ...newItem, expense: { ...newItem.expense, category: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {['transport', 'housing', 'food', 'entertainment', 'shopping', 'other'].map((key) => (
                    <option key={key} value={key}>{t('expenseCategories', key)}</option>
                  ))}
                </select>
                <input type="date" value={newItem.expense.date}
                  onChange={(e) => setNewItem({ ...newItem, expense: { ...newItem.expense, date: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button onClick={addExpense} className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-1" /> {t('add')}
                </button>
              </div>
              <div className="space-y-2">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{expense.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('expenseCategories', expense.category)} • {formatDate(expense.date)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(expense.amount, settings?.currency || 'RUB')}</span>
                      <button onClick={() => deleteItem('expenses', expense.id)} className="text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'packing' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="text" placeholder={t('itemName')} value={newItem.packing.name}
                  onChange={(e) => setNewItem({ ...newItem, packing: { name: e.target.value } })}
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button onClick={addPacking} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-1" /> {t('add')}
                </button>
              </div>
              <div className="space-y-2">
                {packing.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <button onClick={() => togglePacking(item)}
                        className={`w-6 h-6 rounded border mr-3 flex items-center justify-center ${item.is_packed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-500'}`}>
                        {item.is_packed && <Check className="h-4 w-4 text-white" />}
                      </button>
                      <span className={item.is_packed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}>{item.name}</span>
                    </div>
                    <button onClick={() => deleteItem('packing', item.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Mail className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-300" />
                  <span className="font-medium text-gray-900 dark:text-white">{t('forwardEmail')}</span>
                </div>
                <textarea
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-600 dark:text-white mb-2"
                />
                <button onClick={parseEmail} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  {t('parseEmail')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <select value={newItem.booking.booking_type}
                  onChange={(e) => setNewItem({ ...newItem, booking: { ...newItem.booking, booking_type: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {['flight', 'hotel', 'train', 'car', 'other'].map((key) => (
                    <option key={key} value={key}>{t('bookingTypes', key)}</option>
                  ))}
                </select>
                <input type="text" placeholder={t('title')} value={newItem.booking.title}
                  onChange={(e) => setNewItem({ ...newItem, booking: { ...newItem.booking, title: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <input type="text" placeholder={t('confirmationNumber')} value={newItem.booking.confirmation_number}
                  onChange={(e) => setNewItem({ ...newItem, booking: { ...newItem.booking, confirmation_number: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <input type="text" placeholder={t('location')} value={newItem.booking.location}
                  onChange={(e) => setNewItem({ ...newItem, booking: { ...newItem.booking, location: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <input type="number" placeholder={t('price')} value={newItem.booking.price}
                  onChange={(e) => setNewItem({ ...newItem, booking: { ...newItem.booking, price: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <input type="datetime-local" value={newItem.booking.start_date}
                  onChange={(e) => setNewItem({ ...newItem, booking: { ...newItem.booking, start_date: e.target.value } })}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button onClick={addBooking} className="md:col-span-2 flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-1" /> {t('addBooking')}
                </button>
              </div>

              <div className="space-y-2">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-400 mr-3">{bookingIcons[booking.booking_type]}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{booking.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.confirmation_number} • {booking.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(booking.price, settings?.currency || 'RUB')}</span>
                      <button onClick={() => deleteItem('bookings', booking.id)} className="text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="text-center py-12">
              <MapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('map')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Для отображения карты и расчёта времени в пути добавьте Google Maps API ключ в настройках.
              </p>
              <Link to="/settings" className="text-primary-600 hover:underline">
                Перейти в настройки
              </Link>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="text" value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder={t('aiPlaceholder')}
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button onClick={getRecommendations}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Sparkles className="h-4 w-4 mr-1" /> {t('getRecommendations')}
                </button>
              </div>
              {recommendations.length > 0 && (
                <div className="space-y-2">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center">
                      <Sparkles className="h-4 w-4 text-primary-600 mr-2" />
                      <span className="text-gray-900 dark:text-white">{rec}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Полная интеграция с AI требует подключения внешнего API (OpenAI, Google Places и т.д.).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
