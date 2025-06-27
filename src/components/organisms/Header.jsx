import { useState, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Header = ({ onMenuToggle, title = 'Dashboard' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(timer)
    }
  }, [])

  return (
    <>
      {!isOnline && (
        <div className="offline-indicator">
          <ApperIcon name="WifiOff" size={16} className="inline mr-2" />
          You're offline - changes will sync when connection is restored
        </div>
      )}
      
      <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon="Menu"
              onClick={onMenuToggle}
              className="lg:hidden"
            />
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-600 hidden sm:inline">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 hidden md:block">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header