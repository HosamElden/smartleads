import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface FilterValues {
  minPrice: number
  maxPrice: number
  location: string
  bedrooms: string
  propertyType: string
  minArea: number
}

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterValues) => void
}

const locationOptions = [
  'All Locations',
  'New Cairo',
  'NAC',
  '6th October',
  'Sheikh Zayed',
  'North Coast',
  'Madinaty',
  'Rehab',
  'Downtown',
  'Zamalek',
  'Heliopolis'
]

const propertyTypeOptions = [
  'All Types',
  'Apartment',
  'Villa',
  'Townhouse',
  'Duplex',
  'Commercial'
]

export default function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const { t } = useTranslation(['properties', 'common'])
  const [filters, setFilters] = useState<FilterValues>({
    minPrice: 0,
    maxPrice: 10000000,
    location: 'All Locations',
    bedrooms: 'Any',
    propertyType: 'All Types',
    minArea: 0
  })

  const handleFilterChange = (newFilters: Partial<FilterValues>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  const getLocationLabel = (location: string) => {
    switch (location) {
      case 'All Locations':
        return t('properties:filters.allLocations')
      case 'New Cairo':
        return t('common:locations.newCairo')
      case 'NAC':
        return t('common:locations.nac')
      case '6th October':
        return t('common:locations.sixthOctober')
      case 'Sheikh Zayed':
        return t('common:locations.sheikhZayed')
      case 'North Coast':
        return t('common:locations.northCoast')
      default:
        return location
    }
  }

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'All Types':
        return t('properties:filters.allTypes')
      case 'Apartment':
        return t('common:propertyTypes.apartment')
      case 'Villa':
        return t('common:propertyTypes.villa')
      case 'Townhouse':
        return t('common:propertyTypes.townhouse')
      case 'Duplex':
        return t('common:propertyTypes.duplex')
      case 'Commercial':
        return t('common:propertyTypes.commercial')
      default:
        return type
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('properties:filters.location')}
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange({ location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white"
          >
            {locationOptions.map((location) => (
              <option key={location} value={location}>
                {getLocationLabel(location)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('properties:filters.propertyType')}
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleFilterChange({ propertyType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white"
          >
            {propertyTypeOptions.map((type) => (
              <option key={type} value={type}>
                {getPropertyTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('properties:filters.minPrice')}
          </label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange({ minPrice: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('properties:filters.maxPrice')}
          </label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="10000000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('properties:filters.minBedrooms')}
          </label>
          <select
            value={filters.bedrooms}
            onChange={(e) => handleFilterChange({ bedrooms: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white"
          >
            <option value="Any">{t('properties:filters.any')}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('properties:filters.minArea')}
          </label>
          <input
            type="number"
            value={filters.minArea}
            onChange={(e) => handleFilterChange({ minArea: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  )
}
