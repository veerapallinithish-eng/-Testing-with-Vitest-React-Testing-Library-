import type { Expense } from '../types'
import { formatCurrency, formatDate } from '../utils/formatters'

interface ExpenseCardProps {
  expense: Expense
  onDelete: (id: string) => void
}

export default function ExpenseCard({
  expense,
  onDelete,
}: ExpenseCardProps) {
  return (
    <article className="expense-card">
      <div className="expense-card__icon" aria-hidden="true">
        {expense.category.slice(0, 1).toUpperCase()}
      </div>
      <div className="expense-card__details">
        <h3>{expense.title}</h3>
        <p>
          <span>{expense.category}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={expense.date}>{formatDate(expense.date)}</time>
        </p>
      </div>
      <strong className="expense-card__amount">
        {formatCurrency(expense.amount)}
      </strong>
      <button
        className="icon-button expense-card__delete"
        type="button"
        aria-label={`Delete ${expense.title}`}
        onClick={() => onDelete(expense.id)}
      >
        <span aria-hidden="true">×</span>
      </button>
    </article>
  )
}
