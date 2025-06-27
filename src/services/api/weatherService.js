import weatherData from '@/services/mockData/weather.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const weatherService = {
  async getForecast() {
    await delay(200)
    return [...weatherData]
  },

  async getCurrentWeather() {
    await delay(150)
    return { ...weatherData[0] }
  },

  async getWeatherByDate(date) {
    await delay(100)
    const weather = weatherData.find(w => w.date === date)
    if (!weather) {
      throw new Error('Weather data not found for this date')
    }
    return { ...weather }
  }
}