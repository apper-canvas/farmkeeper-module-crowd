import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import CropCard from '@/components/molecules/CropCard'
import ApperIcon from '@/components/ApperIcon'
import { cropService } from '@/services/api/cropService'
import { farmService } from '@/services/api/farmService'

const Crops = () => {
  const [crops, setCrops] = useState([])
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCrop, setEditingCrop] = useState(null)
  const [selectedFarm, setSelectedFarm] = useState('')
  const [formData, setFormData] = useState({
    farmId: '',
    type: '',
    plantingDate: '',
    expectedHarvestDate: '',
    location: '',
    quantity: '',
    status: 'growing'
  })

  const cropTypes = [
    { value: 'tomato', label: 'Tomato' },
    { value: 'corn', label: 'Corn' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'lettuce', label: 'Lettuce' },
    { value: 'carrot', label: 'Carrot' },
    { value: 'potato', label: 'Potato' },
    { value: 'beans', label: 'Beans' },
    { value: 'pepper', label: 'Pepper' }
  ]

  const statusOptions = [
    { value: 'growing', label: 'Growing' },
    { value: 'harvested', label: 'Harvested' },
    { value: 'planted', label: 'Recently Planted' }
  ]

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ])
      setCrops(cropsData)
      setFarms(farmsData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredCrops = selectedFarm 
    ? crops.filter(crop => crop.farmId === selectedFarm)
    : crops

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCrop) {
        const updated = await cropService.update(editingCrop.Id, {
          ...formData,
          quantity: parseInt(formData.quantity)
        })
        setCrops(prev => prev.map(crop => 
          crop.Id === editingCrop.Id ? updated : crop
        ))
        toast.success('Crop updated successfully!')
      } else {
        const newCrop = await cropService.create({
          ...formData,
          quantity: parseInt(formData.quantity)
        })
        setCrops(prev => [...prev, newCrop])
        toast.success('Crop added successfully!')
      }
      
      resetForm()
    } catch (err) {
      toast.error(err.message || 'Failed to save crop')
    }
  }

  const handleEdit = (crop) => {
    setEditingCrop(crop)
    setFormData({
      farmId: crop.farmId,
      type: crop.type,
      plantingDate: crop.plantingDate,
      expectedHarvestDate: crop.expectedHarvestDate,
      location: crop.location,
      quantity: crop.quantity.toString(),
      status: crop.status
    })
    setShowAddForm(true)
  }

  const handleDelete = async (cropId) => {
    if (!confirm('Are you sure you want to delete this crop?')) return
    
    try {
      await cropService.delete(cropId)
      setCrops(prev => prev.filter(crop => crop.Id !== cropId))
      toast.success('Crop deleted successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to delete crop')
    }
  }

  const resetForm = () => {
    setFormData({
      farmId: '',
      type: '',
      plantingDate: '',
      expectedHarvestDate: '',
      location: '',
      quantity: '',
      status: 'growing'
    })
    setEditingCrop(null)
    setShowAddForm(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === parseInt(farmId))
    return farm ? farm.name : 'Unknown Farm'
  }

  if (loading) return <Loading type="cards" count={6} />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crops</h1>
        
        <div className="flex items-center space-x-4">
          <Select
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
            options={farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }))}
            placeholder="All Farms"
            className="min-w-[150px]"
          />
          
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setShowAddForm(true)}
          >
            Add Crop
          </Button>
        </div>
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
              className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {editingCrop ? 'Edit Crop' : 'Add New Crop'}
                </h2>
                <Button variant="ghost" size="sm" icon="X" onClick={resetForm} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                  label="Farm"
                  value={formData.farmId}
                  onChange={(e) => handleInputChange('farmId', e.target.value)}
                  options={farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }))}
                  required
                  placeholder="Select a farm"
                />

                <Select
                  label="Crop Type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  options={cropTypes}
                  required
                  placeholder="Select crop type"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Planting Date"
                    type="date"
                    value={formData.plantingDate}
                    onChange={(e) => handleInputChange('plantingDate', e.target.value)}
                    required
                  />

                  <Input
                    label="Expected Harvest"
                    type="date"
                    value={formData.expectedHarvestDate}
                    onChange={(e) => handleInputChange('expectedHarvestDate', e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  placeholder="e.g., North Field A, Greenhouse 1"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    required
                    placeholder="Number of plants"
                  />

                  <Select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    options={statusOptions}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingCrop ? 'Update Crop' : 'Add Crop'}
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Sprout" size={24} className="text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Total Crops</p>
              <p className="text-2xl font-bold text-green-700">{filteredCrops.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3">
            <ApperIcon name="TrendingUp" size={24} className="text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Growing</p>
              <p className="text-2xl font-bold text-blue-700">
                {filteredCrops.filter(c => c.status === 'growing').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Scissors" size={24} className="text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">Ready Soon</p>
              <p className="text-2xl font-bold text-yellow-700">
                {filteredCrops.filter(c => {
                  const daysToHarvest = Math.floor((new Date(c.expectedHarvestDate) - new Date()) / (1000 * 60 * 60 * 24))
                  return daysToHarvest <= 7 && daysToHarvest >= 0
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center space-x-3">
            <ApperIcon name="CheckCircle" size={24} className="text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Harvested</p>
              <p className="text-2xl font-bold text-purple-700">
                {filteredCrops.filter(c => c.status === 'harvested').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <Empty
          icon="Sprout"
          title="No crops found"
          description={selectedFarm 
            ? "No crops planted in this farm yet. Start by adding your first crop!"
            : "Start by adding your first crop to begin tracking your agricultural production."
          }
          actionLabel="Add Your First Crop"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <motion.div
              key={crop.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CropCard
                crop={crop}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              
              {/* Farm Info */}
              <div className="mt-2 px-2">
                <p className="text-xs text-gray-500">
                  <ApperIcon name="MapPin" size={12} className="inline mr-1" />
                  {getFarmName(crop.farmId)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Crops