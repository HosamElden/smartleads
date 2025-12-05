import { useState, useEffect } from 'react'
import { lookupApi } from '@/lib/api'
import type { OfferType, Ownership, PropertyType } from '@/lib/types'

type LookupType = 'offerTypes' | 'ownerships' | 'propertyTypes'

export default function LookupManagement() {
    const [activeTab, setActiveTab] = useState<LookupType>('offerTypes')
    const [offerTypes, setOfferTypes] = useState<OfferType[]>([])
    const [ownerships, setOwnerships] = useState<Ownership[]>([])
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState({ code: '', labelEn: '', labelAr: '' })
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        try {
            setLoading(true)
            const [offerTypesRes, ownershipsRes, propertyTypesRes] = await Promise.all([
                lookupApi.offerTypes.getAll(),
                lookupApi.ownerships.getAll(),
                lookupApi.propertyTypes.getAll()
            ])

            if (offerTypesRes.data) setOfferTypes(offerTypesRes.data)
            if (ownershipsRes.data) setOwnerships(ownershipsRes.data)
            if (propertyTypesRes.data) setPropertyTypes(propertyTypesRes.data)
        } catch (error) {
            console.error('Error fetching lookup data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getCurrentData = () => {
        switch (activeTab) {
            case 'offerTypes': return offerTypes
            case 'ownerships': return ownerships
            case 'propertyTypes': return propertyTypes
        }
    }

    const handleCreate = async () => {
        if (!formData.code.trim() || !formData.labelEn.trim() || !formData.labelAr.trim()) {
            alert('Code, English Label, and Arabic Label are required')
            return
        }

        try {
            let result
            switch (activeTab) {
                case 'offerTypes':
                    result = await lookupApi.offerTypes.create({
                        code: formData.code,
                        labelEn: formData.labelEn,
                        labelAr: formData.labelAr
                    })
                    break
                case 'ownerships':
                    result = await lookupApi.ownerships.create({
                        code: formData.code,
                        labelEn: formData.labelEn,
                        labelAr: formData.labelAr
                    })
                    break
                case 'propertyTypes':
                    result = await lookupApi.propertyTypes.create({
                        code: formData.code,
                        labelEn: formData.labelEn,
                        labelAr: formData.labelAr
                    })
                    break
            }

            if (result.error) throw result.error

            setSuccessMessage('Item created successfully!')
            setTimeout(() => setSuccessMessage(''), 3000)
            setFormData({ code: '', labelEn: '', labelAr: '' })
            fetchAllData()
        } catch (error: any) {
            alert(`Error: ${error.message}`)
        }
    }

    const handleUpdate = async (id: number) => {
        if (!formData.code.trim() || !formData.labelEn.trim() || !formData.labelAr.trim()) {
            alert('Code, English Label, and Arabic Label are required')
            return
        }

        try {
            let result
            switch (activeTab) {
                case 'offerTypes':
                    result = await lookupApi.offerTypes.update(id, {
                        code: formData.code,
                        labelEn: formData.labelEn,
                        labelAr: formData.labelAr
                    })
                    break
                case 'ownerships':
                    result = await lookupApi.ownerships.update(id, {
                        code: formData.code,
                        labelEn: formData.labelEn,
                        labelAr: formData.labelAr
                    })
                    break
                case 'propertyTypes':
                    result = await lookupApi.propertyTypes.update(id, {
                        code: formData.code,
                        labelEn: formData.labelEn,
                        labelAr: formData.labelAr
                    })
                    break
            }

            if (result.error) throw result.error

            setSuccessMessage('Item updated successfully!')
            setTimeout(() => setSuccessMessage(''), 3000)
            setEditingId(null)
            setFormData({ code: '', labelEn: '', labelAr: '' })
            fetchAllData()
        } catch (error: any) {
            alert(`Error: ${error.message}`)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this item?')) return

        try {
            let result
            switch (activeTab) {
                case 'offerTypes':
                    result = await lookupApi.offerTypes.delete(id)
                    break
                case 'ownerships':
                    result = await lookupApi.ownerships.delete(id)
                    break
                case 'propertyTypes':
                    result = await lookupApi.propertyTypes.delete(id)
                    break
            }

            if (result.error) throw result.error

            setSuccessMessage('Item deleted successfully!')
            setTimeout(() => setSuccessMessage(''), 3000)
            fetchAllData()
        } catch (error: any) {
            alert(`Error: ${error.message}`)
        }
    }

    const startEdit = (item: any) => {
        setEditingId(item.id)
        setFormData({
            code: item.code,
            labelEn: item.labelEn,
            labelAr: item.labelAr
        })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setFormData({ code: '', labelEn: '', labelAr: '' })
    }

    const getTabLabel = (tab: LookupType) => {
        switch (tab) {
            case 'offerTypes': return 'Offer Types'
            case 'ownerships': return 'Ownerships'
            case 'propertyTypes': return 'Property Types'
        }
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="text-gray-600 mt-4">Loading lookup tables...</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Lookup Table Management</h1>
                <p className="text-gray-600 mt-1">Manage system-wide lookup data</p>
            </div>

            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                    {successMessage}
                </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-t-xl shadow-sm border-b">
                <div className="flex space-x-1 p-2">
                    {(['offerTypes', 'ownerships', 'propertyTypes'] as LookupType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab)
                                cancelEdit()
                            }}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === tab
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {getTabLabel(tab)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-b-xl shadow-sm p-6">
                <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-4">
                        {editingId ? 'Edit Item' : 'Add New Item'}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Code (Unique) *
                            </label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="e.g., SALE, RENT"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                placeholder="e.g., Sale, Rent"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                placeholder="بيع، إيجار"
                                dir="rtl"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        {editingId ? (
                            <>
                                <button
                                    onClick={() => handleUpdate(editingId)}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={cancelEdit}
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
                                Add Item
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Code
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    English
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Arabic
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {getCurrentData().map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                                            {item.code}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.labelEn}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" dir="rtl">
                                        {item.labelAr}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => startEdit(item)}
                                            className="text-purple-600 hover:text-purple-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {getCurrentData().length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No items yet. Add one using the form above.
                        </div>
                    )}
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Codes should be unique and uppercase (e.g., SALE, RENT)</li>
                    <li>Labels are user-facing and can be any format</li>
                    <li>Deleting items may affect existing properties using them</li>
                </ul>
            </div>
        </div>
    )
}
