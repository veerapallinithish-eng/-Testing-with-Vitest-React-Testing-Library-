import { useMemo, useState } from 'react'
import ExpenseCard from './components/ExpenseCard'
import ExpenseForm from './components/ExpenseForm'
import SummaryStats from './components/SummaryStats'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Expense, FilterType, NewExpense } from './types'
import { filterExpenses } from './utils/formatters'

const periodOptions: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
]

export default function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>(
    'pocket-expenses',
    [],
  )
  const [category, setCategory] = useState('all')
  const [period, setPeriod] = useState<FilterType>('all')

  const categories = useMemo(
    () => [...new Set(expenses.map((expense) => expense.category))].sort(),
    [expenses],
  )
  const visibleExpenses = useMemo(
    () => filterExpenses(expenses, category, period),
    [expenses, category, period],
  )

  function addExpense(newExpense: NewExpense) {
    setExpenses((currentExpenses) => [
      { ...newExpense, id: crypto.randomUUID() },
      ...currentExpenses,
    ])
  }

  function deleteExpense(id: string) {
    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== id),
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Pocket home">
          <span className="brand__icon" aria-hidden="true">
            p
          </span>
          pocket<span className="brand__period">.</span>
        </a>
        <span className="topbar__tagline">Your money, in perspective.</span>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow">PERSONAL FINANCE, MADE SIMPLE</p>
          <h1>Know where it goes.</h1>
          <p className="welcome__copy">
            A clearer view of your everyday spending starts here.
          </p>
        </div>
        <div className="welcome__decoration" aria-hidden="true">
          <span>₹</span>
          <i />
          <i />
          <i />
        </div>
      </section>

      <SummaryStats expenses={expenses} />

      <div className="content-grid">
        <section className="transactions-panel">
          <div className="section-heading transactions-heading">
            <div>
              <p className="eyebrow">YOUR ACTIVITY</p>
              <h2>Recent expenses</h2>
            </div>
            <div className="filters">
              <label className="sr-only" htmlFor="period-filter">
                Filter by period
              </label>
              <select
                id="period-filter"
                value={period}
                onChange={(event) =>
                  setPeriod(event.target.value as FilterType)
                }
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor="category-filter">
                Filter by category
              </label>
              <select
                id="category-filter"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">All categories</option>
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="expense-list">
            {visibleExpenses.length > 0 ? (
              visibleExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onDelete={deleteExpense}
                />
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-state__icon" aria-hidden="true">
                  ◌
                </span>
                <h3>No expenses to show</h3>
                <p>Add your first expense or adjust the filters.</p>
              </div>
            )}
          </div>
        </section>

        <ExpenseForm onAdd={addExpense} />
      </div>

      <footer className="footer">
        <span>Small steps make a big difference.</span>
        <span>POCKET · EXPENSE TRACKER</span>
      </footer>
    </main>
  )
}
