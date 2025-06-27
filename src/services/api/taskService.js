import tasksData from '@/services/mockData/tasks.json'
import { notificationService } from '@/services/api/notificationService'

let tasks = [...tasksData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.Id === parseInt(id))
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  },

  async getByFarmId(farmId) {
    await delay(250)
    return tasks.filter(t => t.farmId === farmId.toString()).map(t => ({ ...t }))
  },

  async getTodaysTasks() {
    await delay(200)
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter(t => t.dueDate === today).map(t => ({ ...t }))
  },

  async getOverdueTasks() {
    await delay(200)
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter(t => t.dueDate < today && !t.completed).map(t => ({ ...t }))
  },

async create(taskData) {
    await delay(400)
    const maxId = Math.max(...tasks.map(t => t.Id), 0)
    const newTask = {
      Id: maxId + 1,
      ...taskData
    }
    tasks.push(newTask)
    
    // Schedule notification for new task
    await notificationService.scheduleTaskReminder(newTask)
    
    return { ...newTask }
  },

async update(id, taskData) {
    await delay(350)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    // Cancel existing notifications for this task
    notificationService.cancelTaskNotifications(parseInt(id))
    
    tasks[index] = { ...tasks[index], ...taskData }
    
    // Schedule new notifications if task is not completed
    if (!tasks[index].completed) {
      await notificationService.scheduleTaskReminder(tasks[index])
    }
    
    return { ...tasks[index] }
  },

async toggleComplete(id) {
    await delay(250)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const wasCompleted = tasks[index].completed
    tasks[index].completed = !tasks[index].completed
    
    if (tasks[index].completed) {
      // Cancel notifications when task is completed
      notificationService.cancelTaskNotifications(parseInt(id))
    } else if (wasCompleted) {
      // Reschedule notifications when task is marked as incomplete
      await notificationService.scheduleTaskReminder(tasks[index])
    }
    
    return { ...tasks[index] }
  },

async delete(id) {
    await delay(250)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    // Cancel notifications for deleted task
    notificationService.cancelTaskNotifications(parseInt(id))
    
    tasks.splice(index, 1)
    return true
  },

  async scheduleNotification(task) {
    return await notificationService.scheduleTaskReminder(task)
  },

  async requestNotificationPermission() {
    return await notificationService.requestPermission()
  },

  getNotificationPermissionStatus() {
    return notificationService.getPermissionStatus()
  },

  isNotificationSupported() {
    return notificationService.isSupported()
  },

  async testNotification() {
    return await notificationService.testNotification()
  }
}