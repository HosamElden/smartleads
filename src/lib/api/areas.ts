import { supabase } from '../supabase'

export interface Area {
    id: number
    code: string
    labelEn: string
    labelAr: string
    slug: string
    imageUrl: string | null
    isPopular: boolean
    displayOrder: number
    city: string | null
    country: string
    createdAt: Date
}

interface CreateAreaData {
    code: string
    labelEn: string
    labelAr: string
    slug: string
    imageUrl?: string
    isPopular?: boolean
    displayOrder?: number
    city?: string
    country?: string
}

interface UpdateAreaData {
    code?: string
    labelEn?: string
    labelAr?: string
    slug?: string
    imageUrl?: string
    isPopular?: boolean
    displayOrder?: number
    city?: string
    country?: string
}

// Format database row to Area interface
function formatArea(row: any): Area {
    return {
        id: row.id,
        code: row.code,
        labelEn: row.label_en,
        labelAr: row.label_ar,
        slug: row.slug,
        imageUrl: row.image_url,
        isPopular: row.is_popular,
        displayOrder: row.display_order,
        city: row.city,
        country: row.country,
        createdAt: new Date(row.created_at)
    }
}

// Convert Area data to database format
function toDbFormat(data: CreateAreaData | UpdateAreaData): any {
    const dbData: any = {}
    if ('code' in data && data.code !== undefined) dbData.code = data.code
    if ('labelEn' in data && data.labelEn !== undefined) dbData.label_en = data.labelEn
    if ('labelAr' in data && data.labelAr !== undefined) dbData.label_ar = data.labelAr
    if ('slug' in data && data.slug !== undefined) dbData.slug = data.slug
    if ('imageUrl' in data) dbData.image_url = data.imageUrl || null
    if ('isPopular' in data && data.isPopular !== undefined) dbData.is_popular = data.isPopular
    if ('displayOrder' in data && data.displayOrder !== undefined) dbData.display_order = data.displayOrder
    if ('city' in data) dbData.city = data.city || null
    if ('country' in data && data.country !== undefined) dbData.country = data.country
    return dbData
}

export const areaApi = {
    // Get all areas
    async getAll() {
        try {
            const { data, error } = await supabase
                .from('areas')
                .select('*')
                .order('display_order', { ascending: true })

            if (error) throw error

            return {
                data: data?.map(formatArea) || [],
                error: null
            }
        } catch (error: any) {
            console.error('Error fetching areas:', error)
            return { data: null, error }
        }
    },

    // Get popular areas only
    async getPopular() {
        try {
            const { data, error } = await supabase
                .from('areas')
                .select('*')
                .eq('is_popular', true)
                .order('display_order', { ascending: true })

            if (error) throw error

            return {
                data: data?.map(formatArea) || [],
                error: null
            }
        } catch (error: any) {
            console.error('Error fetching popular areas:', error)
            return { data: null, error }
        }
    },

    // Get areas by country
    async getByCountry(country: string) {
        try {
            const { data, error } = await supabase
                .from('areas')
                .select('*')
                .eq('country', country)
                .order('display_order', { ascending: true })

            if (error) throw error

            return {
                data: data?.map(formatArea) || [],
                error: null
            }
        } catch (error: any) {
            console.error('Error fetching areas by country:', error)
            return { data: null, error }
        }
    },

    // Get single area by ID
    async getById(id: number) {
        try {
            const { data, error } = await supabase
                .from('areas')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            return {
                data: data ? formatArea(data) : null,
                error: null
            }
        } catch (error: any) {
            console.error('Error fetching area:', error)
            return { data: null, error }
        }
    },

    // Create new area
    async create(areaData: CreateAreaData) {
        try {
            const dbData = toDbFormat(areaData)

            const { data, error } = await supabase
                .from('areas')
                .insert([dbData])
                .select()
                .single()

            if (error) throw error

            return {
                data: data ? formatArea(data) : null,
                error: null
            }
        } catch (error: any) {
            console.error('Error creating area:', error)
            return { data: null, error }
        }
    },

    // Update area
    async update(id: number, areaData: UpdateAreaData) {
        try {
            const dbData = toDbFormat(areaData)

            const { data, error } = await supabase
                .from('areas')
                .update(dbData)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            return {
                data: data ? formatArea(data) : null,
                error: null
            }
        } catch (error: any) {
            console.error('Error updating area:', error)
            return { data: null, error }
        }
    },

    // Delete area
    async delete(id: number) {
        try {
            const { error } = await supabase
                .from('areas')
                .delete()
                .eq('id', id)

            if (error) throw error

            return { data: true, error: null }
        } catch (error: any) {
            console.error('Error deleting area:', error)
            return { data: null, error }
        }
    }
}
