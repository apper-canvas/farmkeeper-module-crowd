import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import TaskItem from '@/components/molecules/TaskItem'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services/api/taskService'
import { farmService } from '@/services/api/farmService'
import { cropService } from '@/services/api/cropService'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [farms, setFarms] = useState([])
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterFarm, setFilterFarm] = useState('')
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState('default')
  const [formData, setFormData] = useState({
    farmId: '',
    cropId: '',
    title: '',
    type: '',
    dueDate: '',
    notes: ''
  })

  const taskTypes = [
    { value: 'watering', label: 'Watering' },
    { value: 'fertilizing', label: 'Fertilizing' },
    { value: 'harvesting', label: 'Harvesting' },
    { value: 'planting', label: 'Planting' },
    { value: 'weeding', label: 'Weeding' },
    { value: 'pruning', label: 'Pruning' },
    { value: 'inspection', label: 'Inspection' }
  ]

  const statusFilters = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ])
      setTasks(tasksData)
      setFarms(farmsData)
      setCrops(cropsData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
    loadData()
    setNotificationPermission(taskService.getNotificationPermissionStatus())
  }, [])

  const filteredTasks = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0]
    const isOverdue = task.dueDate < today && !task.completed
    
    let statusMatch = true
    if (filterStatus === 'pending') statusMatch = !task.completed && !isOverdue
    if (filterStatus === 'completed') statusMatch = task.completed
    if (filterStatus === 'overdue') statusMatch = isOverdue
    
    const farmMatch = !filterFarm || task.farmId === filterFarm
    
    return statusMatch && farmMatch
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTask) {
        const updated = await taskService.update(editingTask.Id, formData)
        setTasks(prev => prev.map(task => 
          task.Id === editingTask.Id ? updated : task
        ))
        toast.success('Task updated successfully!')
      } else {
        const newTask = await taskService.create({
          ...formData,
          completed: false
        })
        setTasks(prev => [...prev, newTask])
        toast.success('Task added successfully!')
      }
      
      resetForm()
    } catch (err) {
      toast.error(err.message || 'Failed to save task')
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const updated = await taskService.toggleComplete(taskId)
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updated : task
      ))
      toast.success('Task updated successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to update task')
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      farmId: task.farmId,
      cropId: task.cropId,
      title: task.title,
      type: task.type,
      dueDate: task.dueDate,
      notes: task.notes
    })
    setShowAddForm(true)
  }

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task deleted successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to delete task')
    }
  }

  const resetForm = () => {
    setFormData({
      farmId: '',
      cropId: '',
      title: '',
      type: '',
      dueDate: '',
      notes: ''
    })
    setEditingTask(null)
    setShowAddForm(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getFarmCrops = (farmId) => {
    return crops.filter(crop => crop.farmId === farmId)
  }

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === parseInt(farmId))
    return farm ? farm.name : 'Unknown Farm'
  }

  const getCropName = (cropId) => {
    const crop = crops.find(c => c.Id === parseInt(cropId))
    return crop ? `${crop.type} (${crop.location})` : 'General Task'
  }

  if (loading) return <Loading type="list" count={8} />
  if (error) return <Error message={error} onRetry={loadData} />

const handleRequestNotificationPermission = async () => {
    const granted = await taskService.requestNotificationPermission()
    if (granted) {
      setNotificationPermission('granted')
    }
  }

  const handleTestNotification = async () => {
    await taskService.testNotification()
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon="Bell"
            onClick={() => setShowNotificationSettings(true)}
            className="relative"
          >
            Notifications
            {notificationPermission === 'granted' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
            )}
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setShowAddForm(true)}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={statusFilters}
          className="min-w-[150px]"
        />
        
        <Select
          value={filterFarm}
          onChange={(e) => setFilterFarm(e.target.value)}
          options={farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }))}
          placeholder="All Farms"
          className="min-w-[150px]"
        />
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3">
            <ApperIcon name="CheckSquare" size={24} className="text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-700">{tasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Clock" size={24} className="text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">
                {tasks.filter(t => !t.completed).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
          <div className="flex items-center space-x-3">
            <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-700">
                {tasks.filter(t => {
                  const today = new Date().toISOString().split('T')[0]
                  return t.dueDate < today && !t.completed
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3">
            <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-700">
                {tasks.filter(t => t.completed).length}
              </p>
            </div>
          </div>
        </div>
      </div>

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
              className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {editingTask ? 'Edit Task' : 'Add New Task'}
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

                {formData.farmId && (
                  <Select
                    label="Crop (Optional)"
                    value={formData.cropId}
                    onChange={(e) => handleInputChange('cropId', e.target.value)}
                    options={getFarmCrops(formData.farmId).map(crop => ({ 
                      value: crop.Id.toString(), 
                      label: `${crop.type} (${crop.location})` 
                    }))}
                    placeholder="Select a crop or leave blank for general task"
                  />
                )}

                <Input
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  placeholder="Enter task description"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Task Type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    options={taskTypes}
                    required
                    placeholder="Select task type"
                  />

                  <Input
                    label="Due Date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Notes (Optional)"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes or instructions"
                />

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingTask ? 'Update Task' : 'Add Task'}
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

      {/* Notification Settings Modal */}
      <AnimatePresence>
        {showNotificationSettings && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Notification Settings</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon="X" 
                  onClick={() => setShowNotificationSettings(false)} 
                />
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Push Notifications</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      notificationPermission === 'granted' 
                        ? 'bg-green-100 text-green-700' 
                        : notificationPermission === 'denied'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {notificationPermission === 'granted' ? 'Enabled' : 
                       notificationPermission === 'denied' ? 'Blocked' : 'Not Set'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Get reminders for upcoming tasks like watering, fertilizing, and harvesting.
                  </p>
                  
                  {notificationPermission !== 'granted' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleRequestNotificationPermission}
                      className="w-full"
                    >
                      Enable Notifications
                    </Button>
                  )}
                </div>

                {notificationPermission === 'granted' && (
                  <div className="space-y-3">
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <ApperIcon name="Clock" size={16} className="text-blue-500" />
                        <span className="text-sm font-medium">Reminder Schedule</span>
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• 1 day before due date</li>
                        <li>• 1 hour before due date</li>
                        <li>• On due date</li>
                      </ul>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestNotification}
                      className="w-full"
                    >
                      Test Notification
                    </Button>
                  </div>
                )}

                {notificationPermission === 'denied' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      Notifications are blocked. Please enable them in your browser settings to receive task reminders.
                    </p>
                  </div>
                )}

                {!taskService.isNotificationSupported() && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      Your browser doesn't support push notifications.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowNotificationSettings(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          description={filterStatus !== 'all' || filterFarm 
            ? "No tasks match your current filters. Try adjusting your search criteria."
            : "Start by adding your first task to keep track of your farm activities."
          }
          actionLabel="Add Your First Task"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.Id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Tasks