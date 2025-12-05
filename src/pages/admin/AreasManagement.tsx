import { useState, useEffect } from 'react'
import { areaApi, type Area } from '@/lib/api/areas'

export default function AreasManagement() {
    const [areas, setAreas] = useState<Area[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        code: '',
        labelEn: '',
        labelAr: '',
        slug: '',
        imageUrl: '',
        isPopular: false,
        city: '',
        country: 'Egypt'
    })
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        fetchAreas()
    }, [])

    const fetchAreas = async () => {
        try {
            setLoading(true)
            const { data, error } = await areaApi.getAll()

            if (error) throw error
            if (data) setAreas(data)
        } catch (error) {
            console.error('Error fetching areas:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        if (!formData.code.trim() || !formData.labelEn.trim() || !formData.labelAr.trim() || !formData.slug.trim()) {
            alert('Code, English label, Arabic label, and slug are required')
            return
        }

        try {
            const { error } = await areaApi.create({
                code: formData.code,
                labelEn: formData.labelEn,
                labelAr: formData.labelAr,
                slug: formData.slug,
                imageUrl: formData.imageUrl || undefined,
                isPopular: formData.isPopular,
                city: formData.city || undefined,
                country: formData.country
            })

            if (error) throw error

            setSuccessMessage('Area created successfully!')
            setTimeout(() => setSuccessMessage(''), 3000)
            resetForm()
            fetchAreas()
        } catch (error: any) {
            alert(`Error: ${error.message}`)
        }
    }

    const handleUpdate = async (id: number) => {
        if (!formData.code.trim() || !formData.labelEn.trim() || !formData.labelAr.trim() || !formData.slug.trim()) {
            alert('Code, English label, Arabic label, and slug are required')
            return
        }

        try {
            const { error } = await areaApi.update(id, {
                code: formData.code,
                labelEn: formData.labelEn,
                labelAr: formData.labelAr,
                slug: formData.slug,
                imageUrl: formData.imageUrl || undefined,
                isPopular: formData.isPopular,
                city: formData.city || undefined,
                country: formData.country
            })

            if (error) throw error

            setSuccessMessage('Area updated successfully!')
            setTimeout(() => setSuccessMessage(''), 3000)
            setEditingId(null)
            resetForm()
            fetchAreas()
        } catch (error: any) {
            alert(`Error: ${error.message}`)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this area?')) return

        try {
            const { error } = await areaApi.delete(id)
            if (error) throw error

            setSuccessMessage('Area deleted successfully!')
            setTimeout(() => setSuccessMessage(''), 3000)
            fetchAreas()
        } catch (error: any) {
            alert(`Error: ${error.message}`)
        }
    }

    const startEdit = (area: Area) => {
        setEditingId(area.id)
        setFormData({
            code: area.code,
            labelEn: area.labelEn,
            labelAr: area.labelAr,
            slug: area.slug,
            imageUrl: area.imageUrl || '',
            isPopular: area.isPopular,
            city: area.city || '',
            country: area.country
        })
    }

    const resetForm = () => {
        setEditingId(null)
        setFormData({
            code: '',
            labelEn: '',
            labelAr: '',
            slug: '',
            imageUrl: '',
            isPopular: false,
            city: '',
            country: 'Egypt'
        })
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="text-gray-600 mt-4">Loading areas...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Areas Management</h1>
                <p className="text-gray-600 mt-1">Manage geographic areas and locations</p>
            </div>

            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                    {successMessage}
                </div>
            )}

            {/* Add/Edit Form */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-purple-900 mb-4">
                    {editingId ? 'Edit Area' : 'Add New Area'}
                </h3>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code (Unique) *
                        </label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="NEW_CAIRO"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            English Label *
                        </label>
                        <input
                            type="text"
                            value={formData.labelEn}
                            onChange={(e) => setFormData({ ...formData, labelEn: e.target.value })}
                            placeholder="New Cairo"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Arabic Label *
                        </label>
                        <input
                            type="text"
                            value={formData.labelAr}
                            onChange={(e) => setFormData({ ...formData, labelAr: e.target.value })}
                            placeholder="القاهرة الجديدة"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            dir="rtl"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug (URL) *
                        </label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            placeholder="new-cairo"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Cairo"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                        </label>
                        <select
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="Egypt">Egypt</option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="UAE">UAE</option>
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image URL
                        </label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isPopular}
                                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Show in Popular Areas
                            </span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-2">
                    {editingId ? (
                        <>
                            <button
                                onClick={() => handleUpdate(editingId)}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
                            >
                                Update Area
                            </button>
                            <button
                                onClick={resetForm}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleCreate}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
                        >
                            Add Area
                        </button>
                    )}
                </div>
            </div>

            {/* Areas Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">English</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arabic</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Popular</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {areas.map((area) => (
                                <tr key={area.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                                            {area.code}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {area.labelEn}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" dir="rtl">
                                        {area.labelAr}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {area.city}, {area.country}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {area.isPopular ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                No
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => startEdit(area)}
                                            className="text-purple-600 hover:text-purple-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(area.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {areas.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No areas yet. Add one using the form above.
                        </div>
                    )}
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Code should be unique and uppercase (e.g., NEW_CAIRO)</li>
                    <li>Slug should be URL-friendly (e.g., new-cairo)</li>
                    <li>Check "Popular" to show in the homepage Popular Areas section</li>
                    <li>Image URLs from Unsplash work great for area images</li>
                </ul>
            </div>
        </div>
    )
}
