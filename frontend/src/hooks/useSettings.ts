import { useEffect, useState } from 'react'
import api from '../services/api'

export interface UserSettings {
  language: 'ru' | 'en'
  theme: 'light' | 'dark'
  currency: string
  distance_unit: 'km' | 'mi'
  temperature_unit: 'C' | 'F'
  email_notifications: boolean
  push_notifications: boolean
  google_maps_api_key: string
  google_calendar_connected: boolean
  apple_calendar_connected: boolean
}

const defaultSettings: UserSettings = {
  language: 'ru',
  theme: 'light',
  currency: 'RUB',
  distance_unit: 'km',
  temperature_unit: 'C',
  email_notifications: true,
  push_notifications: true,
  google_maps_api_key: '',
  google_calendar_connected: false,
  apple_calendar_connected: false,
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/auth/settings/')
      .then((res) => {
        setSettings({ ...defaultSettings, ...res.data })
      })
      .catch(() => {
        const saved = localStorage.getItem('local_settings')
        if (saved) {
          setSettings({ ...defaultSettings, ...JSON.parse(saved) })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('local_settings', JSON.stringify(updated))
    try {
      const res = await api.patch('/auth/settings/', newSettings)
      setSettings({ ...defaultSettings, ...res.data })
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  return { settings, updateSettings, loading }
}
