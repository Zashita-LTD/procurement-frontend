import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'RUB'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
  }).format(price)
}

export function getMatchStatusColor(score: number): string {
  if (score >= 0.8) return 'bg-green-100 text-green-800 border-green-200'
  if (score >= 0.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  return 'bg-red-100 text-red-800 border-red-200'
}

export function getMatchStatusLabel(score: number): string {
  if (score >= 0.8) return 'Точное совпадение'
  if (score >= 0.5) return 'Требует проверки'
  return 'Не найдено'
}