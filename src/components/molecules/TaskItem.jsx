import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const getTaskIcon = (type) => {
    const icons = {
      watering: 'Droplets',
      fertilizing: 'Leaf',
      harvesting: 'Scissors',
      planting: 'Seed',
      weeding: 'Trash2',
      pruning: 'Scissors',
      inspection: 'Eye'
    }
    return icons[type] || 'CheckCircle'
  }

  const getTaskColor = (type) => {
    const colors = {
      watering: 'text-blue-600 bg-blue-50',
      fertilizing: 'text-green-600 bg-green-50',
      harvesting: 'text-yellow-600 bg-yellow-50',
      planting: 'text-emerald-600 bg-emerald-50',
      weeding: 'text-red-600 bg-red-50',
      pruning: 'text-purple-600 bg-purple-50',
      inspection: 'text-indigo-600 bg-indigo-50'
    }
    return colors[type] || 'text-gray-600 bg-gray-50'
  }

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed
  const isDueSoon = new Date(task.dueDate) - new Date() < 24 * 60 * 60 * 1000 && !task.completed

  return (
    <motion.div
      className={`
        p-4 rounded-lg border-2 transition-all duration-200
        ${task.completed 
          ? 'bg-green-50 border-green-200' 
          : isOverdue 
            ? 'bg-red-50 border-red-200' 
            : isDueSoon 
              ? 'bg-yellow-50 border-yellow-200' 
              : 'bg-white border-gray-200'
        }
      `}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={() => onToggleComplete(task.Id)}
            className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
              ${task.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 hover:border-green-500'
              }
            `}
          >
            {task.completed && <ApperIcon name="Check" size={14} />}
          </button>
          
          <div className={`p-2 rounded-lg ${getTaskColor(task.type)}`}>
            <ApperIcon name={getTaskIcon(task.type)} size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {task.type} • Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </p>
            {task.notes && (
              <p className="text-sm text-gray-500 mt-1">{task.notes}</p>
            )}
            
            {isOverdue && !task.completed && (
              <div className="flex items-center space-x-1 mt-1">
                <ApperIcon name="AlertTriangle" size={14} className="text-red-500" />
                <span className="text-xs font-medium text-red-500">Overdue</span>
              </div>
            )}
            
            {isDueSoon && !task.completed && !isOverdue && (
              <div className="flex items-center space-x-1 mt-1">
                <ApperIcon name="Clock" size={14} className="text-yellow-500" />
                <span className="text-xs font-medium text-yellow-500">Due Soon</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Edit2"
            onClick={() => onEdit(task)}
            className="text-gray-500 hover:text-gray-700"
          />
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={() => onDelete(task.Id)}
            className="text-red-500 hover:text-red-700"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default TaskItem