import expensesData from '@/services/mockData/expenses.json'

let expenses = [...expensesData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const expenseService = {
  async getAll() {
    await delay(300)
    return [...expenses]
  },

  async getById(id) {
    await delay(200)
    const expense = expenses.find(e => e.Id === parseInt(id))
    if (!expense) {
      throw new Error('Expense not found')
    }
    return { ...expense }
  },

  async getByFarmId(farmId) {
    await delay(250)
    return expenses.filter(e => e.farmId === farmId.toString()).map(e => ({ ...e }))
  },

  async getTotalByCategory() {
    await delay(200)
    const totals = {}
    expenses.forEach(expense => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0
      }
      totals[expense.category] += expense.amount
    })
    return totals
  },

  async create(expenseData) {
    await delay(400)
    const maxId = Math.max(...expenses.map(e => e.Id), 0)
    const newExpense = {
      Id: maxId + 1,
      ...expenseData
    }
    expenses.push(newExpense)
    return { ...newExpense }
  },

  async update(id, expenseData) {
    await delay(350)
    const index = expenses.findIndex(e => e.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Expense not found')
    }
    expenses[index] = { ...expenses[index], ...expenseData }
    return { ...expenses[index] }
  },

  async delete(id) {
    await delay(250)
    const index = expenses.findIndex(e => e.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Expense not found')
    }
expenses.splice(index, 1)
    return true
  },

  async exportToCSV(filters = {}) {
    await delay(400)
    let exportExpenses = [...expenses]
    
    if (filters.farmId) {
      exportExpenses = exportExpenses.filter(e => e.farmId === filters.farmId)
    }
    
    if (filters.category) {
      exportExpenses = exportExpenses.filter(e => e.category === filters.category)
    }
    
    return exportExpenses
  },

  async exportToPDF(filters = {}) {
    await delay(500)
    let exportExpenses = [...expenses]
    
    if (filters.farmId) {
      exportExpenses = exportExpenses.filter(e => e.farmId === filters.farmId)
    }
    
    if (filters.category) {
      exportExpenses = exportExpenses.filter(e => e.category === filters.category)
    }
    
    return exportExpenses
  }
}