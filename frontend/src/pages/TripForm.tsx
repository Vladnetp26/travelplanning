import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import { useI18n } from '../context/I18nContext'
import { ArrowLeft, Save } from 'lucide-react'

export default function TripForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    start_date: '',
    end_date: '',
    budget: '',
    status: 'planned',
  })

  useEffect(() => {
    if (id) {
      api.get(`/trips/${id}/`).then((res) => {
        setFormData({
          title: res.data.title,
          description: res.data.description,
          destination: res.data.destination,
          start_date: res.data.start_date,
          end_date: res.data.end_date,
          budget: res.data.budget,
          status: res.data.status,
        })
      })
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit) {
        await api.put(`/trips/${id}/`, formData)
      } else {
        await api.post('/trips/', formData)
      }
      navigate('/')
    } catch (error) {
      console.error('Error saving trip:', error)
    }
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('cancel')}
      </button>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isEdit ? t('edit') : t('newTrip')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('title')}</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('destination')}</label>
            <input type="text" name="destination" value={formData.destination} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('description')}</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('startDate')}</label>
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('endDate')}</label>
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('budget')}</label>
              <input type="number" name="budget" value={formData.budget} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('status')}</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                {['planned', 'active', 'completed', 'cancelled'].map((key) => (
                  <option key={key} value={key}>{t('tripStatus', key)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
              <Save className="h-4 w-4 mr-2" /> {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
