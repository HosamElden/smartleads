import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { passwordResetApi } from '@/lib/api'

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address')
})

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
    const { t } = useTranslation('auth')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema)
    })

    const onSubmit = async (data: ForgotPasswordInput) => {
        setError('')
        setIsSubmitting(true)

        try {
            const result = await passwordResetApi.requestPasswordReset(data.email)

            if (result.error) {
                setError(result.error)
            } else {
                setSuccess(true)
            }
        } catch (err) {
            console.error('Forgot password error:', err)
            setError('An error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {t('forgotPassword.checkEmail')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('forgotPassword.emailSent')}
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        {t('forgotPassword.checkSpam')}
                    </p>
                    <Link
                        to="/auth/login"
                        className="inline-block px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
                    >
                        {t('forgotPassword.backToLogin')}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('forgotPassword.title')}
            </h1>
            <p className="text-gray-600 mb-8">
                {t('forgotPassword.subtitle')}
            </p>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('forgotPassword.emailLabel')}
                    </label>
                    <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        placeholder={t('forgotPassword.emailPlaceholder')}
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? t('forgotPassword.sending') : t('forgotPassword.submitButton')}
                </button>

                <div className="text-center">
                    <Link
                        to="/auth/login"
                        className="text-sm text-primary-blue font-semibold hover:underline"
                    >
                        {t('forgotPassword.backToLogin')}
                    </Link>
                </div>
            </form>
        </div>
    )
}
