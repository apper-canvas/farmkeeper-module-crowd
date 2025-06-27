import tasksData from '@/services/mockData/tasks.json'

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
    return { ...newTask }
  },

  async update(id, taskData) {
    await delay(350)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    tasks[index] = { ...tasks[index], ...taskData }
    return { ...tasks[index] }
  },

  async toggleComplete(id) {
    await delay(250)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    tasks[index].completed = !tasks[index].completed
    return { ...tasks[index] }
  },

  async delete(id) {
    await delay(250)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    tasks.splice(index, 1)
    return true
  }
}