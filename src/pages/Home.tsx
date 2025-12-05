import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Hero from '@/components/Hero'
import SpecialOffers from '@/components/SpecialOffers'
import PopularAreas from '@/components/PopularAreas'
import PropertyCardNew from '@/components/PropertyCardNew'
import { supabase } from '@/lib/supabase'
import { Property } from '@/lib/types'

export default function Home() {
  const { t, i18n } = useTranslation(['home', 'common'])
  const isArabic = i18n.language === 'ar'
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'Apartment' | 'Villa'>('all')

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'Available')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      const formattedProperties = data?.map(prop => ({
        id: prop.id,
        marketerId: prop.marketer_id,
        title: prop.title,
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
        status: prop.status,
        createdAt: new Date(prop.created_at),
        updatedAt: new Date(prop.updated_at)
      })) || []

      setProperties(formattedProperties)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter properties based on active tab
  const getFeaturedProperties = () => {
    let filtered = properties
    if (activeTab !== 'all') {
      filtered = properties.filter(p => p.type === activeTab)
    }
    return filtered.slice(0, 6)
  }

  const featuredProperties = getFeaturedProperties()

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* Featured Properties with Tabs */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              {t('home:featuredProperties')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {t('home:featuredPropertiesDesc')}
            </p>

            {/* Tabs */}
            <div className="inline-flex bg-white p-2 rounded-full shadow-md gap-1">
              {(['all', 'Apartment', 'Villa'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {tab === 'all' ? t('home:tabs.all') : 
                   tab === 'Apartment' ? t('home:tabs.apartments') : 
                   t('home:tabs.villas')}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredProperties.map(property => (
                  <PropertyCardNew key={property.id} property={property} />
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/properties"
                  className="inline-block px-8 py-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-smooth"
                >
                  {t('home:viewAllProperties')}
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Special Offers */}
      <SpecialOffers properties={properties} />

      {/* Popular Areas */}
      <PopularAreas />

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('home:whyChooseUs.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('home:whyChooseUs.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home:whyChooseUs.verifiedListings')}</h3>
              <p className="text-gray-600">{t('home:whyChooseUs.verifiedListingsDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home:whyChooseUs.easySearch')}</h3>
              <p className="text-gray-600">{t('home:whyChooseUs.easySearchDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home:whyChooseUs.securePlatform')}</h3>
              <p className="text-gray-600">{t('home:whyChooseUs.securePlatformDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{t('home:cta.title')}</h2>
          <p className="text-xl text-blue-100 mb-8">{t('home:cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/buyer"
              className="px-8 py-4 bg-white text-primary-blue rounded-lg font-semibold text-lg hover:scale-105 transition-transform duration-200"
            >
              {t('home:cta.forBuyers')}
            </Link>
            <Link
              to="/register/marketer"
              className="px-8 py-4 bg-primary-green text-white rounded-lg font-semibold text-lg hover:scale-105 transition-transform duration-200 border-2 border-white"
            >
              {t('home:cta.forMarketers')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
