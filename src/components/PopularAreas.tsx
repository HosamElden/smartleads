import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { areaApi, type Area } from '@/lib/api/areas'

export default function PopularAreas() {
  const { t, i18n } = useTranslation('home')
  const isArabic = i18n.language === 'ar'
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopularAreas()
  }, [])

  const fetchPopularAreas = async () => {
    try {
      setLoading(true)
      const { data, error } = await areaApi.getPopular()

      if (error) throw error
      if (data) setAreas(data)
    } catch (error) {
      console.error('Error fetching popular areas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading popular areas...</p>
        </div>
      </section>
    )
  }

  if (areas.length === 0) {
    return null // Don't show section if no popular areas
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {t('popularAreas')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('popularAreasDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area) => (
            <Link
              key={area.id}
              to={`/properties?location=${area.slug}`}
              className="group relative h-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {area.imageUrl ? (
                <img
                  src={area.imageUrl}
                  alt={isArabic ? area.labelAr : area.labelEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                  {isArabic ? area.labelAr : area.labelEn}
                </h3>
                {area.city && (
                  <p className="text-blue-100 text-sm mb-1">
                    {area.city}, {area.country}
                  </p>
                )}
                <p className="text-blue-100 text-sm">
                  {t('exploreLocation')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
