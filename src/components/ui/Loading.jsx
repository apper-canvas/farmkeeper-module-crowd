import { motion } from 'framer-motion'

const Loading = ({ type = 'cards', count = 3 }) => {
  const pulseAnimation = {
    animate: {
      opacity: [0.5, 1, 0.5],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-surface rounded-xl p-6 shadow-lg"
            {...pulseAnimation}
            transition={{ ...pulseAnimation.transition, delay: i * 0.1 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-surface rounded-lg p-4 shadow"
            {...pulseAnimation}
            transition={{ ...pulseAnimation.transition, delay: i * 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-gray-200 rounded-full" />
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded" />
                <div className="w-8 h-8 bg-gray-200 rounded" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  // Default spinner
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export default Loading