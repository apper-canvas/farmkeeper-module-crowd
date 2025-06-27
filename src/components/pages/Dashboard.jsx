import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import StatCard from '@/components/molecules/StatCard'
import WeatherCard from '@/components/molecules/WeatherCard'
import TaskItem from '@/components/molecules/TaskItem'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { farmService } from '@/services/api/farmService'
import { cropService } from '@/services/api/cropService'
import { taskService } from '@/services/api/taskService'
import { expenseService } from '@/services/api/expenseService'
import { weatherService } from '@/services/api/weatherService'

const Dashboard = () => {
  const [farms, setFarms] = useState([])
  const [crops, setCrops] = useState([])
  const [todaysTasks, setTodaysTasks] = useState([])
  const [overdueTasks, setOverdueTasks] = useState([])
  const [expenses, setExpenses] = useState([])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [
        farmsData,
        cropsData,
        todaysTasksData,
        overdueTasksData,
        expensesData,
        weatherData
      ] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getTodaysTasks(),
        taskService.getOverdueTasks(),
        expenseService.getAll(),
        weatherService.getCurrentWeather()
      ])

      setFarms(farmsData)
      setCrops(cropsData)
      setTodaysTasks(todaysTasksData)
      setOverdueTasks(overdueTasksData)
      setExpenses(expensesData)
      setWeather(weatherData)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleToggleTask = async (taskId) => {
    try {
      await taskService.toggleComplete(taskId)
      setTodaysTasks(prev => prev.map(task => 
        task.Id === taskId ? { ...task, completed: !task.completed } : task
      ))
      setOverdueTasks(prev => prev.map(task => 
        task.Id === taskId ? { ...task, completed: !task.completed } : task
      ))
      toast.success('Task updated successfully!')
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const activeCrops = crops.filter(crop => crop.status === 'growing').length
  const completedTasks = todaysTasks.filter(task => task.completed).length
  const totalTasks = todaysTasks.length + overdueTasks.length

  if (loading) return <Loading type="cards" count={6} />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to FarmKeeper</h1>
            <p className="text-lg opacity-90">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="Sunrise" size={64} className="opacity-20" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Farms"
          value={farms.length}
          icon="MapPin"
          color="primary"
        />
        <StatCard
          title="Growing Crops"
          value={activeCrops}
          icon="Sprout"
          color="success"
        />
        <StatCard
          title="Pending Tasks"
          value={totalTasks - completedTasks}
          icon="CheckSquare"
          color="warning"
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toFixed(0)}`}
          icon="DollarSign"
          color="accent"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
              <Button variant="ghost" size="sm" icon="Plus">
                Add Task
              </Button>
            </div>
            
            {todaysTasks.length === 0 ? (
              <Empty
                icon="CheckSquare"
                title="No tasks for today"
                description="You're all caught up! Great job."
                actionLabel="Add New Task"
              />
            ) : (
              <div className="space-y-3">
                {todaysTasks.map(task => (
                  <TaskItem
                    key={task.Id}
                    task={task}
                    onToggleComplete={handleToggleTask}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="AlertTriangle" size={20} className="text-red-500" />
                <h2 className="text-xl font-semibold text-red-700">Overdue Tasks</h2>
              </div>
              
              <div className="space-y-3">
                {overdueTasks.map(task => (
                  <TaskItem
                    key={task.Id}
                    task={task}
                    onToggleComplete={handleToggleTask}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Weather Widget */}
          {weather && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Weather
              </h3>
              <WeatherCard weather={weather} compact />
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" icon="MapPin">
                Add New Farm
              </Button>
              <Button variant="outline" className="w-full justify-start" icon="Sprout">
                Plant New Crop
              </Button>
              <Button variant="outline" className="w-full justify-start" icon="CheckSquare">
                Create Task
              </Button>
              <Button variant="outline" className="w-full justify-start" icon="DollarSign">
                Log Expense
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {expenses.slice(-3).reverse().map(expense => (
                <div key={expense.Id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="DollarSign" size={16} className="text-accent-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {expense.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${expense.amount} • {format(new Date(expense.date), 'MMM d')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard