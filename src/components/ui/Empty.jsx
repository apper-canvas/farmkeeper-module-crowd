import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Empty = ({ 
  icon = 'Package', 
  title = 'No items found', 
  description = 'Get started by adding your first item.',
  actionLabel = 'Add Item',
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      className={`flex items-center justify-center py-12 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="text-center max-w-md">
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-full"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ApperIcon name={icon} size={64} className="text-primary-600" />
          </motion.div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600">{description}</p>
          </div>
          
          {onAction && (
            <Button
              variant="primary"
              onClick={onAction}
              icon="Plus"
              size="lg"
              className="mt-4"
            >
              {actionLabel}
            </Button>
          )}
          
          <div className="grid grid-cols-3 gap-4 w-full mt-8 opacity-20">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Empty