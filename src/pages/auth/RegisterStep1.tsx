import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { userApi } from '@/lib/api'

interface RegisterStep1Props {
    userType: 'buyer' | 'marketer'
}

export default function RegisterStep1({ userType }: RegisterStep1Props) {
    const navigate = useNavigate()
    const { t } = useTranslation('auth')
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })
    console.log('RegisterStep1 rendered', formData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (!formData.email || !formData.password) {
            setError(t('registerStep1.emailRequired'))
            return
        }

        if (formData.password.length < 6) {
            setError(t('registerStep1.passwordLength'))
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError(t('registerStep1.passwordMatch'))
            return
        }

        try {
            setLoading(true)

            // Check if email already exists
            const emailExists = await userApi.emailExists(formData.email)
            if (emailExists) {
                setError(t('registerStep1.emailTaken'))
                setLoading(false)
                return
            }

            // Create user account
            const { data: user, error: createError } = await userApi.createUser({
                email: formData.email,
                password: formData.password,
                userType: userType
            })

            if (createError || !user) {
                throw createError || new Error(t('registerStep1.genericError'))
            }

            // Store user data temporarily for Step 2
            sessionStorage.setItem('registrationUser', JSON.stringify({
                id: user.id,
                email: user.email,
                userType: user.userType
            }))

            // Navigate to Step 2: Complete Profile
            navigate('/complete-profile', {
                state: { userId: user.id, userType: user.userType }
            })
        } catch (err: any) {
            console.error('Registration error:', err)
            setError(err.message || t('registerStep1.genericError'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-center text-gray-900">
                        {userType === 'buyer' ? t('registerBuyer') : t('registerMarketer')}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {t('registerStep1.step1Title')}
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center space-x-2">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-blue text-white rounded-full flex items-center justify-center font-semibold">
                            1
                        </div>
                        <span className="ml-2 text-sm font-medium text-primary-blue">{t('registerStep1.progressAccount')}</span>
                    </div>
                    <div className="w-12 h-1 bg-gray-300"></div>
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                            2
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-500">{t('registerStep1.progressProfile')}</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('registerStep1.emailLabel')}
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
                            placeholder="your@email.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('registerStep1.passwordLabel')}
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
                            placeholder={t('registerStep1.passwordPlaceholder')}
                            minLength={6}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('registerStep1.confirmPasswordLabel')}
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
                            placeholder={t('registerStep1.confirmPasswordPlaceholder')}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-primary-blue hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? t('registerStep1.creatingAccount') : t('registerStep1.submitButton')}
                    </button>
                </form>

                {/* Login Link */}
                <div className="text-center text-sm text-gray-600">
                    {t('registerStep1.alreadyHaveAccount')}{' '}
                    <a href="/login" className="text-primary-blue hover:text-blue-700 font-semibold">
                        {t('registerStep1.loginLink')}
                    </a>
                </div>
            </div>
        </div>
    )
}
