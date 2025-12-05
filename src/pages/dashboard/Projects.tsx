import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { projectApi, developerApi } from '@/lib/api'
import type { Project, Developer } from '@/lib/types'

export default function Projects() {
    const { t } = useTranslation('dashboard')
    const [projects, setProjects] = useState<Project[]>([])
    const [developers, setDevelopers] = useState<Developer[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterDeveloper, setFilterDeveloper] = useState<string>('all')
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [projectsResult, developersResult] = await Promise.all([
                projectApi.getAll(true),
                developerApi.getAll()
            ])

            if (projectsResult.error) throw projectsResult.error
            if (developersResult.error) throw developersResult.error

            setProjects(projectsResult.data || [])
            setDevelopers(developersResult.data || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const { error } = await projectApi.delete(id)

            if (error) throw error

            setSuccessMessage('Project deleted successfully!')
            setTimeout(() => setSuccessMessage(''), 3000)
            fetchData()
        } catch (error) {
            console.error('Error deleting project:', error)
        }
        setDeleteConfirm(null)
    }

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.locationText?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDeveloper = filterDeveloper === 'all' || project.developerId === filterDeveloper
        const matchesStatus = filterStatus === 'all' || project.status === filterStatus

        return matchesSearch && matchesDeveloper && matchesStatus
    })

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
                        <p className="text-gray-600 mt-4">{t('projects.loading')}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t('projects.title')}</h1>
                        <p className="text-gray-600 mt-1">{t('projects.subtitle')}</p>
                    </div>
                    <Link
                        to="/dashboard/projects/new"
                        className="px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
                    >
                        + {t('projects.addProject')}
                    </Link>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder={t('projects.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        />

                        {/* Developer Filter */}
                        <select
                            value={filterDeveloper}
                            onChange={(e) => setFilterDeveloper(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        >
                            <option value="all">{t('projects.allDevelopers')}</option>
                            {developers.map(dev => (
                                <option key={dev.id} value={dev.id}>{dev.name}</option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        >
                            <option value="all">{t('projects.allStatus')}</option>
                            <option value="Planned">{t('projects.planned')}</option>
                            <option value="Under Construction">{t('projects.underConstruction')}</option>
                            <option value="Completed">{t('projects.completed')}</option>
                            <option value="Delivered">{t('projects.delivered')}</option>
                        </select>
                    </div>
                </div>

                {/* Projects List */}
                {filteredProjects.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('projects.noProjects')}</h3>
                        <p className="text-gray-600 mb-6">{t('projects.getStarted')}</p>
                        <Link
                            to="/dashboard/projects/new"
                            className="inline-block px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
                        >
                            {t('projects.addProject')}
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('projects.projectName')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('projects.developer')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('projects.location')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('projects.status')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('projects.createdDate')}
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('projects.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">
                                                {project.developer?.name || 'Unknown Developer'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 max-w-xs truncate">
                                                {project.locationText || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                project.status === 'Under Construction' ? 'bg-blue-100 text-blue-800' :
                                                    project.status === 'Delivered' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {project.status || 'Planned'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/dashboard/projects/${project.id}/edit`}
                                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    {t('projects.edit')}
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteConfirm(project.id)}
                                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    {t('projects.delete')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('projects.confirmDelete')}</h3>
                            <p className="text-gray-600 mb-6">
                                {t('projects.deleteWarning')}
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    {t('projects.cancel')}
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                >
                                    {t('projects.delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
