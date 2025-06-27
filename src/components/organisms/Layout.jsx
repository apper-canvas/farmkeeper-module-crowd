import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const getPageTitle = () => {
    const titles = {
      '/': 'Dashboard',
      '/farms': 'Farms',
      '/crops': 'Crops',
      '/tasks': 'Tasks',
      '/expenses': 'Expenses',
      '/weather': 'Weather'
    }
    return titles[location.pathname] || 'FarmKeeper'
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={getPageTitle()}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout