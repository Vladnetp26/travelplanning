import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'ru' | 'en'

type Translations = Record<string, string | Record<string, string>>

const ru: Translations = {
  appName: 'TripPlanner',
  login: 'Вход в систему',
  register: 'Регистрация',
  username: 'Логин',
  password: 'Пароль',
  email: 'Email',
  loginButton: 'Войти',
  registerButton: 'Зарегистрироваться',
  noAccount: 'Нет аккаунта?',
  hasAccount: 'Уже есть аккаунт?',
  myTrips: 'Мои поездки',
  newTrip: 'Новая поездка',
  settings: 'Настройки',
  logout: 'Выход',
  budget: 'Бюджет',
  spent: 'Потрачено',
  itinerary: 'Маршрут',
  expenses: 'Расходы',
  packing: 'Чемодан',
  bookings: 'Бронирования',
  recommendations: 'Рекомендации',
  map: 'Карта',
  save: 'Сохранить',
  cancel: 'Отмена',
  delete: 'Удалить',
  edit: 'Редактировать',
  language: 'Язык',
  theme: 'Тема',
  currency: 'Валюта',
  distanceUnit: 'Расстояние',
  temperatureUnit: 'Температура',
  notifications: 'Уведомления',
  emailNotifications: 'Email-уведомления',
  pushNotifications: 'Push-уведомления',
  integrations: 'Интеграции',
  connectGoogleCalendar: 'Подключить Google Calendar',
  connectAppleCalendar: 'Подключить Apple Calendar',
  syncCalendar: 'Синхронизировать с календарём',
  apiKeys: 'API-ключи',
  googleMapsKey: 'Google Maps API ключ',
  light: 'Светлая',
  dark: 'Тёмная',
  km: 'км',
  mi: 'мили',
  celsius: '°C',
  fahrenheit: '°F',
  tripStatus: {
    planned: 'Запланирована',
    active: 'Активна',
    completed: 'Завершена',
    cancelled: 'Отменена',
  },
  expenseCategories: {
    transport: 'Транспорт',
    housing: 'Жильё',
    food: 'Еда',
    entertainment: 'Развлечения',
    shopping: 'Покупки',
    other: 'Другое',
  },
  bookingTypes: {
    flight: 'Авиабилет',
    hotel: 'Отель',
    train: 'Ж/Д',
    car: 'Аренда авто',
    other: 'Другое',
  },
  noTrips: 'Поездок пока нет',
  createFirstTrip: 'Создайте свою первую поездку и начните планировать путешествие',
  destination: 'Направление',
  dates: 'Даты',
  description: 'Описание',
  title: 'Название',
  status: 'Статус',
  add: 'Добавить',
  time: 'Время',
  location: 'Место',
  amount: 'Сумма',
  category: 'Категория',
  date: 'Дата',
  itemName: 'Название вещи',
  confirmationNumber: 'Номер подтверждения',
  price: 'Стоимость',
  startDate: 'Начало',
  endDate: 'Окончание',
  bookingType: 'Тип бронирования',
  addBooking: 'Добавить бронирование',
  forwardEmail: 'Переслать письмо',
  emailPlaceholder: 'Вставьте текст письма с подтверждением бронирования...',
  parseEmail: 'Спарсить письмо',
  aiPlaceholder: 'Введите предпочтения, например: "исторические места, вегетарианские рестораны"',
  getRecommendations: 'Получить рекомендации',
  loading: 'Загрузка...',
  error: 'Ошибка',
  success: 'Сохранено',
}

const en: Translations = {
  appName: 'TripPlanner',
  login: 'Sign In',
  register: 'Sign Up',
  username: 'Username',
  password: 'Password',
  email: 'Email',
  loginButton: 'Sign In',
  registerButton: 'Sign Up',
  noAccount: "Don't have an account?",
  hasAccount: 'Already have an account?',
  myTrips: 'My Trips',
  newTrip: 'New Trip',
  settings: 'Settings',
  logout: 'Logout',
  budget: 'Budget',
  spent: 'Spent',
  itinerary: 'Itinerary',
  expenses: 'Expenses',
  packing: 'Packing',
  bookings: 'Bookings',
  recommendations: 'Recommendations',
  map: 'Map',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  language: 'Language',
  theme: 'Theme',
  currency: 'Currency',
  distanceUnit: 'Distance',
  temperatureUnit: 'Temperature',
  notifications: 'Notifications',
  emailNotifications: 'Email notifications',
  pushNotifications: 'Push notifications',
  integrations: 'Integrations',
  connectGoogleCalendar: 'Connect Google Calendar',
  connectAppleCalendar: 'Connect Apple Calendar',
  syncCalendar: 'Sync with calendar',
  apiKeys: 'API Keys',
  googleMapsKey: 'Google Maps API key',
  light: 'Light',
  dark: 'Dark',
  km: 'km',
  mi: 'miles',
  celsius: '°C',
  fahrenheit: '°F',
  tripStatus: {
    planned: 'Planned',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
  },
  expenseCategories: {
    transport: 'Transport',
    housing: 'Housing',
    food: 'Food',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    other: 'Other',
  },
  bookingTypes: {
    flight: 'Flight',
    hotel: 'Hotel',
    train: 'Train',
    car: 'Car rental',
    other: 'Other',
  },
  noTrips: 'No trips yet',
  createFirstTrip: 'Create your first trip and start planning your journey',
  destination: 'Destination',
  dates: 'Dates',
  description: 'Description',
  title: 'Title',
  status: 'Status',
  add: 'Add',
  time: 'Time',
  location: 'Location',
  amount: 'Amount',
  category: 'Category',
  date: 'Date',
  itemName: 'Item name',
  confirmationNumber: 'Confirmation number',
  price: 'Price',
  startDate: 'Start',
  endDate: 'End',
  bookingType: 'Booking type',
  addBooking: 'Add booking',
  forwardEmail: 'Forward email',
  emailPlaceholder: 'Paste booking confirmation email text here...',
  parseEmail: 'Parse email',
  aiPlaceholder: 'Enter preferences, e.g. "historical sites, vegetarian restaurants"',
  getRecommendations: 'Get recommendations',
  loading: 'Loading...',
  error: 'Error',
  success: 'Saved',
}

const translations = { ru, en }

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, nestedKey?: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language
    return saved || 'ru'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = (lang: Language) => setLanguageState(lang)

  const t = (key: string, nestedKey?: string): string => {
    const value = translations[language][key]
    if (nestedKey && typeof value === 'object') {
      return value[nestedKey] || nestedKey
    }
    return (value as string) || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
