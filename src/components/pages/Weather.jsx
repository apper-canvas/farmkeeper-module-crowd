import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import WeatherCard from '@/components/molecules/WeatherCard'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { weatherService } from '@/services/api/weatherService'

const Weather = () => {
  const [forecast, setForecast] = useState([])
  const [currentWeather, setCurrentWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      setError('')
      const [forecastData, currentData] = await Promise.all([
        weatherService.getForecast(),
        weatherService.getCurrentWeather()
      ])
      setForecast(forecastData)
      setCurrentWeather(currentData)
    } catch (err) {
      setError(err.message || 'Failed to load weather data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeatherData()
  }, [])

  const getWeatherAdvice = (weather) => {
    const advice = []
    
    if (weather.precipitation > 70) {
      advice.push({
        icon: 'CloudRain',
        text: 'Heavy rain expected - avoid outdoor tasks',
        type: 'warning'
      })
    } else if (weather.precipitation > 40) {
      advice.push({
        icon: 'Cloud',
        text: 'Light rain possible - plan indoor activities',
        type: 'info'
      })
    }
    
    if (weather.high > 85) {
      advice.push({
        icon: 'Sun',
        text: 'Hot weather - ensure adequate irrigation',
        type: 'warning'
      })
    } else if (weather.high > 75) {
      advice.push({
        icon: 'Thermometer',
        text: 'Warm weather - good for plant growth',
        type: 'success'
      })
    }
    
    if (weather.low < 45) {
      advice.push({
        icon: 'Snowflake',
        text: 'Cool temperatures - protect sensitive plants',
        type: 'warning'
      })
    }
    
    if (weather.precipitation < 20 && weather.high > 70) {
      advice.push({
        icon: 'Droplets',
        text: 'Great weather for outdoor farm work',
        type: 'success'
      })
    }
    
    return advice
  }

  const getAdviceColor = (type) => {
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    }
    return colors[type] || colors.info
  }

  if (loading) return <Loading type="cards" count={5} />
  if (error) return <Error message={error} onRetry={loadWeatherData} />

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Weather Forecast</h1>
        <p className="text-gray-600">
          Stay informed about weather conditions to plan your farm activities effectively
        </p>
      </div>

      {/* Current Weather Highlight */}
      {currentWeather && (
        <Card gradient className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Today's Weather</h2>
            <div className="text-sm text-gray-500">
              Last updated: {format(new Date(), 'h:mm a')}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherCard weather={currentWeather} compact />
            
            {/* Weather Advice */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 mb-3">Farm Activity Recommendations</h3>
              {getWeatherAdvice(currentWeather).map((advice, index) => (
                <motion.div
                  key={index}
                  className={`p-3 rounded-lg border ${getAdviceColor(advice.type)}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <ApperIcon name={advice.icon} size={20} />
                    <span className="text-sm font-medium">{advice.text}</span>
                  </div>
                </motion.div>
              ))}
              
              {getWeatherAdvice(currentWeather).length === 0 && (
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200 text-gray-600">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="CheckCircle" size={20} />
                    <span className="text-sm">Normal weather conditions - all activities can proceed as planned</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* 5-Day Forecast */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">5-Day Forecast</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {forecast.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WeatherCard weather={day} />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Weather Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Temperature Trend */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Trend</h3>
          <div className="space-y-3">
            {forecast.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {format(new Date(day.date), 'EEE, MMM d')}
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-red-600">{day.high}°</span>
                    <span className="text-sm text-gray-500">/{day.low}°</span>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-red-400 h-2 rounded-full"
                      style={{ width: `${((day.high - 32) / 68) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Precipitation Forecast */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Precipitation Forecast</h3>
          <div className="space-y-3">
            {forecast.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {format(new Date(day.date), 'EEE, MMM d')}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-600">
                    {day.precipitation}%
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                      style={{ width: `${day.precipitation}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Weather