import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts with an empty state and zero total', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'No expenses to show' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('₹0.00')).toHaveLength(2)
  })

  it('adds an expense and persists it in localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Title'), 'Morning coffee')
    await user.type(screen.getByLabelText('Amount (₹)'), '120')
    await user.selectOptions(screen.getByLabelText('Category'), 'Food')
    await user.click(screen.getByRole('button', { name: /add expense/i }))

    expect(
      screen.getByRole('heading', { name: 'Morning coffee' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('₹120.00')).toHaveLength(3)
    expect(JSON.parse(window.localStorage.getItem('pocket-expenses') ?? '[]')).toEqual(
      [
        expect.objectContaining({
          title: 'Morning coffee',
          amount: 120,
          category: 'Food',
        }),
      ],
    )
  })

  it('filters expenses by category and removes deleted expenses', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Title'), 'Morning coffee')
    await user.type(screen.getByLabelText('Amount (₹)'), '120')
    await user.selectOptions(screen.getByLabelText('Category'), 'Food')
    await user.click(screen.getByRole('button', { name: /add expense/i }))

    await user.type(screen.getByLabelText('Title'), 'Bus fare')
    await user.type(screen.getByLabelText('Amount (₹)'), '40')
    await user.selectOptions(screen.getByLabelText('Category'), 'Transport')
    await user.click(screen.getByRole('button', { name: /add expense/i }))

    await user.selectOptions(
      screen.getByLabelText('Filter by category'),
      'Transport',
    )

    expect(screen.getByRole('heading', { name: 'Bus fare' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Morning coffee' }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete Bus fare' }))

    expect(
      screen.getByRole('heading', { name: 'No expenses to show' }),
    ).toBeInTheDocument()
    expect(
      JSON.parse(window.localStorage.getItem('pocket-expenses') ?? '[]'),
    ).toHaveLength(1)
  })

  it('loads previously saved expenses on mount', () => {
    window.localStorage.setItem(
      'pocket-expenses',
      JSON.stringify([
        {
          id: 'saved-expense',
          title: 'Saved lunch',
          amount: 250,
          category: 'Food',
          date: '2025-08-06',
        },
      ]),
    )

    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Saved lunch' }),
    ).toBeInTheDocument()
  })
})
