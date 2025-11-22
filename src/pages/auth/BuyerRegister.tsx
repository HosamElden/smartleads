import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { buyerRegistrationSchema, type BuyerRegistrationInput } from '@/lib/validations/auth'
import { calculateLeadScore } from '@/lib/scoring/calculateScore'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/context/AuthContext'


const locationOptions = [
  'New Cairo',
  'NAC',
  '6th October',
  'Sheikh Zayed',
  'North Coast',
  'Madinaty',
  'Rehab',
  'Downtown',
  'Zamalek',
  'Heliopolis'
]

const propertyTypeOptions = [
  'Apartment',
  'Villa',
  'Townhouse',
  'Duplex',
  'Commercial'
]

export default function BuyerRegister() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<BuyerRegistrationInput>({
    resolver: zodResolver(buyerRegistrationSchema)
  })

  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])
  const [validationError, setValidationError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    )
  }

  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const onSubmit = async (data: BuyerRegistrationInput) => {
    console.log('Form submitted with data:', data)
    setValidationError('')
    setIsSubmitting(true)

    try {
      if (selectedLocations.length === 0) {
        setValidationError(t('buyerRegister.selectLocation'))
        setIsSubmitting(false)
        return
      }

      if (selectedPropertyTypes.length === 0) {
        setValidationError(t('buyerRegister.selectPropertyType'))
        setIsSubmitting(false)
        return
      }

      const buyerData = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        budget: data.budget,
        locations: selectedLocations,
        propertyTypes: selectedPropertyTypes,
        buyingIntent: data.buyingIntent
      }

      console.log('Buyer data prepared:', buyerData)

      const { score, tier } = calculateLeadScore(buyerData)
      console.log('Calculated score:', { score, tier })

      const { data: existingEmail } = await supabase
        .from('buyers')
        .select('id')
        .eq('email', buyerData.email)
        .maybeSingle()

      if (existingEmail) {
        setValidationError(t('buyerRegister.emailExists'))
        setIsSubmitting(false)
        return
      }

      const { data: existingPhone } = await supabase
        .from('buyers')
        .select('id')
        .eq('phone', buyerData.phone)
        .maybeSingle()

      if (existingPhone) {
        setValidationError(t('buyerRegister.phoneExists'))
        setIsSubmitting(false)
        return
      }

      console.log('Inserting buyer into database...')

      const { data: newBuyer, error } = await supabase
        .from('buyers')
        .insert([{
          full_name: buyerData.fullName,
          email: buyerData.email,
          phone: buyerData.phone,
          password: buyerData.password,
          budget: buyerData.budget,
          locations: buyerData.locations,
          property_types: buyerData.propertyTypes,
          buying_intent: buyerData.buyingIntent || null,
          score: score,
          score_tier: tier
        }])
        .select()
        .single()

      console.log('Insert result:', { newBuyer, error })

      if (error) {
        console.error('Database error:', error)
        setValidationError(t('buyerRegister.error', { message: error.message }))
        setIsSubmitting(false)
        return
      }

      console.log('Login user and navigate...')

      login({
        id: newBuyer.id,
        userType: 'buyer',
        fullName: newBuyer.full_name,
        email: newBuyer.email,
        phone: newBuyer.phone,
        password: newBuyer.password,
        budget: newBuyer.budget,
        locations: newBuyer.locations,
        propertyTypes: newBuyer.property_types,
        buyingIntent: newBuyer.buying_intent || undefined,
        score: newBuyer.score,
        scoreTier: newBuyer.score_tier as 'Hot' | 'Warm' | 'Cold',
        createdAt: new Date(newBuyer.created_at)
      })

      navigate('/properties')
    } catch (err) {
      console.error('Caught error:', err)
      setValidationError(t('buyerRegister.unknownError', { message: err instanceof Error ? err.message : t('buyerRegister.unknown') }))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('buyerRegister.title')}</h1>
      <p className="text-gray-600 mb-8">{t('buyerRegister.subtitle')}</p>

      {validationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log('Form validation errors:', errors)
        setValidationError(t('buyerRegister.fillAllFields'))
      })} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('buyerRegister.fullName')}
          </label>
          <input
            {...register('fullName')}
            type="text"
            id="fullName"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder={t('buyerRegister.fullNamePlaceholder')}
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('buyerRegister.email')}
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('buyerRegister.phone')}
          </label>
          <input
            {...register('phone')}
            type="text"
            id="phone"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="01xxxxxxxxx"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('buyerRegister.password')}
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder={t('buyerRegister.passwordPlaceholder')}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('buyerRegister.budget')}
          </label>
          <input
            {...register('budget', { valueAsNumber: true })}
            type="number"
            id="budget"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder={t('buyerRegister.budgetPlaceholder')}
          />
          {errors.budget && (
            <p className="text-red-600 text-sm mt-1">{errors.budget.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t('buyerRegister.preferredLocations')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {locationOptions.map(location => (
              <label
                key={location}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(location)}
                  onChange={() => toggleLocation(location)}
                  className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                />
                <span className="text-sm text-gray-700">{location}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t('buyerRegister.propertyTypes')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypeOptions.map(type => (
              <label
                key={type}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedPropertyTypes.includes(type)}
                  onChange={() => togglePropertyType(type)}
                  className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t('buyerRegister.buyingIntent')}
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('buyingIntent')}
                type="radio"
                value="Cash"
                className="w-4 h-4 text-primary-blue border-gray-300 focus:ring-primary-blue"
              />
              <span className="text-sm text-gray-700">{t('buyerRegister.cash')}</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('buyingIntent')}
                type="radio"
                value="Installment"
                className="w-4 h-4 text-primary-blue border-gray-300 focus:ring-primary-blue"
              />
              <span className="text-sm text-gray-700">{t('buyerRegister.installment')}</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('buyingIntent')}
                type="radio"
                value="Mortgage"
                className="w-4 h-4 text-primary-blue border-gray-300 focus:ring-primary-blue"
              />
              <span className="text-sm text-gray-700">{t('buyerRegister.mortgage')}</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('buyingIntent')}
                type="radio"
                value=""
                className="w-4 h-4 text-primary-blue border-gray-300 focus:ring-primary-blue"
              />
              <span className="text-sm text-gray-700">{t('buyerRegister.notSure')}</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('buyerRegister.creating') : t('buyerRegister.createButton')}
        </button>

        <p className="text-center text-sm text-gray-600">
          {t('buyerRegister.haveAccount')}{' '}
          <a href="/login" className="text-primary-blue font-semibold hover:underline">
            {t('buyerRegister.loginHere')}
          </a>
        </p>
      </form>
    </div>
  )
}
