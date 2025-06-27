import cropsData from '@/services/mockData/crops.json'

let crops = [...cropsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const cropService = {
  async getAll() {
    await delay(300)
    return [...crops]
  },

  async getById(id) {
    await delay(200)
    const crop = crops.find(c => c.Id === parseInt(id))
    if (!crop) {
      throw new Error('Crop not found')
    }
    return { ...crop }
  },

  async getByFarmId(farmId) {
    await delay(250)
    return crops.filter(c => c.farmId === farmId.toString()).map(c => ({ ...c }))
  },

  async create(cropData) {
    await delay(400)
    const maxId = Math.max(...crops.map(c => c.Id), 0)
    const newCrop = {
      Id: maxId + 1,
      ...cropData
    }
    crops.push(newCrop)
    return { ...newCrop }
  },

  async update(id, cropData) {
    await delay(350)
    const index = crops.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Crop not found')
    }
    crops[index] = { ...crops[index], ...cropData }
    return { ...crops[index] }
  },

  async delete(id) {
    await delay(250)
    const index = crops.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Crop not found')
    }
    crops.splice(index, 1)
    return true
  }
}