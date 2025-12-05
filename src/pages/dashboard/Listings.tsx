import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Property } from '@/lib/types'
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

export default function Listings() {
  const { t, i18n } = useTranslation(['dashboard', 'common'])
  const { user } = useAuth()

  const getTranslatedType = (type: string) => {
    const key = type.toLowerCase()
    return t(`common:propertyTypes.${key}`)
  }

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  // Advanced features state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const isRTL = i18n.language === 'ar'

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('marketer_id', user?.id)
        .order('created_at', { ascending: false })

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
        descriptionEn: prop.description_en || '',
        descriptionAr: prop.description_ar || '',
        titleEn: prop.title_en || '',
        titleAr: prop.title_ar || '',
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

  // Filtered and sorted properties
  const filteredAndSortedProperties = useMemo(() => {
    let result = [...properties]

    // Search filter
    if (searchQuery) {
      result = result.filter(prop =>
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(prop => prop.status === filterStatus)
    }

    // Type filter
    if (filterType !== 'all') {
      result = result.filter(prop => prop.type === filterType)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'oldest':
        result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [properties, searchQuery, filterStatus, filterType, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProperties.length / itemsPerPage)
  const paginatedProperties = filteredAndSortedProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus, filterType, sortBy])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800'
      case 'Sold Out':
        return 'bg-red-100 text-red-800'
      case 'Reserved':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) throw error

      console.log('Property deleted:', id)
      setSuccessMessage(t('listings.deleteSuccess'))
      setTimeout(() => setSuccessMessage(''), 3000)

      fetchProperties()
    } catch (error) {
      console.error('Error deleting property:', error)
    }
    setDeleteConfirm(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('listings.title')}</h1>
          <p className="text-gray-600 mt-1">{t('listings.description')}</p>
        </div>
        <Link
          to="/dashboard/add-property"
          className="px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
        >
          + {t('listings.addNew')}
        </Link>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Search, Filter, Sort Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
            <input
              type="text"
              placeholder={t('listings.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent`}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <SlidersHorizontal className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent appearance-none bg-white cursor-pointer`}
            >
              <option value="all">{t('listings.allStatus')}</option>
              <option value="Available">{t('addProperty.available')}</option>
              <option value="Reserved">{t('addProperty.reserved')}</option>
              <option value="Sold Out">{t('addProperty.soldOut')}</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <SlidersHorizontal className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent appearance-none bg-white cursor-pointer`}
            >
              <option value="all">{t('listings.allTypes')}</option>
              <option value="Apartment">{t('common:propertyTypes.apartment')}</option>
              <option value="Villa">{t('common:propertyTypes.villa')}</option>
              <option value="Townhouse">{t('common:propertyTypes.townhouse')}</option>
              <option value="Duplex">{t('common:propertyTypes.duplex')}</option>
              <option value="Commercial">{t('common:propertyTypes.commercial')}</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent appearance-none bg-white cursor-pointer`}
            >
              <option value="newest">{t('listings.sortNewest')}</option>
              <option value="oldest">{t('listings.sortOldest')}</option>
              <option value="price-low">{t('listings.sortPriceLow')}</option>
              <option value="price-high">{t('listings.sortPriceHigh')}</option>
              <option value="title">{t('listings.sortTitle')}</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {t('listings.showing')} <span className="font-semibold">{paginatedProperties.length}</span> {t('listings.of')}{' '}
            <span className="font-semibold">{filteredAndSortedProperties.length}</span> {t('listings.properties')}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          </div>
          <p className="text-gray-600 mt-4">{t('listings.loading')}</p>
        </div>
      ) : filteredAndSortedProperties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {properties.length === 0 ? t('listings.noProperties') : t('listings.noResults')}
          </h3>
          <p className="text-gray-600 mb-6">
            {properties.length === 0
              ? t('listings.startAdding')
              : t('listings.tryAdjusting')}
          </p>
          {properties.length === 0 && (
            <Link
              to="/dashboard/add-property"
              className="inline-block px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
            >
              {t('listings.addFirst')}
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <Link to={`/properties/${property.id}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(property.status)}`}>
                      {property.status}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-blue transition-colors">
                      {property.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                      <svg className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.location}
                    </p>

                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <span>{getTranslatedType(property.type)}</span>
                      <span>{property.area} m²</span>
                      <span>{property.bedrooms} {t('listings.beds')}</span>
                    </div>

                    <p className="text-2xl font-bold text-primary-blue mb-4">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                </Link>

                <div className="px-5 pb-5">
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/listings/${property.id}/edit`}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('listings.edit')}
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm(property.id)
                      }}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                    >
                      {t('listings.delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('listings.previous')}
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === page
                    ? 'bg-primary-blue text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('listings.next')}
              </button>
            </div>
          )}
        </>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('listings.confirmDelete')}</h3>
            <p className="text-gray-600 mb-6">
              {t('listings.deleteWarning')}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                {t('listings.cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                {t('listings.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
