import { motion } from 'framer-motion'
import { differenceInDays, format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import ProgressRing from '@/components/molecules/ProgressRing'

const CropCard = ({ crop, onEdit, onDelete }) => {
  const daysPlanted = differenceInDays(new Date(), new Date(crop.plantingDate))
  const daysToHarvest = differenceInDays(new Date(crop.expectedHarvestDate), new Date())
  const totalGrowingDays = differenceInDays(new Date(crop.expectedHarvestDate), new Date(crop.plantingDate))
  const progress = Math.min(Math.max((daysPlanted / totalGrowingDays) * 100, 0), 100)

  const getCropIcon = (type) => {
    const icons = {
      tomato: 'Apple',
      corn: 'Wheat',
      wheat: 'Wheat',
      lettuce: 'Leaf',
      carrot: 'Carrot',
      potato: 'Circle',
      beans: 'Seed',
      pepper: 'Cherry'
    }
    return icons[type.toLowerCase()] || 'Sprout'
  }

  const getStatusColor = () => {
    if (daysToHarvest < 0) return 'text-red-600 bg-red-50'
    if (daysToHarvest <= 7) return 'text-yellow-600 bg-yellow-50'
    if (progress > 75) return 'text-orange-600 bg-orange-50'
    return 'text-green-600 bg-green-50'
  }

  const getStatusText = () => {
    if (daysToHarvest < 0) return 'Overdue'
    if (daysToHarvest <= 7) return 'Ready Soon'
    if (progress > 75) return 'Maturing'
    return 'Growing'
  }

  return (
    <Card gradient className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <ApperIcon name={getCropIcon(crop.type)} size={24} className="text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">{crop.type}</h3>
            <p className="text-sm text-gray-600">{crop.location}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(crop)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="Edit2" size={16} />
          </button>
          <button
            onClick={() => onDelete(crop.Id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Planted: {format(new Date(crop.plantingDate), 'MMM d')}
            </p>
            <p className="text-sm text-gray-600">
              Harvest: {format(new Date(crop.expectedHarvestDate), 'MMM d')}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {daysToHarvest > 0 ? `${daysToHarvest} days to harvest` : 'Ready to harvest!'}
            </p>
          </div>
        </div>
        
        <ProgressRing 
          progress={progress} 
          size={80} 
          strokeWidth={6}
          color="#2D5016"
        >
          <div className="text-center">
            <p className="text-lg font-bold text-primary-600">{Math.round(progress)}%</p>
            <p className="text-xs text-gray-500">Growth</p>
          </div>
        </ProgressRing>
      </div>
    </Card>
  )
}

export default CropCard