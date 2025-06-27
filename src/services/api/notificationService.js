import { toast } from 'react-toastify'

class NotificationService {
  constructor() {
    this.permission = 'default'
    this.scheduledNotifications = new Map()
    this.init()
  }

  async init() {
    if ('Notification' in window) {
      this.permission = Notification.permission
      
      // Check if service worker is supported for more advanced notifications
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js')
        } catch (error) {
          console.log('Service Worker registration failed:', error)
        }
      }
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    const permission = await Notification.requestPermission()
    this.permission = permission

    if (permission === 'granted') {
      toast.success('Notifications enabled successfully!')
      return true
    } else if (permission === 'denied') {
      toast.error('Notifications blocked. Please enable them in browser settings.')
      return false
    } else {
      toast.warning('Notification permission dismissed')
      return false
    }
  }

  async scheduleTaskReminder(task) {
    if (this.permission !== 'granted' || task.completed) {
      return
    }

    const dueDate = new Date(task.dueDate)
    const now = new Date()
    
    // Schedule notification 1 day before due date
    const oneDayBefore = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000)
    if (oneDayBefore > now) {
      this.scheduleNotification(task, oneDayBefore, '1 day')
    }

    // Schedule notification 1 hour before due date
    const oneHourBefore = new Date(dueDate.getTime() - 60 * 60 * 1000)
    if (oneHourBefore > now) {
      this.scheduleNotification(task, oneHourBefore, '1 hour')
    }

    // Schedule notification on due date
    if (dueDate > now) {
      this.scheduleNotification(task, dueDate, 'now')
    }
  }

  scheduleNotification(task, scheduledTime, timeDescription) {
    const delay = scheduledTime.getTime() - Date.now()
    
    if (delay <= 0) return

    const timeoutId = setTimeout(() => {
      this.showTaskNotification(task, timeDescription)
    }, delay)

    const notificationKey = `${task.Id}_${timeDescription}`
    this.scheduledNotifications.set(notificationKey, timeoutId)
  }

  showTaskNotification(task, timeDescription) {
    const title = `Farm Task Reminder`
    const body = timeDescription === 'now' 
      ? `${task.title} is due today!`
      : `${task.title} is due in ${timeDescription}`

    const icon = this.getTaskIcon(task.type)
    
    const notification = new Notification(title, {
      body,
      icon,
      badge: '/farm-badge.png',
      tag: `task-${task.Id}`,
      data: {
        taskId: task.Id,
        taskTitle: task.title,
        dueDate: task.dueDate
      },
      actions: [
        {
          action: 'complete',
          title: 'Mark Complete'
        },
        {
          action: 'view',
          title: 'View Task'
        }
      ]
    })

    notification.onclick = () => {
      window.focus()
      // Navigate to tasks page
      window.location.hash = '/tasks'
      notification.close()
    }

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close()
    }, 10000)
  }

  getTaskIcon(taskType) {
    const icons = {
      watering: '/icons/watering.png',
      fertilizing: '/icons/fertilizing.png',
      harvesting: '/icons/harvesting.png',
      planting: '/icons/planting.png',
      weeding: '/icons/weeding.png',
      pruning: '/icons/pruning.png',
      inspection: '/icons/inspection.png'
    }
    return icons[taskType] || '/icons/default-task.png'
  }

  cancelTaskNotifications(taskId) {
    const keysToRemove = []
    
    for (const [key, timeoutId] of this.scheduledNotifications.entries()) {
      if (key.startsWith(`${taskId}_`)) {
        clearTimeout(timeoutId)
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => {
      this.scheduledNotifications.delete(key)
    })
  }

  async testNotification() {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission()
      if (!granted) return
    }

    const notification = new Notification('Test Notification', {
      body: 'Notifications are working correctly!',
      icon: '/farm-badge.png'
    })

    setTimeout(() => {
      notification.close()
    }, 5000)

    toast.success('Test notification sent!')
  }

  getPermissionStatus() {
    return this.permission
  }

  isSupported() {
    return 'Notification' in window
  }
}

export const notificationService = new NotificationService()