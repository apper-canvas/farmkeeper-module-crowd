import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { expenseService } from '@/services/api/expenseService'
import { farmService } from '@/services/api/farmService'
import { generateCSV, generatePDF, downloadFile } from '@/utils/exportUtils'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [filterFarm, setFilterFarm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [formData, setFormData] = useState({
    farmId: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })

  const categories = [
    { value: 'Seeds', label: 'Seeds' },
    { value: 'Fertilizer', label: 'Fertilizer' },
    { value: 'Equipment', label: 'Equipment' },
    { value: 'Labor', label: 'Labor' },
    { value: 'Fuel', label: 'Fuel' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Other', label: 'Other' }
  ]

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [expensesData, farmsData] = await Promise.all([
        expenseService.getAll(),
        farmService.getAll()
      ])
      setExpenses(expensesData)
      setFarms(farmsData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredExpenses = expenses.filter(expense => {
    const farmMatch = !filterFarm || expense.farmId === filterFarm
    const categoryMatch = !filterCategory || expense.category === filterCategory
    return farmMatch && categoryMatch
  })

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingExpense) {
        const updated = await expenseService.update(editingExpense.Id, {
          ...formData,
          amount: parseFloat(formData.amount)
        })
        setExpenses(prev => prev.map(expense => 
          expense.Id === editingExpense.Id ? updated : expense
        ))
        toast.success('Expense updated successfully!')
      } else {
        const newExpense = await expenseService.create({
          ...formData,
          amount: parseFloat(formData.amount)
        })
        setExpenses(prev => [...prev, newExpense])
        toast.success('Expense added successfully!')
      }
      
      resetForm()
    } catch (err) {
      toast.error(err.message || 'Failed to save expense')
    }
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setFormData({
      farmId: expense.farmId,
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date,
      description: expense.description
    })
    setShowAddForm(true)
  }

  const handleDelete = async (expenseId) => {
    if (!confirm('Are you sure you want to delete this expense?')) return
    
    try {
      await expenseService.delete(expenseId)
      setExpenses(prev => prev.filter(expense => expense.Id !== expenseId))
      toast.success('Expense deleted successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to delete expense')
    }
  }

  const resetForm = () => {
    setFormData({
      farmId: '',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    })
    setEditingExpense(null)
    setShowAddForm(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === parseInt(farmId))
    return farm ? farm.name : 'Unknown Farm'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      Seeds: 'Seed',
      Fertilizer: 'Leaf',
      Equipment: 'Wrench',
      Labor: 'Users',
      Fuel: 'Fuel',
      Maintenance: 'Settings',
      Utilities: 'Zap',
      Insurance: 'Shield',
      Other: 'Package'
    }
    return icons[category] || 'DollarSign'
  }

  const getCategoryColor = (category) => {
    const colors = {
      Seeds: 'text-green-600 bg-green-50',
      Fertilizer: 'text-emerald-600 bg-emerald-50',
      Equipment: 'text-blue-600 bg-blue-50',
      Labor: 'text-purple-600 bg-purple-50',
      Fuel: 'text-orange-600 bg-orange-50',
      Maintenance: 'text-gray-600 bg-gray-50',
      Utilities: 'text-yellow-600 bg-yellow-50',
      Insurance: 'text-indigo-600 bg-indigo-50',
      Other: 'text-pink-600 bg-pink-50'
    }
return colors[category] || 'text-gray-600 bg-gray-50'
  }

  const handleExportCSV = async () => {
    try {
      const filters = {}
      if (filterFarm) filters.farmId = filterFarm
      if (filterCategory) filters.category = filterCategory
      
      const exportData = await expenseService.exportToCSV(filters)
      const csvContent = generateCSV(exportData, farms)
      
      const filename = `expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`
      downloadFile(csvContent, filename, 'text/csv')
      
      toast.success(`CSV exported successfully! ${exportData.length} records exported.`)
    } catch (error) {
      toast.error('Failed to export CSV')
    }
  }

  const handleExportPDF = async () => {
    try {
      const filters = {}
      if (filterFarm) filters.farmId = filterFarm
      if (filterCategory) filters.category = filterCategory
      
      const exportData = await expenseService.exportToPDF(filters)
      const pdf = generatePDF(exportData, farms)
      
      const filename = `expenses-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      pdf.save(filename)
      
      toast.success(`PDF exported successfully! ${exportData.length} records exported.`)
    } catch (error) {
      toast.error('Failed to export PDF')
    }
  }

  if (loading) return <Loading type="cards" count={6} />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
<div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon="Download"
            onClick={handleExportCSV}
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            Export CSV
          </Button>
          
          <Button
            variant="outline"
            icon="FileText"
            onClick={handleExportPDF}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Export PDF
          </Button>
          
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setShowAddForm(true)}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          value={filterFarm}
          onChange={(e) => setFilterFarm(e.target.value)}
          options={farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }))}
          placeholder="All Farms"
          className="min-w-[150px]"
        />
        
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          options={categories}
          placeholder="All Categories"
          className="min-w-[150px]"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card gradient>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-50 rounded-xl">
              <ApperIcon name="DollarSign" size={32} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        <Card gradient>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <ApperIcon name="Receipt" size={32} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{filteredExpenses.length}</p>
            </div>
          </div>
        </Card>

        <Card gradient>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <ApperIcon name="TrendingUp" size={32} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Record</p>
              <p className="text-2xl font-bold text-gray-900">
                ${filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </Card>

        <Card gradient>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <ApperIcon name="Calendar" size={32} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                ${filteredExpenses
                  .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
                  .reduce((sum, e) => sum + e.amount, 0)
                  .toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      {Object.keys(expensesByCategory).length > 0 && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(expensesByCategory)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className={`p-4 rounded-lg ${getCategoryColor(category)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ApperIcon name={getCategoryIcon(category)} size={20} />
                      <span className="font-medium">{category}</span>
                    </div>
                    <span className="font-bold">
                      ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                </h2>
                <Button variant="ghost" size="sm" icon="X" onClick={resetForm} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                  label="Farm"
                  value={formData.farmId}
                  onChange={(e) => handleInputChange('farmId', e.target.value)}
                  options={farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }))}
                  required
                  placeholder="Select a farm"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    options={categories}
                    required
                    placeholder="Select category"
                  />

                  <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </div>

                <Input
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />

                <Input
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  placeholder="Enter expense description"
                />

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingExpense ? 'Update Expense' : 'Add Expense'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <Empty
          icon="DollarSign"
          title="No expenses found"
          description={filterFarm || filterCategory 
            ? "No expenses match your current filters. Try adjusting your search criteria."
            : "Start by adding your first expense to track your farm costs."
          }
          actionLabel="Add Your First Expense"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredExpenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((expense) => (
              <motion.div
                key={expense.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-4 shadow border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getCategoryColor(expense.category)}`}>
                      <ApperIcon name={getCategoryIcon(expense.category)} size={20} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{expense.category}</span>
                        <span>•</span>
                        <span>{getFarmName(expense.farmId)}</span>
                        <span>•</span>
                        <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit2"
                        onClick={() => handleEdit(expense)}
                        className="text-gray-500 hover:text-gray-700"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDelete(expense.Id)}
                        className="text-red-500 hover:text-red-700"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  )
}

export default Expenses