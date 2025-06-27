import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const WeatherCard = ({ weather, compact = false }) => {
  const getWeatherIcon = (conditions) => {
    const condition = conditions.toLowerCase()
    if (condition.includes('sun') || condition.includes('clear')) return 'Sun'
    if (condition.includes('cloud')) return 'Cloud'
    if (condition.includes('rain')) return 'CloudRain'
    if (condition.includes('snow')) return 'CloudSnow'
    if (condition.includes('storm')) return 'CloudLightning'
    return 'Cloud'
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-3">
          <ApperIcon 
            name={getWeatherIcon(weather.conditions)} 
            size={24} 
            className="text-blue-600" 
          />
          <div>
            <p className="font-medium text-gray-900">{weather.conditions}</p>
            <p className="text-sm text-gray-600">
              {weather.precipitation}% chance of rain
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{weather.high}°</p>
          <p className="text-sm text-gray-600">{weather.low}°</p>
        </div>
      </div>
    )
  }

  return (
    <Card gradient className="text-center">
      <div className="flex flex-col items-center space-y-4">
        <ApperIcon 
          name={getWeatherIcon(weather.conditions)} 
          size={48} 
          className="text-blue-600" 
        />
        
        <div>
          <p className="text-lg font-semibold text-gray-900">{weather.conditions}</p>
          <p className="text-sm text-gray-600">
            {new Date(weather.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{weather.high}°</p>
            <p className="text-sm text-gray-600">High</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-700">{weather.low}°</p>
            <p className="text-sm text-gray-600">Low</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-blue-600">
          <ApperIcon name="Droplets" size={16} />
          <span className="text-sm font-medium">{weather.precipitation}% chance</span>
        </div>
      </div>
    </Card>
  )
}

export default WeatherCard