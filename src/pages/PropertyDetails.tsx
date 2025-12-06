import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropertyCardNew from '@/components/PropertyCardNew'
import InterestButton from '@/components/InterestButton'
import { Film } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Property } from '@/lib/types'
import { optimizeCloudinaryUrl, isVideo } from '@/lib/cloudinary'

export default function PropertyDetails() {
  const { t } = useTranslation('properties')
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [similarProperties, setSimilarProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (id) {
      fetchProperty()
    }
  }, [id])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw error

      if (data) {
        const formattedProperty: Property = {
          id: data.id,
          marketerId: data.marketer_id,
          title: data.title,
          titleEn: data.title_en || data.title,
          titleAr: data.title_ar || data.title,
          type: data.type,
          location: data.location,
          projectName: data.project_name,
          price: Number(data.price),
          area: Number(data.area),
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          deliveryDate: new Date(data.delivery_date),
          paymentPlan: data.payment_plan,
          images: data.images,
          description: data.description,
          descriptionEn: data.description_en || data.description,
          descriptionAr: data.description_ar || data.description,
          status: data.status,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        }
        setProperty(formattedProperty)
        fetchSimilarProperties(formattedProperty.location, formattedProperty.type)
      } else {
        setProperty(null)
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      setProperty(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilarProperties = async (location: string, type: string) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'Available')
        .neq('id', id)
        .or(`location.eq.${location},type.eq.${type}`)
        .limit(3)

      if (error) throw error

      const formatted = data?.map(prop => ({
        id: prop.id,
        marketerId: prop.marketer_id,
        title: prop.title,
        titleEn: prop.title_en || prop.title,
        titleAr: prop.title_ar || prop.title,
        type: prop.type,
        location: prop.location,
        projectName: prop.project_name,
        price: Number(prop.price),
        area: Number(prop.area),
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        deliveryDate: new Date(prop.delivery_date),
        paymentPlan: prop.payment_plan,
        images: prop.images,
        description: prop.description,
        descriptionEn: prop.description_en || prop.description,
        descriptionAr: prop.description_ar || prop.description,
        status: prop.status,
        createdAt: new Date(prop.created_at),
        updatedAt: new Date(prop.updated_at)
      })) || []

      setSimilarProperties(formatted)
    } catch (error) {
      console.error('Error fetching similar properties:', error)
    }
  }

  const nextImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('propertyNotFound')}</h1>
          <Link to="/properties" className="text-primary hover:text-primary-hover">
            {t('backToProperties')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-primary">{t('common:header.home')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/properties" className="text-gray-500 hover:text-primary">{t('common:header.properties')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="relative h-96 lg:h-[500px] bg-gray-900">
                {property.images && property.images.length > 0 ? (
                  <>
                    {isVideo(property.images[currentImageIndex]) ? (
                      <video
                        src={optimizeCloudinaryUrl(property.images[currentImageIndex])}
                        className="w-full h-full object-contain bg-black"
                        controls
                        autoPlay
                        muted
                      />
                    ) : (
                      <img
                        src={optimizeCloudinaryUrl(property.images[currentImageIndex], 1200)}
                        alt={`${property.title} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Navigation Arrows */}
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                        >
                          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                        >
                          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No images available
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {property.images && property.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative ${index === currentImageIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                    >
                      {isVideo(image) ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                          <Film className="text-white w-8 h-8" />
                        </div>
                      ) : (
                        <img src={optimizeCloudinaryUrl(image, 200)} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{property.title}</h1>

              <div className="flex items-center text-gray-600 mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-lg">{property.location}</span>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">{t('propertyCard.bedrooms')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">{t('propertyCard.bathrooms')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{property.area}</div>
                  <div className="text-sm text-gray-600">m²</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{property.type}</div>
                  <div className="text-sm text-gray-600">{t('propertyCard.type')}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('description')}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('projectName')}</h3>
                  <p className="text-gray-700">{property.projectName}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('deliveryDate')}</h3>
                  <p className="text-gray-700">{property.deliveryDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('paymentPlan')}</h3>
                  <p className="text-gray-700">{property.paymentPlan}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('status')}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${property.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {property.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-4">
              <div className="text-4xl font-bold text-primary mb-6">
                {property.price.toLocaleString()}
                <span className="text-lg font-normal text-gray-600 ml-2">SAR</span>
              </div>

              <InterestButton property={property} />

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">{t('contactAgent')}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+20 123 456 7890</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>agent@smartleads.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('similarProperties')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <PropertyCardNew key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
