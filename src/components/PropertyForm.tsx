import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Property } from '@/lib/types'

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  type: z.enum(['Apartment', 'Villa', 'Townhouse', 'Duplex', 'Commercial']),
  location: z.string().min(1, 'Location is required'),
  projectName: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  area: z.number().positive('Area must be positive'),
  bedrooms: z.number().min(0, 'Bedrooms must be 0 or more'),
  bathrooms: z.number().min(1, 'At least 1 bathroom required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  paymentPlan: z.string().min(10, 'Payment plan must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  status: z.enum(['Available', 'Sold Out', 'Reserved']),
  images: z.string().min(1, 'At least one image URL is required')
})

type PropertyFormData = z.infer<typeof propertySchema>

interface PropertyFormProps {
  property?: Property
  onSubmit: (data: PropertyFormData) => void
  isSubmitting?: boolean
}

export default function PropertyForm({ property, onSubmit, isSubmitting }: PropertyFormProps) {
  const { t } = useTranslation(['dashboard', 'common'])
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property ? {
      title: property.title,
      type: property.type,
      location: property.location,
      projectName: property.projectName,
      price: property.price,
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      deliveryDate: new Date(property.deliveryDate).toISOString().split('T')[0],
      paymentPlan: property.paymentPlan,
      description: property.description,
      status: property.status,
      images: property.images.join('\n')
    } : undefined
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t('dashboard:addProperty.propertyTitle')}
        </label>
        <input
          {...register('title')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          placeholder={t('dashboard:addProperty.propertyTitle')}
        />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('dashboard:addProperty.propertyType')}
          </label>
          <select
            {...register('type')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          >
            <option value="">{t('common:select')}</option>
            <option value="Apartment">{t('common:propertyTypes.apartment')}</option>
            <option value="Villa">{t('common:propertyTypes.villa')}</option>
            <option value="Townhouse">{t('common:propertyTypes.townhouse')}</option>
            <option value="Duplex">{t('common:propertyTypes.duplex')}</option>
            <option value="Commercial">{t('common:propertyTypes.commercial')}</option>
          </select>
          {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('dashboard:addProperty.location')}
          </label>
          <input
            {...register('location')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="e.g., New Cairo"
          />
          {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t('dashboard:addProperty.projectName')}
        </label>
        <input
          {...register('projectName')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          placeholder="e.g., Palm Hills"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('dashboard:addProperty.price')}
          </label>
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="2500000"
          />
          {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('dashboard:addProperty.area')}
          </label>
          <input
            type="number"
            {...register('area', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="180"
          />
          {errors.area && <p className="text-red-600 text-sm mt-1">{errors.area.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('dashboard:addProperty.bedrooms')}
          </label>
          <input
            type="number"
            {...register('bedrooms', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="3"
          />
          {errors.bedrooms && <p className="text-red-600 text-sm mt-1">{errors.bedrooms.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('dashboard:addProperty.bathrooms')}
          </label>
          <input
            type="number"
            {...register('bathrooms', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="2"
          />
          {errors.bathrooms && <p className="text-red-600 text-sm mt-1">{errors.bathrooms.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('dashboard:addProperty.deliveryDate')}
          </label>
          <input
            type="date"
            {...register('deliveryDate')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          />
          {errors.deliveryDate && <p className="text-red-600 text-sm mt-1">{errors.deliveryDate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('dashboard:addProperty.status')}
          </label>
          <select
            {...register('status')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          >
            <option value="">{t('common:select')}</option>
            <option value="Available">{t('dashboard:addProperty.available')}</option>
            <option value="Sold Out">{t('dashboard:addProperty.soldOut')}</option>
            <option value="Reserved">{t('dashboard:addProperty.reserved')}</option>
          </select>
          {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t('dashboard:addProperty.paymentPlan')}
        </label>
        <input
          {...register('paymentPlan')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          placeholder="e.g., 20% down payment, 80% over 5 years"
        />
        {errors.paymentPlan && <p className="text-red-600 text-sm mt-1">{errors.paymentPlan.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t('dashboard:addProperty.description')}
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          placeholder="Describe your property in detail..."
        />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t('dashboard:addProperty.images')}
        </label>
        <textarea
          {...register('images')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg&#10;https://example.com/image4.jpg"
        />
        <p className="text-sm text-gray-600 mt-1">{t('dashboard:addProperty.imagesHint')}</p>
        {errors.images && <p className="text-red-600 text-sm mt-1">{errors.images.message}</p>}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {isSubmitting ? t('dashboard:addProperty.saving') : property ? t('dashboard:addProperty.updateButton') : t('dashboard:addProperty.addButton')}
        </button>
      </div>
    </form>
  )
}
