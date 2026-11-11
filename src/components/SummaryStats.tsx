import type { Expense } from '../types'
import { formatCurrency } from '../utils/formatters'

interface SummaryStatsProps {
  expenses: Expense[]
}

export default function SummaryStats({ expenses }: SummaryStatsProps) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const highestExpense = expenses.reduce<Expense | null>(
    (highest, expense) =>
      highest === null || expense.amount > highest.amount ? expense : highest,
    null,
  )
  const categoryCount = new Set(expenses.map((expense) => expense.category)).size

  return (
    <section className="summary-grid" aria-label="Expense summary">
      <article className="summary-card summary-card--primary">
        <p className="summary-card__label">Total spent</p>
        <p className="summary-card__value">{formatCurrency(total)}</p>
        <span className="summary-card__note">Across all expenses</span>
      </article>
      <article className="summary-card">
        <p className="summary-card__label">Highest expense</p>
        <p className="summary-card__value">
          {formatCurrency(highestExpense?.amount ?? 0)}
        </p>
        <span className="summary-card__note">
          {highestExpense?.title ?? 'No expenses yet'}
        </span>
      </article>
      <article className="summary-card">
        <p className="summary-card__label">Categories used</p>
        <p className="summary-card__value">{categoryCount}</p>
        <span className="summary-card__note">
          {categoryCount === 1 ? 'Category' : 'Categories'}
        </span>
      </article>
    </section>
  )
}
