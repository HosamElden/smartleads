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

  // Status badge styling
  const getStatusBadge = () => {
    const statusConfig = {
      'Available': { bg: 'bg-green-500', text: t('propertyCard.available') },
      'Sold Out': { bg: 'bg-red-500', text: t('propertyCard.soldOut') },
      'Reserved': { bg: 'bg-yellow-500', text: t('propertyCard.reserved') }
    }
    
    const config = statusConfig[property.status as keyof typeof statusConfig] || statusConfig['Available']
    return (
      <div className={`${config.bg} text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md`}>
        {config.text}
      </div>
    )
  }

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <Link to={`/properties/${property.id}`} className="block">
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            {getStatusBadge()}
          </div>
          
          {/* Price Tag */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
            <div className="text-2xl font-bold text-primary">
              {property.price.toLocaleString()}
              <span className="text-sm font-normal text-gray-600 ml-1">SAR</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
            {property.title}
          </h3>
          
          {/* Location */}
          <div className="flex items-center text-gray-600 mb-4">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm line-clamp-1">{property.location}</span>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="font-medium">{property.area} m²</span>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Interest Button */}
      <div className="px-5 pb-5">
        <InterestButton property={property} />
      </div>
    </div>
  )
}
