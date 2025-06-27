import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection = 'up',
  color = 'primary',
  className = '' 
}) => {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-50',
    secondary: 'text-secondary-600 bg-secondary-50',
    accent: 'text-accent-600 bg-accent-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    error: 'text-red-600 bg-red-50'
  }
  
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <Card gradient className={className}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          
          {trend && (
            <div className="flex items-center space-x-1">
              <ApperIcon 
                name={trendDirection === 'up' ? 'TrendingUp' : trendDirection === 'down' ? 'TrendingDown' : 'Minus'} 
                size={16} 
                className={trendColors[trendDirection]} 
              />
              <span className={`text-sm font-medium ${trendColors[trendDirection]}`}>
                {trend}
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <ApperIcon name={icon} size={28} />
        </div>
      </div>
    </Card>
  )
}

export default StatCard