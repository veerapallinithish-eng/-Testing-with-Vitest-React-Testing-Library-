import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Expense } from '../../types'
import ExpenseCard from '../ExpenseCard'

const expense: Expense = {
  id: 'expense-1',
  title: 'Lunch',
  amount: 250,
  category: 'Food',
  date: '2025-08-06',
}

describe('ExpenseCard', () => {
  it('renders the title, formatted amount, and category', () => {
    render(<ExpenseCard expense={expense} onDelete={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Lunch' })).toBeInTheDocument()
    expect(screen.getByText('₹250.00')).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
  })

  it('provides an accessible delete button', () => {
    render(<ExpenseCard expense={expense} onDelete={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: 'Delete Lunch' }),
    ).toBeInTheDocument()
  })

  it('calls onDelete with the expense id when clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<ExpenseCard expense={expense} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: 'Delete Lunch' }))

    expect(onDelete).toHaveBeenCalledExactlyOnceWith('expense-1')
  })
})
