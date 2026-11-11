import { useState, type FormEvent } from 'react'
import type { NewExpense } from '../types'

const categories = [
  'Food',
  'Transport',
  'Utilities',
  'Health',
  'Shopping',
  'Other',
]

interface ExpenseFormProps {
  onAdd: (expense: NewExpense) => void
}

function getToday(): string {
  const today = new Date()
  const offset = today.getTimezoneOffset()
  return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

export default function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [date, setDate] = useState(getToday)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    const parsedAmount = Number(amount)

    if (!trimmedTitle) {
      setError('Title is required.')
      return
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than zero.')
      return
    }
    if (!date) {
      setError('Date is required.')
      return
    }

    onAdd({
      title: trimmedTitle,
      amount: parsedAmount,
      category,
      date,
    })
    setTitle('')
    setAmount('')
    setCategory(categories[0])
    setDate(getToday())
    setError('')
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <div className="section-heading">
        <div>
          <p className="eyebrow">New transaction</p>
          <h2>Add an expense</h2>
        </div>
        <span className="section-heading__mark" aria-hidden="true">
          +
        </span>
      </div>

      <div className="form-grid">
        <label className="field field--wide">
          <span>Title</span>
          <input
            type="text"
            placeholder="e.g. Coffee with friends"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Amount (₹)</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button button--primary form-submit" type="submit">
        Add expense <span aria-hidden="true">↗</span>
      </button>
    </form>
  )
}
