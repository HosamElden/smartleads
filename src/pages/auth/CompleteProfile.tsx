import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { buyerApi, marketerApi, areaApi, type Area } from '@/lib/api'
import { useAuth } from '@/lib/context/AuthContext'

export default function CompleteProfile() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()
    const { t } = useTranslation(['auth', 'common'])

    const [userId, setUserId] = useState<string>('')
    const [userType, setUserType] = useState<'buyer' | 'marketer'>('buyer')

    useEffect(() => {
        // Get user data from navigation state or sessionStorage
        const stateData = location.state as any
        const sessionData = sessionStorage.getItem('registrationUser')

        if (stateData?.userId && stateData?.userType) {
            setUserId(stateData.userId)
            setUserType(stateData.userType)
        } else if (sessionData) {
            const userData = JSON.parse(sessionData)
            setUserId(userData.id)
            setUserType(userData.userType)
        } else {
            // No user data, redirect to registration
            navigate('/register/buyer')
        }
    }, [location, navigate])

    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
            {userType === 'buyer' ? (
                <BuyerProfileForm userId={userId} onComplete={() => {
                    sessionStorage.removeItem('registrationUser')
                    navigate('/my-interests')
                }} />
            ) : (
                <MarketerProfileForm userId={userId} onComplete={() => {
                    sessionStorage.removeItem('registrationUser')
                    navigate('/dashboard')
                }} />
            )}
        </div>
    )
}

// ===================================
// BUYER PROFILE FORM
// ===================================

function BuyerProfileForm({ userId, onComplete }: { userId: string; onComplete: () => void }) {
    const { t } = useTranslation(['auth', 'common'])
    const { login } = useAuth()
    const [areas, setAreas] = useState<Area[]>([])
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        budget: '',
        locations: [] as string[],
        propertyTypes: [] as string[],
        buyingIntent: 'Cash' as 'Cash' | 'Installment' | 'Mortgage'
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchAreas()
    }, [])

    const fetchAreas = async () => {
        const { data } = await areaApi.getAll()
        if (data) setAreas(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.fullName || !formData.phone || !formData.budget) {
            setError(t('completeProfile.buyer.errorRequired'))
            return
        }

        if (formData.locations.length === 0) {
            setError(t('completeProfile.buyer.errorLocation'))
            return
        }

        if (formData.propertyTypes.length === 0) {
            setError(t('completeProfile.buyer.errorPropertyType'))
            return
        }

        try {
            setLoading(true)

            const { data: buyer, error: createError } = await buyerApi.createBuyerProfile({
                userId,
                fullName: formData.fullName,
                phone: formData.phone,
                budget: Number(formData.budget),
                locations: formData.locations,
                propertyTypes: formData.propertyTypes,
                buyingIntent: formData.buyingIntent
            })

            if (createError || !buyer) throw createError || new Error('Failed to create profile')

            // Auto-login the user
            login({
                ...buyer,
                userType: 'buyer'
            })

            onComplete()
        } catch (err: any) {
            console.error('Profile creation error:', err)
            setError(err.message || t('completeProfile.buyer.genericError'))
        } finally {
            setLoading(false)
        }
    }

    const toggleLocation = (location: string) => {
        setFormData(prev => ({
            ...prev,
            locations: prev.locations.includes(location)
                ? prev.locations.filter(l => l !== location)
                : [...prev.locations, location]
        }))
    }

    const togglePropertyType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            propertyTypes: prev.propertyTypes.includes(type)
                ? prev.propertyTypes.filter(t => t !== type)
                : [...prev.propertyTypes, type]
        }))
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{t('completeProfile.buyer.title')}</h2>
                <p className="text-sm text-gray-600 mt-2">{t('completeProfile.buyer.subtitle')}</p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-center space-x-2 mb-8">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                        ✓
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-500">{t('completeProfile.buyer.progressAccount')}</span>
                </div>
                <div className="w-12 h-1 bg-green-500"></div>
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-blue text-white rounded-full flex items-center justify-center font-semibold">
                        2
                    </div>
                    <span className="ml-2 text-sm font-medium text-primary-blue">{t('completeProfile.buyer.progressProfile')}</span>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('completeProfile.buyer.fullName')}
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue"
                        placeholder={t('completeProfile.buyer.fullNamePlaceholder')}
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('completeProfile.buyer.phone')}
                    </label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue"
                        placeholder={t('completeProfile.buyer.phonePlaceholder')}
                    />
                </div>

                {/* Budget */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('completeProfile.buyer.budget')}
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue"
                        placeholder={t('completeProfile.buyer.budgetPlaceholder')}
                    />
                </div>

                {/* Preferred Locations */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('completeProfile.buyer.preferredLocations')}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {areas.slice(0, 12).map((area) => (
                            <button
                                key={area.id}
                                type="button"
                                onClick={() => toggleLocation(area.labelEn)}
                                className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${formData.locations.includes(area.labelEn)
                                    ? 'border-primary-blue bg-blue-50 text-primary-blue font-semibold'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                {area.labelEn}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Property Types */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('completeProfile.buyer.propertyTypes')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {['apartment', 'villa', 'townhouse', 'duplex'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => togglePropertyType(type)}
                                className={`px-4 py-3 rounded-lg border-2 transition-all ${formData.propertyTypes.includes(type)
                                    ? 'border-primary-blue bg-blue-50 text-primary-blue font-semibold'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                {t(`common:propertyTypes.${type}`)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Buying Intent */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('completeProfile.buyer.buyingIntent')}
                    </label>
                    <select
                        value={formData.buyingIntent}
                        onChange={(e) => setFormData({ ...formData, buyingIntent: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue"
                    >
                        <option value="Cash">{t('completeProfile.buyer.cash')}</option>
                        <option value="Installment">{t('completeProfile.buyer.installment')}</option>
                        <option value="Mortgage">{t('completeProfile.buyer.mortgage')}</option>
                    </select>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-primary-blue hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {loading ? t('completeProfile.buyer.creating') : t('completeProfile.buyer.complete')}
                </button>
            </form>
        </div>
    )
}

// ===================================
// MARKETER PROFILE FORM
// ===================================

function MarketerProfileForm({ userId, onComplete }: { userId: string; onComplete: () => void }) {
    const { t } = useTranslation(['auth', 'common'])
    const { login } = useAuth()
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        phone: '',
        officeLocation: '',
        role: 'Marketer' as 'Marketer' | 'Developer'
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.fullName || !formData.phone || !formData.officeLocation) {
            setError(t('completeProfile.marketer.errorRequired'))
            return
        }

        try {
            setLoading(true)

            const { data: marketer, error: createError } = await marketerApi.createMarketerProfile({
                userId,
                fullName: formData.fullName,
                companyName: formData.companyName || undefined,
                phone: formData.phone,
                officeLocation: formData.officeLocation,
                role: formData.role
            })

            if (createError || !marketer) throw createError || new Error('Failed to create profile')

            // Auto-login the user
            login({
                ...marketer,
                userType: 'marketer'
            })

            onComplete()
        } catch (err: any) {
            console.error('Profile creation error:', err)
            setError(err.message || t('completeProfile.marketer.genericError'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{t('completeProfile.marketer.title')}</h2>
                <p className="text-sm text-gray-600 mt-2">{t('completeProfile.marketer.subtitle')}</p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-center space-x-2 mb-8">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                        ✓
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-500">{t('completeProfile.marketer.progressAccount')}</span>
                </div>
                <div className="w-12 h-1 bg-green-500"></div>
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-green text-white rounded-full flex items-center justify-center font-semibold">
                        2
                    </div>
                    <span className="ml-2 text-sm font-medium text-primary-green">{t('completeProfile.marketer.progressProfile')}</span>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('completeProfile.marketer.fullName')}
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green"
                        placeholder={t('completeProfile.marketer.fullNamePlaceholder')}
                    />
                </div>

                {/* Company Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('completeProfile.marketer.companyName')}
                    </label>
                    <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green"
                        placeholder={t('completeProfile.marketer.companyNamePlaceholder')}
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('completeProfile.marketer.phone')}
                    </label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green"
                        placeholder={t('completeProfile.marketer.phonePlaceholder')}
                    />
                </div>

                {/* Office Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('completeProfile.marketer.officeLocation')}
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.officeLocation}
                        onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green"
                        placeholder={t('completeProfile.marketer.officeLocationPlaceholder')}
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('completeProfile.marketer.role')}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'Marketer' })}
                            className={`px-6 py-4 rounded-lg border-2 transition-all ${formData.role === 'Marketer'
                                ? 'border-primary-green bg-green-50 text-primary-green font-semibold'
                                : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            {t('completeProfile.marketer.marketer')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'Developer' })}
                            className={`px-6 py-4 rounded-lg border-2 transition-all ${formData.role === 'Developer'
                                ? 'border-primary-green bg-green-50 text-primary-green font-semibold'
                                : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            {t('completeProfile.marketer.developer')}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-primary-green hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {loading ? t('completeProfile.marketer.creating') : t('completeProfile.marketer.complete')}
                </button>
            </form>
        </div>
    )
}
