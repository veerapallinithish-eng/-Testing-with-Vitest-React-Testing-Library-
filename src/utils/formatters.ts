import type { Expense, FilterType } from '../types'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

export function formatDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00.000Z`)
  if (!Number.isFinite(parsedDate.getTime())) {
    return 'Invalid date'
  }

  return dateFormatter.format(parsedDate)
}

export function getTotalByCategory(
  expenses: Expense[],
  category: string,
): number {
  return expenses.reduce(
    (total, expense) =>
      expense.category === category ? total + expense.amount : total,
    0,
  )
}

export function filterExpenses(
  expenses: Expense[],
  category: string,
  period: FilterType,
  now: Date = new Date(),
): Expense[] {
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(nowDate)
  weekStart.setDate(nowDate.getDate() - 6)

  return expenses.filter((expense) => {
    const matchesCategory = category === 'all' || expense.category === category
    if (!matchesCategory) {
      return false
    }

    if (period === 'all') {
      return true
    }

    const expenseDate = new Date(`${expense.date}T00:00:00`)
    if (!Number.isFinite(expenseDate.getTime())) {
      return false
    }

    if (period === 'week') {
      return expenseDate >= weekStart && expenseDate <= nowDate
    }

    return (
      expenseDate.getFullYear() === nowDate.getFullYear() &&
      expenseDate.getMonth() === nowDate.getMonth()
    )
  })
}
