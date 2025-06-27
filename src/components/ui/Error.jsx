import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Error = ({ message = 'Something went wrong', onRetry, className = '' }) => {
  return (
    <motion.div
      className={`flex items-center justify-center py-12 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="text-center max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-red-50 rounded-full">
            <ApperIcon name="AlertTriangle" size={48} className="text-red-500" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
          
          {onRetry && (
            <Button
              variant="primary"
              onClick={onRetry}
              icon="RefreshCw"
              className="mt-4"
            >
              Try Again
            </Button>
          )}
          
          <div className="text-xs text-gray-500 mt-4">
            If the problem persists, please check your connection or try again later.
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Error