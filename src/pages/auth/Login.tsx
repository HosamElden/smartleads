import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/context/AuthContext'
import { userApi, buyerApi, marketerApi } from '@/lib/api'

export default function Login() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  })

  const [validationError, setValidationError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: LoginInput) => {
    console.log('Login form submitted:', data)
    setValidationError('')
    setIsSubmitting(true)

    try {
      const isEmail = data.emailOrPhone.includes('@')

      // ========================================
      // NEW FLOW: Check users table first
      // ========================================
      if (isEmail) {
        const { data: user, error: userError } = await userApi.getUserByEmail(data.emailOrPhone)

        if (user) {
          console.log('User found in users table, verifying password...')

          // Verify password using bcrypt
          const isPasswordValid = await userApi.verifyPassword(data.password, user.password)

          if (!isPasswordValid) {
            setValidationError(t('login.invalidCredentials'))
            setIsSubmitting(false)
            return
          }

          // Password is correct, check if profile is complete
          if (user.userType === 'buyer') {
            const { data: buyer } = await buyerApi.getBuyerByUserId(user.id)

            if (!buyer) {
              // Profile not complete, redirect to complete it
              console.log('Buyer profile not complete, redirecting...')
              sessionStorage.setItem('registrationUser', JSON.stringify({
                id: user.id,
                email: user.email,
                userType: user.userType
              }))
              navigate('/complete-profile')
              return
            }

            // Profile complete, login
            console.log('Buyer profile complete, logging in...')
            await userApi.updateLastLogin(user.id)
            login({
              ...buyer,
              userType: 'buyer'
            })
            navigate('/properties')
            return

          } else if (user.userType === 'marketer') {
            const { data: marketer } = await marketerApi.getMarketerByUserId(user.id)

            if (!marketer) {
              // Profile not complete
              console.log('Marketer profile not complete, redirecting...')
              sessionStorage.setItem('registrationUser', JSON.stringify({
                id: user.id,
                email: user.email,
                userType: user.userType
              }))
              navigate('/complete-profile')
              return
            }

            // Profile complete, login
            console.log('Marketer profile complete, logging in...')
            await userApi.updateLastLogin(user.id)
            login({
              ...marketer,
              userType: 'marketer'
            })
            navigate('/dashboard/listings')
            return
          }
        }
      }

      // ========================================
      // OLD FLOW: Fallback for existing users
      // (Backwards compatibility)
      // ========================================
      console.log('User not found in users table, trying old flow...')

      const { data: buyer } = await supabase
        .from('buyers')
        .select('*')
        .eq(isEmail ? 'email' : 'phone', data.emailOrPhone)
        .eq('password', data.password)
        .maybeSingle()

      if (buyer) {
        console.log('Buyer found (old flow), logging in...')
        login({
          id: buyer.id,
          userType: 'buyer',
          fullName: buyer.full_name,
          email: buyer.email,
          phone: buyer.phone,
          password: buyer.password,
          budget: buyer.budget,
          locations: buyer.locations,
          propertyTypes: buyer.property_types,
          buyingIntent: buyer.buying_intent || undefined,
          score: buyer.score,
          scoreTier: buyer.score_tier as 'Hot' | 'Warm' | 'Cold',
          createdAt: new Date(buyer.created_at)
        })
        navigate('/properties')
        return
      }

      const { data: marketer } = await supabase
        .from('marketers')
        .select('*')
        .eq(isEmail ? 'email' : 'phone', data.emailOrPhone)
        .eq('password', data.password)
        .maybeSingle()

      if (marketer) {
        console.log('Marketer found (old flow), logging in...')
        login({
          id: marketer.id,
          userType: 'marketer',
          fullName: marketer.full_name,
          companyName: marketer.company_name || undefined,
          email: marketer.email,
          phone: marketer.phone,
          password: marketer.password,
          role: marketer.role as 'Marketer' | 'Developer',
          officeLocation: marketer.office_location,
          createdAt: new Date(marketer.created_at)
        })
        navigate('/dashboard/listings')
        return
      }

      // No user found in either flow
      setValidationError(t('login.invalidCredentials'))
      setIsSubmitting(false)
    } catch (err) {
      console.error('Login error:', err)
      setValidationError(t('login.error', { message: err instanceof Error ? err.message : t('login.unknownError') }))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('login.title')}</h1>
      <p className="text-gray-600 mb-8">{t('login.subtitle')}</p>

      {validationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log('Form validation errors:', errors)
        setValidationError(t('login.fillAllFields'))
      })} className="space-y-6">
        <div>
          <label htmlFor="emailOrPhone" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('login.emailOrPhone')}
          </label>
          <input
            {...register('emailOrPhone')}
            type="text"
            id="emailOrPhone"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder={t('login.emailPlaceholder')}
          />
          {errors.emailOrPhone && (
            <p className="text-red-600 text-sm mt-1">{errors.emailOrPhone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('login.password')}
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder={t('login.passwordPlaceholder')}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('login.loggingIn') : t('login.loginButton')}
        </button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            {t('login.noAccount')}{' '}
            <a href="/auth/register/buyer" className="text-primary-blue font-semibold hover:underline">
              {t('login.registerBuyer')}
            </a>
            {' '}{t('login.or')}{' '}
            <a href="/auth/register/marketer" className="text-primary-blue font-semibold hover:underline">
              {t('login.registerMarketer')}
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}
