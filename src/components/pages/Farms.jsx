import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { farmService } from '@/services/api/farmService'

const Farms = () => {
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingFarm, setEditingFarm] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    sizeUnit: 'acres'
  })

  const sizeUnits = [
    { value: 'acres', label: 'Acres' },
    { value: 'hectares', label: 'Hectares' },
    { value: 'sq_ft', label: 'Square Feet' }
  ]

  const loadFarms = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await farmService.getAll()
      setFarms(data)
    } catch (err) {
      setError(err.message || 'Failed to load farms')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFarms()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingFarm) {
        const updated = await farmService.update(editingFarm.Id, {
          ...formData,
          size: parseFloat(formData.size)
        })
        setFarms(prev => prev.map(farm => 
          farm.Id === editingFarm.Id ? updated : farm
        ))
        toast.success('Farm updated successfully!')
      } else {
        const newFarm = await farmService.create({
          ...formData,
          size: parseFloat(formData.size)
        })
        setFarms(prev => [...prev, newFarm])
        toast.success('Farm added successfully!')
      }
      
      resetForm()
    } catch (err) {
      toast.error(err.message || 'Failed to save farm')
    }
  }

  const handleEdit = (farm) => {
    setEditingFarm(farm)
    setFormData({
      name: farm.name,
      location: farm.location,
      size: farm.size.toString(),
      sizeUnit: farm.sizeUnit
    })
    setShowAddForm(true)
  }

  const handleDelete = async (farmId) => {
    if (!confirm('Are you sure you want to delete this farm?')) return
    
    try {
      await farmService.delete(farmId)
      setFarms(prev => prev.filter(farm => farm.Id !== farmId))
      toast.success('Farm deleted successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to delete farm')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      size: '',
      sizeUnit: 'acres'
    })
    setEditingFarm(null)
    setShowAddForm(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) return <Loading type="cards" count={6} />
  if (error) return <Error message={error} onRetry={loadFarms} />

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Farms</h1>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowAddForm(true)}
        >
          Add Farm
        </Button>
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {editingFarm ? 'Edit Farm' : 'Add New Farm'}
                </h2>
                <Button variant="ghost" size="sm" icon="X" onClick={resetForm} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Farm Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Enter farm name"
                />

                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  placeholder="Enter location"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Size"
                    type="number"
                    step="0.1"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    required
                    placeholder="0.0"
                  />

                  <Select
                    label="Unit"
                    value={formData.sizeUnit}
                    onChange={(e) => handleInputChange('sizeUnit', e.target.value)}
                    options={sizeUnits}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingFarm ? 'Update Farm' : 'Add Farm'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Farms Grid */}
      {farms.length === 0 ? (
        <Empty
          icon="MapPin"
          title="No farms added yet"
          description="Start by adding your first farm to begin tracking your agricultural operations."
          actionLabel="Add Your First Farm"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <motion.div
              key={farm.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card gradient className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary-50 rounded-xl">
                      <ApperIcon name="MapPin" size={24} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
                      <p className="text-sm text-gray-600">{farm.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit2"
                      onClick={() => handleEdit(farm)}
                      className="text-gray-500 hover:text-gray-700"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDelete(farm.Id)}
                      className="text-red-500 hover:text-red-700"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Ruler" size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {farm.size} {farm.sizeUnit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-900">
                      Active Farm
                    </span>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Farms