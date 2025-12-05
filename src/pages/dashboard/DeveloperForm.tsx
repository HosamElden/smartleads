import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { developerApi } from '@/lib/api'
import type { Developer, Attachment } from '@/lib/types'

export default function DeveloperForm() {
    const { t } = useTranslation('dashboard')
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = !!id

    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        overview: '',
        companyEvolution: '',
        shareholders: '',
        competitiveAdvantages: '',
        projectsOverview: ''
    })

    useEffect(() => {
        if (isEditing && id) {
            fetchDeveloper(id)
        }
    }, [id, isEditing])

    const fetchDeveloper = async (developerId: string) => {
        try {
            setLoading(true)
            const { data, error } = await developerApi.getById(developerId)

            if (error) throw error

            if (data) {
                setFormData({
                    name: data.name,
                    overview: data.overview || '',
                    companyEvolution: data.companyEvolution || '',
                    shareholders: data.shareholders || '',
                    competitiveAdvantages: data.competitiveAdvantages || '',
                    projectsOverview: data.projectsOverview || ''
                })
            }
        } catch (error) {
            console.error('Error fetching developer:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            alert('Developer name is required')
            return
        }

        try {
            setSaving(true)

            if (isEditing && id) {
                const { error } = await developerApi.update(id, formData)
                if (error) throw error
            } else {
                const { error } = await developerApi.create(formData)
                if (error) throw error
            }

            navigate('/dashboard/developers')
        } catch (error) {
            console.error('Error saving developer:', error)
            alert('Failed to save developer. Please try again.')
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
                        <p className="text-gray-600 mt-4">Loading developer...</p>
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
                        {isEditing ? 'Edit Developer' : 'Add New Developer'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isEditing ? 'Update developer information' : 'Create a new developer profile'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
                    <div className="space-y-6">
                        {/* Developer Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Developer Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                                placeholder="e.g., Emaar Properties, Almarai Development"
                                required
                            />
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
                                placeholder="General overview of the developer company..."
                            />
                        </div>

                        {/* Company Evolution */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Evolution
                            </label>
                            <textarea
                                value={formData.companyEvolution}
                                onChange={(e) => handleChange('companyEvolution', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                                placeholder="History and evolution of the company..."
                            />
                        </div>

                        {/* Shareholders */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shareholders
                            </label>
                            <textarea
                                value={formData.shareholders}
                                onChange={(e) => handleChange('shareholders', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                                placeholder="Information about company shareholders..."
                            />
                        </div>

                        {/* Competitive Advantages */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Competitive Advantages
                            </label>
                            <textarea
                                value={formData.competitiveAdvantages}
                                onChange={(e) => handleChange('competitiveAdvantages', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                                placeholder="Key competitive advantages and differentiators..."
                            />
                        </div>

                        {/* Projects Overview */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Projects Overview
                            </label>
                            <textarea
                                value={formData.projectsOverview}
                                onChange={(e) => handleChange('projectsOverview', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                                placeholder="Overview of developer's projects and portfolio..."
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/developers')}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : isEditing ? 'Update Developer' : 'Create Developer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
