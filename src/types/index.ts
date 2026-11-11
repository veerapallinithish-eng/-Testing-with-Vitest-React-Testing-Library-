export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
}

export type NewExpense = Omit<Expense, 'id'>

export type FilterType = 'all' | 'week' | 'month'
