import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/context/AuthContext'
import { useInterest } from '@/lib/context/InterestContext'
import { Property, Buyer } from '@/lib/types'
import { getMatchingDetails } from '@/lib/matching/matchingEngine'
import { supabase } from '@/lib/supabase'

interface InterestButtonProps {
  property: Property
}

export default function InterestButton({ property }: InterestButtonProps) {
  const { t } = useTranslation('properties')
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addInterest, isInterested } = useInterest()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningReasons, setWarningReasons] = useState<string[]>([])

  const alreadyInterested = isInterested(property.id)

  const handleInterestClick = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (user.userType !== 'buyer') {
      setMessage({
        type: 'error',
        text: t('interestButton.onlyBuyers')
      })
      setTimeout(() => setMessage(null), 5000)
      return
    }

    if (alreadyInterested) {
      setMessage({
        type: 'error',
        text: t('interestButton.alreadyExpressed')
      })
      setTimeout(() => setMessage(null), 5000)
      return
    }

    setIsProcessing(true)

    const buyer = user as Buyer
    const matchResult = getMatchingDetails(buyer, property)

    console.log('Matching result:', matchResult)

    if (!matchResult.matches) {
      const reasons = matchResult.reasons.map(reason =>
        t(`interestButton.mismatchReasons.${reason}`, reason)
      )
      setWarningReasons(reasons)
      setShowWarningModal(true)
      setIsProcessing(false)
      return
    }

    await processInterest(buyer)
  }

  const handleProceedAnyway = async () => {
    setShowWarningModal(false)
    setIsProcessing(true)
    const buyer = user as Buyer
    await processInterest(buyer)
  }

  const handleCancelWarning = () => {
    setShowWarningModal(false)
    setWarningReasons([])
  }

  const processInterest = async (buyer: Buyer) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          buyer_id: buyer.id,
          marketer_id: property.marketerId,
          property_id: property.id,
          buyer_score: buyer.score,
          buyer_score_tier: buyer.scoreTier,
          buyer_name: buyer.fullName,
          buyer_phone: buyer.phone,
          buyer_email: buyer.email,
          buyer_budget: buyer.budget,
          buyer_locations: buyer.locations,
          buyer_property_types: buyer.propertyTypes,
          status: 'New'
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating lead:', error)
        setMessage({
          type: 'error',
          text: t('interestButton.error')
        })
        setIsProcessing(false)
        setTimeout(() => setMessage(null), 5000)
        return
      }

      addInterest(property.id)

      setMessage({
        type: 'success',
        text: t('interestButton.success')
      })
      setIsProcessing(false)
      setTimeout(() => setMessage(null), 5000)
    } catch (error) {
      console.error('Error creating lead:', error)
      setMessage({
        type: 'error',
        text: t('interestButton.error')
      })
      setIsProcessing(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  return (
    <div>
      <button
        onClick={handleInterestClick}
        disabled={isProcessing || alreadyInterested}
        className={`w-full md:w-auto px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${alreadyInterested
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-primary-blue text-white hover:scale-105'
          } ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
      >
        {isProcessing
          ? t('interestButton.processing')
          : alreadyInterested
            ? t('interestButton.alreadyInterested')
            : t('interestButton.interested')}
      </button>

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg ${message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('interestButton.mismatchTitle')}
            </h3>

            <p className="text-gray-700 mb-4">
              {t('interestButton.validationWarning')}
            </p>

            <ul className="space-y-2 mb-6">
              {warningReasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            <p className="text-gray-700 font-medium mb-6">
              {t('interestButton.continueQuestion')}
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelWarning}
                className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all hover:scale-105"
              >
                {t('interestButton.cancel')}
              </button>
              <button
                onClick={handleProceedAnyway}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all hover:scale-105"
              >
                {t('interestButton.proceed')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
