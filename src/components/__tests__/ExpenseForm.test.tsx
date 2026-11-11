import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExpenseForm from '../ExpenseForm'

describe('ExpenseForm', () => {
  it('renders all form fields', () => {
    render(<ExpenseForm onAdd={vi.fn()} />)

    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Amount (₹)')).toBeInTheDocument()
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByLabelText('Date')).toBeInTheDocument()
  })

  it('shows a validation error when the title is empty', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<ExpenseForm onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: /add expense/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('Title is required.')
    expect(onAdd).not.toHaveBeenCalled()
  })

  it.each(['0', '-10'])(
    'rejects a non-positive amount (%s)',
    async (amount) => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<ExpenseForm onAdd={onAdd} />)

      await user.type(screen.getByLabelText('Title'), 'Coffee')
      await user.type(screen.getByLabelText('Amount (₹)'), amount)
      await user.click(screen.getByRole('button', { name: /add expense/i }))

      expect(screen.getByRole('alert')).toHaveTextContent(
        'Amount must be greater than zero.',
      )
      expect(onAdd).not.toHaveBeenCalled()
    },
  )

  it('submits trimmed title and correctly typed expense data', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<ExpenseForm onAdd={onAdd} />)
    const date = screen.getByLabelText('Date') as HTMLInputElement

    await user.type(screen.getByLabelText('Title'), '  Coffee  ')
    await user.type(screen.getByLabelText('Amount (₹)'), '80')
    await user.selectOptions(screen.getByLabelText('Category'), 'Food')
    await user.click(screen.getByRole('button', { name: /add expense/i }))

    expect(onAdd).toHaveBeenCalledExactlyOnceWith({
      title: 'Coffee',
      amount: 80,
      category: 'Food',
      date: date.value,
    })
  })

  it('resets the form after a successful submission', async () => {
    const user = userEvent.setup()
    render(<ExpenseForm onAdd={vi.fn()} />)
    const title = screen.getByLabelText('Title') as HTMLInputElement
    const amount = screen.getByLabelText('Amount (₹)') as HTMLInputElement

    await user.type(title, 'Coffee')
    await user.type(amount, '80')
    await user.click(screen.getByRole('button', { name: /add expense/i }))

    expect(title).toHaveValue('')
    expect(amount.value).toBe('')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
