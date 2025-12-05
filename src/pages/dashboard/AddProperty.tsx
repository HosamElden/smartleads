import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/context/AuthContext'
import { supabase } from '@/lib/supabase'
import PropertyForm from '@/components/PropertyForm'

export default function AddProperty() {
  const { t } = useTranslation('dashboard')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const imageUrls = data.images.split('\n').map((url: string) => url.trim()).filter((url: string) => url)

      const propertyData = {
        marketer_id: user?.id,
        title: data.title,
        type: data.type,
        location: data.location,
        project_name: data.projectName || null,
        price: data.price,
        area: data.area,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        delivery_date: data.deliveryDate,
        payment_plan: data.paymentPlan,
        images: imageUrls,
        description: data.description,
        status: data.status,
        // NEW FIELDS
        project_id: data.projectId || null,
        offer_type_id: data.offerTypeId || null,
        provider_name: data.providerName || null,
        furnished: data.furnished || false,
        ownership_id: data.ownershipId || null,
        location_label: data.locationLabel || null,
        location_map_url: data.locationMapUrl || null,
        detailed_description: data.detailedDescription || null
      }

      const { data: newProperty, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single()

      if (error) {
        throw error
      }

      // Save amenities if provided
      if (data.amenities && newProperty) {
        const amenitiesList = data.amenities
          .split(',')
          .map((a: string) => a.trim())
          .filter((a: string) => a)

        if (amenitiesList.length > 0) {
          const amenitiesData = amenitiesList.map((label: string) => ({
            property_id: newProperty.id,
            label
          }))

          const { error: amenitiesError } = await supabase
            .from('property_amenities')
            .insert(amenitiesData)

          if (amenitiesError) {
            console.error('Error adding amenities:', amenitiesError)
            // Don't fail the whole operation if amenities fail
          }
        }
      }

      console.log('Property added to database:', newProperty)
      setSuccessMessage(t('addProperty.success'))

      setTimeout(() => {
        navigate('/dashboard/listings')
      }, 1500)
    } catch (error: any) {
      console.error('Error adding property:', error)
      setErrorMessage(error.message || t('addProperty.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('addProperty.title')}</h1>
        <p className="text-gray-600 mt-1">{t('addProperty.subtitle')}</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-8">
        <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
