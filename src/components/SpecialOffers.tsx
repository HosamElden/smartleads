import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Property } from '@/lib/types'

interface SpecialOffersProps {
  properties: Property[]
}

export default function SpecialOffers({ properties }: SpecialOffersProps) {
  const { t } = useTranslation('home')

  // For now, highlight properties with lowest prices or newest
  const specialProperties = properties.slice(0, 4)

  if (specialProperties.length === 0) return null

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {t('specialOffers')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('specialOffersDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialProperties.map((property) => (
            <Link
              key={property.id}
              to={`/properties/${property.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.images[0] || '/placeholder.jpg'}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                  {t('featured')}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {property.title}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="line-clamp-1">{property.location}</span>
                </div>

                <div className="text-xl font-bold text-primary">
                  {property.price.toLocaleString()} SAR
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
