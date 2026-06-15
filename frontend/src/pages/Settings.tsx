import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useI18n } from '../context/I18nContext'
import { useSettings } from '../hooks/useSettings'
import { ArrowLeft, Moon, Sun, Globe, Bell, Key, Calendar, Map } from 'lucide-react'

export default function Settings() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()
  const { settings, updateSettings, loading } = useSettings()

  useEffect(() => {
    if (settings.language && settings.language !== language) {
      setLanguage(settings.language)
    }
    if (settings.theme && settings.theme !== theme) {
      setTheme(settings.theme)
    }
  }, [settings, language, theme, setLanguage, setTheme])

  const handleLanguageChange = (lang: 'ru' | 'en') => {
    setLanguage(lang)
    updateSettings({ language: lang })
  }

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    updateSettings({ theme: newTheme })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
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

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('settings')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('language')}</h2>
          </div>
          <div className="flex space-x-2">
            {[
              { value: 'ru', label: 'Русский' },
              { value: 'en', label: 'English' },
            ].map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleLanguageChange(lang.value as 'ru' | 'en')}
                className={`px-4 py-2 rounded-lg border transition ${
                  language === lang.value
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            {theme === 'dark' ? (
              <Moon className="h-5 w-5 text-primary-600 mr-2" />
            ) : (
              <Sun className="h-5 w-5 text-primary-600 mr-2" />
            )}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('theme')}</h2>
          </div>
          <div className="flex space-x-2">
            {[
              { value: 'light', label: t('light') },
              { value: 'dark', label: t('dark') },
            ].map((th) => (
              <button
                key={th.value}
                onClick={() => handleThemeChange(th.value as 'light' | 'dark')}
                className={`px-4 py-2 rounded-lg border transition ${
                  theme === th.value
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('currency')}</h2>
          <select
            value={settings.currency}
            onChange={(e) => updateSettings({ currency: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {['RUB', 'USD', 'EUR', 'GBP', 'JPY'].map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('distanceUnit')}</h2>
          <div className="flex space-x-2">
            {[
              { value: 'km', label: t('km') },
              { value: 'mi', label: t('mi') },
            ].map((unit) => (
              <button
                key={unit.value}
                onClick={() => updateSettings({ distance_unit: unit.value as 'km' | 'mi' })}
                className={`px-4 py-2 rounded-lg border transition ${
                  settings.distance_unit === unit.value
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                }`}
              >
                {unit.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('temperatureUnit')}</h2>
          <div className="flex space-x-2">
            {[
              { value: 'C', label: t('celsius') },
              { value: 'F', label: t('fahrenheit') },
            ].map((unit) => (
              <button
                key={unit.value}
                onClick={() => updateSettings({ temperature_unit: unit.value as 'C' | 'F' })}
                className={`px-4 py-2 rounded-lg border transition ${
                  settings.temperature_unit === unit.value
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                }`}
              >
                {unit.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('notifications')}</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-200">{t('emailNotifications')}</span>
              <input
                type="checkbox"
                checked={settings.email_notifications}
                onChange={(e) => updateSettings({ email_notifications: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-200">{t('pushNotifications')}</span>
              <input
                type="checkbox"
                checked={settings.push_notifications}
                onChange={(e) => updateSettings({ push_notifications: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('integrations')}</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => updateSettings({ google_calendar_connected: !settings.google_calendar_connected })}
              className={`w-full py-2 px-4 rounded-lg border transition ${
                settings.google_calendar_connected
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {settings.google_calendar_connected ? 'Google Calendar ✓' : t('connectGoogleCalendar')}
            </button>
            <button
              onClick={() => updateSettings({ apple_calendar_connected: !settings.apple_calendar_connected })}
              className={`w-full py-2 px-4 rounded-lg border transition ${
                settings.apple_calendar_connected
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {settings.apple_calendar_connected ? 'Apple Calendar ✓' : t('connectAppleCalendar')}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Key className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('apiKeys')}</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <Map className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{t('googleMapsKey')}</span>
            </div>
            <input
              type="password"
              value={settings.google_maps_api_key}
              onChange={(e) => updateSettings({ google_maps_api_key: e.target.value })}
              placeholder="AIza..."
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
