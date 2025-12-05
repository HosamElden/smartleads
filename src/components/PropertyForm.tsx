import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { Property, Project, OfferType, Ownership } from '@/lib/types'
import { projectApi, lookupApi } from '@/lib/api'

const createPropertySchema = (t: (key: string) => string) => z.object({
  title: z.string().min(5, t('dashboard:addProperty.validation.titleMin')),
  type: z.enum(['Apartment', 'Villa', 'Townhouse', 'Duplex', 'Commercial']),
  location: z.string().min(1, t('dashboard:addProperty.validation.locationRequired')),
  projectName: z.string().optional(),
  price: z.number().positive(t('dashboard:addProperty.validation.pricePositive')),
  area: z.number().positive(t('dashboard:addProperty.validation.areaPositive')),
  bedrooms: z.number().min(0, t('dashboard:addProperty.validation.bedroomsMin')),
  bathrooms: z.number().min(1, t('dashboard:addProperty.validation.bathroomsMin')),
  deliveryDate: z.string().min(1, t('dashboard:addProperty.validation.deliveryDateRequired')),
  paymentPlan: z.string().min(10, t('dashboard:addProperty.validation.paymentPlanMin')),
  description: z.string().min(20, t('dashboard:addProperty.validation.descriptionMin')),
  status: z.enum(['Available', 'Sold Out', 'Reserved']),
  images: z.string().min(1, t('dashboard:addProperty.validation.imagesRequired')),
  // NEW FIELDS
  projectId: z.string().optional(),
  offerTypeId: z.number().optional(),
  providerName: z.string().optional(),
  furnished: z.boolean().optional(),
  ownershipId: z.number().optional(),
  locationLabel: z.string().optional(),
  locationMapUrl: z.string().url().optional().or(z.literal('')),
  detailedDescription: z.string().optional(),
  amenities: z.string().optional() // Comma-separated list
})

type PropertyFormData = z.infer<ReturnType<typeof createPropertySchema>>

interface PropertyFormProps {
  property?: Property
  onSubmit: (data: PropertyFormData) => void
  isSubmitting?: boolean
}

export default function PropertyForm({ property, onSubmit, isSubmitting }: PropertyFormProps) {
  const { t } = useTranslation(['dashboard', 'common'])
  const propertySchema = createPropertySchema(t)

  // State for dynamic data
  const [projects, setProjects] = useState<Project[]>([])
  const [offerTypes, setOfferTypes] = useState<OfferType[]>([])
  const [ownerships, setOwnerships] = useState<Ownership[]>([])
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property ? {
      title: property.title,
      type: property.type as any,
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
      images: property.images.join('\n'),
      // NEW FIELDS
      projectId: property.projectId?.toString() || '',
      offerTypeId: property.offerTypeId || undefined,
      providerName: property.providerName || '',
      furnished: property.furnished || false,
      ownershipId: property.ownershipId || undefined,
      locationLabel: property.locationLabel || '',
      locationMapUrl: property.locationMapUrl || '',
      detailedDescription: property.detailedDescription || '',
      amenities: property.amenities?.map(a => a.label).join(', ') || ''
    } : {
      furnished: false
    }
  })

  // Fetch lookup data
  useEffect(() => {
    async function fetchLookupData() {
      try {
        setLoading(true)
        const [projectsResult, offerTypesResult, ownershipsResult] = await Promise.all([
          projectApi.getAll(true),
          lookupApi.offerTypes.getAll(),
          lookupApi.ownerships.getAll()
        ])

        if (projectsResult.data) setProjects(projectsResult.data)
        if (offerTypesResult.data) setOfferTypes(offerTypesResult.data)
        if (ownershipsResult.data) setOwnerships(ownershipsResult.data)
      } catch (error) {
        console.error('Error fetching lookup data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLookupData()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
        <p className="text-gray-600 mt-4">{t('dashboard:addProperty.loadingForm')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard:addProperty.sections.basicInfo')}</h3>

        <div className="space-y-6">
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
                {t('dashboard:addProperty.offerType')}
              </label>
              <select
                {...register('offerTypeId', { valueAsNumber: true, setValueAs: v => v === '' ? undefined : Number(v) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="">{t('dashboard:addProperty.selectOfferType')}</option>
                {offerTypes.map(ot => (
                  <option key={ot.id} value={ot.id}>{ot.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('dashboard:addProperty.ownership')}
              </label>
              <select
                {...register('ownershipId', { valueAsNumber: true, setValueAs: v => v === '' ? undefined : Number(v) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="">{t('dashboard:addProperty.selectOwnership')}</option>
                {ownerships.map(ow => (
                  <option key={ow.id} value={ow.id}>{ow.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Location & Project Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard:addProperty.sections.locationProject')}</h3>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('dashboard:addProperty.location')}
              </label>
              <input
                {...register('location')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder={t('dashboard:addProperty.placeholders.location')}
              />
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('dashboard:addProperty.locationLabel')}
              </label>
              <input
                {...register('locationLabel')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder={t('dashboard:addProperty.locationLabelPlaceholder')}
              />
              <p className="text-sm text-gray-500 mt-1">{t('dashboard:addProperty.locationLabelHint')}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('dashboard:addProperty.locationMapUrl')}
            </label>
            <input
              {...register('locationMapUrl')}
              type="url"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder={t('dashboard:addProperty.locationMapPlaceholder')}
            />
            {errors.locationMapUrl && <p className="text-red-600 text-sm mt-1">{errors.locationMapUrl.message}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('dashboard:addProperty.projectCompound')}
              </label>
              <select
                {...register('projectId')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="">{t('dashboard:addProperty.noneStandalone')}</option>
                {projects.map(proj => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name} {proj.developer && `(${proj.developer.name})`}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">{t('dashboard:addProperty.projectCompoundHint')}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('dashboard:addProperty.projectNameLegacy')} (Legacy)
              </label>
              <input
                {...register('projectName')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder={t('dashboard:addProperty.placeholders.projectNameLegacy')}
              />
              <p className="text-sm text-gray-500 mt-1">{t('dashboard:addProperty.projectNameLegacyHint')}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('dashboard:addProperty.providerName')}
            </label>
            <input
              {...register('providerName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder={t('dashboard:addProperty.providerNamePlaceholder')}
            />
          </div>
        </div>
      </div>

      {/*Property Details Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard:addProperty.sections.propertyDetails')}</h3>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('dashboard:addProperty.price')}
              </label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder={t('dashboard:addProperty.placeholders.price')}
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
                placeholder={t('dashboard:addProperty.placeholders.area')}
              />
              {errors.area && <p className="text-red-600 text-sm mt-1">{errors.area.message}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('dashboard:addProperty.bedrooms')}
              </label>
              <input
                type="number"
                {...register('bedrooms', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder={t('dashboard:addProperty.placeholders.bedrooms')}
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
                placeholder={t('dashboard:addProperty.placeholders.bathrooms')}
              />
              {errors.bathrooms && <p className="text-red-600 text-sm mt-1">{errors.bathrooms.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('furnished')}
                  className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-2 focus:ring-primary-blue"
                />
                {t('dashboard:addProperty.furnished')}
              </label>
              <p className="text-sm text-gray-500 mt-1">{t('dashboard:addProperty.furnishedHint')}</p>
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
                {t('dashboard:addProperty.paymentPlan')}
              </label>
              <input
                {...register('paymentPlan')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder={t('dashboard:addProperty.placeholders.paymentPlan')}
              />
              {errors.paymentPlan && <p className="text-red-600 text-sm mt-1">{errors.paymentPlan.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('dashboard:addProperty.amenities')}
            </label>
            <input
              {...register('amenities')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder={t('dashboard:addProperty.amenitiesPlaceholder')}
            />
            <p className="text-sm text-gray-500 mt-1">{t('dashboard:addProperty.amenitiesHint')}</p>
          </div>
        </div>
      </div>

      {/* Descriptions Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard:addProperty.sections.descriptions')}</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('dashboard:addProperty.description')}
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder={t('dashboard:addProperty.placeholders.description')}
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('dashboard:addProperty.detailedDescription')}
            </label>
            <textarea
              {...register('detailedDescription')}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder={t('dashboard:addProperty.detailedDescriptionPlaceholder')}
            />
            <p className="text-sm text-gray-500 mt-1">{t('dashboard:addProperty.detailedDescriptionHint')}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('dashboard:addProperty.images')}
            </label>
            <textarea
              {...register('images')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder={t('dashboard:addProperty.placeholders.images')}
            />
            <p className="text-sm text-gray-600 mt-1">{t('dashboard:addProperty.imagesHint')}</p>
            {errors.images && <p className="text-red-600 text-sm mt-1">{errors.images.message}</p>}
          </div>
        </div>
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
