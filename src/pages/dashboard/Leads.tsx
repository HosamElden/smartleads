import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/context/AuthContext'
import { supabase } from '@/lib/supabase'

interface Lead {
  id: string
  buyerName: string
  buyerPhone: string
  buyerEmail: string
  buyerScore: number
  buyerScoreTier: string
  buyerBudget: number
  buyerLocations: string[]
  buyerPropertyTypes: string[]
  status: string
  createdAt: Date
  property: {
    id: string
    title: string
    location: string
    price: number
    images: string[]
  }
}

export default function Leads() {
  const { t } = useTranslation('dashboard')
  const { user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'Hot' | 'Warm' | 'Cold'>('all')

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    if (user.userType === 'marketer') {
      fetchLeads()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchLeads = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('leads')
        .select(`
          id,
          buyer_name,
          buyer_phone,
          buyer_email,
          buyer_score,
          buyer_score_tier,
          buyer_budget,
          buyer_locations,
          buyer_property_types,
          status,
          created_at,
          properties(
            id,
            title,
            location,
            price,
            images
          )
        `)
        .eq('marketer_id', user.id)
        .order('buyer_score', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedLeads = data?.map(lead => ({
        id: lead.id,
        buyerName: lead.buyer_name,
        buyerPhone: lead.buyer_phone,
        buyerEmail: lead.buyer_email,
        buyerScore: lead.buyer_score,
        buyerScoreTier: lead.buyer_score_tier,
        buyerBudget: lead.buyer_budget,
        buyerLocations: lead.buyer_locations,
        buyerPropertyTypes: lead.buyer_property_types,
        status: lead.status,
        createdAt: new Date(lead.created_at),
        property: (lead as any).properties
      })) || []

      setLeads(formattedLeads)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId)

      if (error) throw error

      setLeads(leads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ))
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  const getScoreBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Hot':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Warm':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Cold':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getScoreEmoji = (tier: string) => {
    switch (tier) {
      case 'Hot': return '🔥'
      case 'Warm': return '⚡'
      case 'Cold': return '❄️'
      default: return ''
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const filteredLeads = filter === 'all'
    ? leads
    : leads.filter(lead => lead.buyerScoreTier === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('leads.title')}</h1>
            <p className="text-gray-600">{t('leads.subtitle')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            <p className="text-gray-600 mt-4">{t('leads.loading')}</p>
            <div className="mt-4 text-xs text-gray-400 text-left">
              <p>Debug Info:</p>
              <p>User: {user ? 'Logged In' : 'Not Logged In'}</p>
              <p>User ID: {user?.id}</p>
              <p>User Type: {user?.userType}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('leads.title')}</h1>
            <p className="text-gray-600">{t('leads.subtitle')}</p>
          </div>

          <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200">
            {(['all', 'Hot', 'Warm', 'Cold'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === f
                  ? 'bg-primary-blue text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {f === 'all' ? `${t('leads.all')} (${leads.length})` : `${getScoreEmoji(f)} ${t(`leads.${f.toLowerCase()}`)} (${leads.filter(l => l.buyerScoreTier === f).length})`}
              </button>
            ))}
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('leads.noLeads')}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{t('leads.waitForInterest')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Property Image & Info Section */}
                  <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50">
                    <div className="flex gap-4">
                      <Link to={`/properties/${lead.property.id}`} className="shrink-0 group">
                        <div className="w-24 h-24 rounded-lg overflow-hidden shadow-sm relative">
                          <img
                            src={lead.property.images?.[0] || 'https://via.placeholder.com/150'}
                            alt={lead.property.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('leads.interestedIn')}</span>
                          <Link
                            to={`/properties/${lead.property.id}`}
                            className="text-xs font-medium text-primary-blue hover:text-blue-700 flex items-center gap-1"
                          >
                            {t('leads.viewProperty')}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 truncate mb-1" title={lead.property.title}>
                          {lead.property.title}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {lead.property.location}
                        </p>
                        <p className="text-lg font-bold text-primary-blue">
                          {formatPrice(lead.property.price)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buyer Info Section */}
                  <div className="lg:w-2/3 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-primary-blue font-bold text-xl">
                          {lead.buyerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">{lead.buyerName}</h2>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{t('leads.budget')}: {formatPrice(lead.buyerBudget)}</span>
                            <span>•</span>
                            <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${getScoreBadgeColor(lead.buyerScoreTier)}`}>
                        <span className="text-xl">{getScoreEmoji(lead.buyerScoreTier)}</span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider opacity-80">{t('leads.leadScore')}</p>
                          <p className="font-bold">{lead.buyerScore}/100</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex gap-2">
                        <a
                          href={`tel:+20${lead.buyerPhone.replace(/^0/, '')}`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {t('leads.call')}
                        </a>
                        <a
                          href={`mailto:${lead.buyerEmail}`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {t('leads.email')}
                        </a>
                      </div>

                      <div className="md:col-span-2 flex items-center justify-end gap-3">
                        <label className="text-sm font-medium text-gray-700">Status:</label>
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className={`
                            border-0 rounded-lg py-2.5 pl-4 pr-10 font-semibold ring-1 ring-inset focus:ring-2 focus:ring-primary-blue sm:text-sm sm:leading-6 cursor-pointer
                            ${lead.status === 'New' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : ''}
                            ${lead.status === 'Contacted' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' : ''}
                            ${lead.status === 'Deal' ? 'bg-green-50 text-green-700 ring-green-600/20' : ''}
                            ${lead.status === 'Lost' ? 'bg-red-50 text-red-700 ring-red-600/20' : ''}
                          `}
                        >
                          <option value="New">{t('leads.newLead')}</option>
                          <option value="Contacted">{t('leads.status')}</option>
                          <option value="Deal">{t('leads.dealClosed')}</option>
                          <option value="Lost">{t('leads.lostLead')}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
