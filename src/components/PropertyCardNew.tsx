import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Property } from '@/lib/types'
import InterestButton from './InterestButton'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCardNew({ property }: PropertyCardProps) {
  const { t } = useTranslation('properties')
  const mainImage = property.images && property.images.length > 0 ? property.images[0] : '/placeholder-property.jpg'

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <Link to={`/properties/${property.id}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 start-4 bg-primary-blue text-white px-4 py-2 rounded-full font-semibold text-sm">
            {property.price.toLocaleString()} {t('common:common.currency', { ns: 'common' })}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-blue line-clamp-1">
            {property.title}
          </h3>
          <p className="text-gray-600 mb-4">{property.location}</p>
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{property.bedrooms} {t('propertyCard.bedrooms')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              <span>{property.bathrooms} {t('propertyCard.bathrooms')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{property.area} {t('propertyCard.area')}</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-6 pb-6">
        <InterestButton property={property} />
      </div>
    </div>
  )
}
