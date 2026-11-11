import type { Expense } from '../../types'
import {
  filterExpenses,
  formatCurrency,
  formatDate,
  getTotalByCategory,
} from '../formatters'

const expenses: Expense[] = [
  {
    id: '1',
    title: 'Coffee',
    amount: 80,
    category: 'Food',
    date: '2025-08-06',
  },
  {
    id: '2',
    title: 'Train',
    amount: 120,
    category: 'Transport',
    date: '2025-08-04',
  },
  {
    id: '3',
    title: 'Groceries',
    amount: 900,
    category: 'Food',
    date: '2025-07-20',
  },
]

describe('formatCurrency', () => {
  it('formats a positive amount in rupees', () => {
    expect(formatCurrency(1500)).toBe('₹1,500.00')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('₹0.00')
  })

  it('formats large amounts with Indian digit grouping', () => {
    expect(formatCurrency(1234567.89)).toBe('₹12,34,567.89')
  })
})

describe('formatDate', () => {
  it('formats a valid ISO date without shifting its calendar day', () => {
    expect(formatDate('2025-08-06')).toBe('06 Aug 2025')
  })

  it('returns a clear label for invalid date input', () => {
    expect(formatDate('not-a-date')).toBe('Invalid date')
  })
})

describe('getTotalByCategory', () => {
  it('totals matching expenses only', () => {
    expect(getTotalByCategory(expenses, 'Food')).toBe(980)
  })

  it('returns zero when no expense matches', () => {
    expect(getTotalByCategory(expenses, 'Health')).toBe(0)
  })

  it('returns zero for an empty list', () => {
    expect(getTotalByCategory([], 'Food')).toBe(0)
  })
})

describe('filterExpenses', () => {
  const now = new Date(2025, 7, 6, 12)

  it('filters by category', () => {
    expect(filterExpenses(expenses, 'Food', 'all', now).map((e) => e.id)).toEqual([
      '1',
      '3',
    ])
  })

  it('includes the last seven calendar days for the week filter', () => {
    expect(filterExpenses(expenses, 'all', 'week', now).map((e) => e.id)).toEqual([
      '1',
      '2',
    ])
  })

  it('filters to the current calendar month', () => {
    expect(filterExpenses(expenses, 'all', 'month', now).map((e) => e.id)).toEqual([
      '1',
      '2',
    ])
  })

  it('applies category and period filters together', () => {
    expect(filterExpenses(expenses, 'Food', 'week', now).map((e) => e.id)).toEqual([
      '1',
    ])
  })

  it('excludes invalid dates from date-based filters', () => {
    const invalidDateExpense = { ...expenses[0], id: '4', date: 'invalid' }
    expect(
      filterExpenses([invalidDateExpense], 'all', 'month', now),
    ).toEqual([])
  })
})
