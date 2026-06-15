const currencySymbols: Record<string, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
}

export function formatCurrency(amount: string | number, currency: string): string {
  const symbol = currencySymbols[currency] || currency
  return `${amount} ${symbol}`
}

export function formatDistance(km: number, unit: string): string {
  if (unit === 'mi') {
    return `${(km * 0.621371).toFixed(1)} mi`
  }
  return `${km.toFixed(1)} km`
}

export function formatTemperature(celsius: number, unit: string): string {
  if (unit === 'F') {
    return `${((celsius * 9) / 5 + 32).toFixed(0)}°F`
  }
  return `${celsius.toFixed(0)}°C`
}

export function convertCurrency(amount: number, from: string, to: string): number {
  const rates: Record<string, number> = {
    RUB: 1,
    USD: 0.011,
    EUR: 0.01,
    GBP: 0.0085,
    JPY: 1.65,
  }
  if (from === to) return amount
  const inRub = amount / rates[from]
  return inRub * rates[to]
}
