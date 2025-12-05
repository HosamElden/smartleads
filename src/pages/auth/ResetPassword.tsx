import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { passwordResetApi } from '@/lib/api'

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
})

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export default function ResetPassword() {
    const { t } = useTranslation('auth')
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [isValidating, setIsValidating] = useState(true)
    const [isValid, setIsValid] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema)
    })

    // Validate token on mount
    useEffect(() => {
        async function validateToken() {
            if (!token) {
                setError('Invalid or missing reset token')
                setIsValid(false)
                setIsValidating(false)
                return
            }

            const result = await passwordResetApi.validateResetToken(token)

            if (result.error) {
                setError(result.error)
                setIsValid(false)
            } else {
                setIsValid(true)
            }

            setIsValidating(false)
        }

        validateToken()
    }, [token])

    const onSubmit = async (data: ResetPasswordInput) => {
        if (!token) return

        setError('')
        setIsSubmitting(true)

        try {
            const result = await passwordResetApi.resetPassword(token, data.password)

            if (result.error) {
                setError(result.error)
            } else {
                // Success! Redirect to login with success message
                navigate('/auth/login?passwordReset=success', { replace: true })
            }
        } catch (err) {
            console.error('Reset password error:', err)
            setError('An error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isValidating) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
                <p className="text-gray-600">{t('resetPassword.validating')}</p>
            </div>
        )
    }

    if (!isValid) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {t('resetPassword.invalidToken')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error || t('resetPassword.tokenError')}
                    </p>
                    <Link
                        to="/auth/forgot-password"
                        className="inline-block px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200 mr-2"
                    >
                        {t('resetPassword.requestNew')}
                    </Link>
                    <Link
                        to="/auth/login"
                        className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                        {t('resetPassword.backToLogin')}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('resetPassword.title')}
            </h1>
            <p className="text-gray-600 mb-8">
                {t('resetPassword.subtitle')}
            </p>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('resetPassword.newPassword')}
                    </label>
                    <input
                        {...register('password')}
                        type="password"
                        id="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        placeholder={t('resetPassword.passwordPlaceholder')}
                    />
                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('resetPassword.confirmPassword')}
                    </label>
                    <input
                        {...register('confirmPassword')}
                        type="password"
                        id="confirmPassword"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        placeholder={t('resetPassword.confirmPlaceholder')}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? t('resetPassword.resetting') : t('resetPassword.submitButton')}
                </button>
            </form>
        </div>
    )
}
