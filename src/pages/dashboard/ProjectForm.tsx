import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { projectApi, developerApi } from '@/lib/api'
import type { Project, Developer } from '@/lib/types'

export default function ProjectForm() {
    const { t } = useTranslation('dashboard')
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = !!id

    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)
    const [developers, setDevelopers] = useState<Developer[]>([])
    const [formData, setFormData] = useState({
        developerId: '',
        name: '',
        overview: '',
        locationText: '',
        amenitiesOverview: '',
        unitTypesOverview: '',
        technicalSpecs: '',
        status: 'Planned'
    })

    useEffect(() => {
        fetchDevelopers()
        if (isEditing && id) {
            fetchProject(id)
        }
    }, [id, isEditing])

    const fetchDevelopers = async () => {
        try {
            const { data, error } = await developerApi.getAll()
            if (error) throw error
            setDevelopers(data || [])
        } catch (error) {
            console.error('Error fetching developers:', error)
        }
    }

    const fetchProject = async (projectId: string) => {
        try {
            setLoading(true)
            const { data, error } = await projectApi.getById(projectId)

            if (error) throw error

            if (data) {
                setFormData({
                    developerId: data.developerId,
                    name: data.name,
                    overview: data.overview || '',
                    locationText: data.locationText || '',
                    amenitiesOverview: data.amenitiesOverview || '',
                    unitTypesOverview: data.unitTypesOverview || '',
                    technicalSpecs: data.technicalSpecs || '',
                    status: data.status || 'Planned'
                })
            }
        } catch (error) {
            console.error('Error fetching project:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            alert('Project name is required')
            return
        }

        if (!formData.developerId) {
            alert('Please select a developer')
            return
        }

        try {
            setSaving(true)

            if (isEditing && id) {
                const { error } = await projectApi.update(id, formData)
                if (error) throw error
            } else {
                const { error } = await projectApi.create(formData)
                if (error) throw error
            }

            navigate('/dashboard/projects')
        } catch (error) {
            console.error('Error saving project:', error)
            alert('Failed to save project. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
                        <p className="text-gray-600 mt-4">Loading project...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEditing ? 'Edit Project' : 'Add New Project'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isEditing ? 'Update project information' : 'Create a new real estate project'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
                    <div className="space-y-6">
                        {/* Developer Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Developer <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.developerId}
                                onChange={(e) => handleChange('developerId', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                                required
                            >
                                <option value="">Select a developer</option>
                                {developers.map(dev => (
                                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                                ))}
                            </select>
                            {developers.length === 0 && (
                                <p className="text-sm text-gray-500 mt-2">
                                    No developers available. Please add a developer first.
                                </p>
                            )}
                        </div>

                        {/* Project Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                                placeholder="e.g., Palm Hills Extension, Downtown Residences"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.locationText}
                                onChange={(e) => handleChange('locationText', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                                placeholder="e.g., New Cairo, North Coast"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                            >
                                <option value="Planned">Planned</option>
                                <option value="Under Construction">Under Construction</option>
                                <option value="Completed">Completed</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>

                        {/* Overview */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Overview
                            </label>
                            <textarea
                                value={formData.overview}
                                onChange={(e) => handleChange('overview', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                                placeholder="General overview of the project..."
                            />
                        </div>

                        {/* Amenities Overview */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amenities Overview
                            </label>
                            <textarea
                                value={formData.amenitiesOverview}
                                onChange={(e) => handleChange('amenitiesOverview', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                                placeholder="List and describe project amenities (pools, gym, parks, etc.)..."
                            />
                        </div>

                        {/* Unit Types Overview */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unit Types Overview
                            </label>
                            <textarea
                                value={formData.unitTypesOverview}
                                onChange={(e) => handleChange('unitTypesOverview', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                                placeholder="Available unit types (apartments, villas, townhouses, etc.)..."
                            />
                        </div>

                        {/* Technical Specifications */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Technical Specifications
                            </label>
                            <textarea
                                value={formData.technicalSpecs}
                                onChange={(e) => handleChange('technicalSpecs', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                                placeholder="Technical details, construction standards, materials, etc...."
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/projects')}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={saving || developers.length === 0}
                        >
                            {saving ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
