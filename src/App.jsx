import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Farms from '@/components/pages/Farms'
import Crops from '@/components/pages/Crops'
import Tasks from '@/components/pages/Tasks'
import Expenses from '@/components/pages/Expenses'
import Weather from '@/components/pages/Weather'

function App() {
  return (
    <Router>
      <motion.div 
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/farms" element={<Farms />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/weather" element={<Weather />} />
          </Routes>
        </Layout>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastStyle={{
            fontSize: '14px',
            borderRadius: '12px'
          }}
        />
      </motion.div>
    </Router>
  )
}

export default App