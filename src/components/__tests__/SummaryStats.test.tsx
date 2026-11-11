import { render, screen } from '@testing-library/react'
import type { Expense } from '../../types'
import SummaryStats from '../SummaryStats'

const expenses: Expense[] = [
  {
    id: '1',
    title: 'Lunch',
    amount: 250,
    category: 'Food',
    date: '2025-08-06',
  },
  {
    id: '2',
    title: 'Taxi',
    amount: 500,
    category: 'Transport',
    date: '2025-08-06',
  },
  {
    id: '3',
    title: 'Dinner',
    amount: 300,
    category: 'Food',
    date: '2025-08-06',
  },
]

describe('SummaryStats', () => {
  it('renders the total amount', () => {
    render(<SummaryStats expenses={expenses} />)

    expect(screen.getByText('₹1,050.00')).toBeInTheDocument()
  })

  it('renders the highest expense and its title', () => {
    render(<SummaryStats expenses={expenses} />)

    expect(screen.getByText('₹500.00')).toBeInTheDocument()
    expect(screen.getByText('Taxi')).toBeInTheDocument()
  })

  it('counts unique categories', () => {
    render(<SummaryStats expenses={expenses} />)

    expect(screen.getByText('2', { selector: '.summary-card__value' })).toBeInTheDocument()
  })

  it('shows zero values gracefully when there are no expenses', () => {
    render(<SummaryStats expenses={[]} />)

    expect(screen.getAllByText('₹0.00')).toHaveLength(2)
    expect(screen.getByText('No expenses yet')).toBeInTheDocument()
    expect(screen.getByText('0', { selector: '.summary-card__value' })).toBeInTheDocument()
  })
})
