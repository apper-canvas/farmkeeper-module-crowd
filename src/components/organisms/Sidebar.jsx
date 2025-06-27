import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onToggle }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'Home' },
    { name: 'Farms', href: '/farms', icon: 'MapPin' },
    { name: 'Crops', href: '/crops', icon: 'Sprout' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Expenses', href: '/expenses', icon: 'DollarSign' },
    { name: 'Weather', href: '/weather', icon: 'Cloud' }
  ]

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        initial={false}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
                <ApperIcon name="Leaf" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FarmKeeper</h1>
                <p className="text-sm text-gray-600">Agriculture Management</p>
              </div>
            </div>
            
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <ApperIcon name="X" size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={() => window.innerWidth < 1024 && onToggle()}
              >
                <ApperIcon name={item.icon} size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
              <ApperIcon name="Users" size={20} className="text-primary-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Farm Manager</p>
                <p className="text-xs text-gray-600">Managing operations</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar