import { supabase } from '../supabase'
import type { OfferType, Ownership, PropertyType } from '../types'

/**
 * Lookup Tables API Functions
 * CRUD operations for offer_types, ownerships, and property_types
 * Now with bilingual support (English and Arabic)
 */

export const lookupApi = {
    // Offer Types
    offerTypes: {
        async getAll(): Promise<{ data: OfferType[] | null; error: any }> {
            try {
                const { data, error } = await supabase
                    .from('offer_types')
                    .select('*')
                    .order('label_en')

                if (error) throw error

                const formattedData = data?.map(item => ({
                    id: item.id,
                    code: item.code,
                    label: item.label || item.label_en, // Backwards compatibility
                    labelEn: item.label_en,
                    labelAr: item.label_ar,
                    createdAt: new Date(item.created_at)
                })) || []

                return { data: formattedData, error: null }
            } catch (error) {
                console.error('Error fetching offer types:', error)
                return { data: null, error }
            }
        },

        async create(data: { code: string; labelEn: string; labelAr: string }): Promise<{ data: OfferType | null; error: any }> {
            try {
                const { data: result, error } = await supabase
                    .from('offer_types')
                    .insert({
                        code: data.code.toUpperCase(),
                        label_en: data.labelEn,
                        label_ar: data.labelAr,
                        label: data.labelEn // Keep for backwards compatibility
                    })
                    .select()
                    .single()

                if (error) throw error

                const formattedData: OfferType = {
                    id: result.id,
                    code: result.code,
                    label: result.label || result.label_en,
                    labelEn: result.label_en,
                    labelAr: result.label_ar,
                    createdAt: new Date(result.created_at)
                }

                return { data: formattedData, error: null }
            } catch (error) {
                console.error('Error creating offer type:', error)
                return { data: null, error }
            }
        },

        async update(id: number, data: { code?: string; labelEn?: string; labelAr?: string }): Promise<{ data: OfferType | null; error: any }> {
            try {
                const updateData: any = {}
                if (data.code) updateData.code = data.code.toUpperCase()
                if (data.labelEn) {
                    updateData.label_en = data.labelEn
                    updateData.label = data.labelEn // Keep synced
                }
                if (data.labelAr) updateData.label_ar = data.labelAr

                const { data: result, error } = await supabase
                    .from('offer_types')
                    .update(updateData)
                    .eq('id', id)
                    .select()
                    .single()

                if (error) throw error

                const formattedData: OfferType = {
                    id: result.id,
                    code: result.code,
                    label: result.label || result.label_en,
                    labelEn: result.label_en,
                    labelAr: result.label_ar,
                    createdAt: new Date(result.created_at)
                }

                return { data: formattedData, error: null }
            } catch (error) {
                console.error('Error updating offer type:', error)
                return { data: null, error }
            }
        },

        async delete(id: number): Promise<{ error: any }> {
            try {
                const { error } = await supabase
                    .from('offer_types')
                    .delete()
                    .eq('id', id)

                if (error) throw error
                return { error: null }
            } catch (error) {
                console.error('Error deleting offer type:', error)
                return { error }
            }
        }
    },

    // Ownerships
    ownerships: {
        async getAll(): Promise<{ data: Ownership[] | null; error: any }> {
            try {
                const { data, error } = await supabase
                    .from('ownerships')
                    .select('*')
                    .order('label_en')

                if (error) throw error

                const formattedData = data?.map(item => ({
                    id: item.id,
                    code: item.code,
                    label: item.label || item.label_en,
                    labelEn: item.label_en,
                    labelAr: item.label_ar,
                    createdAt: new Date(item.created_at)
                })) || []

                return { data: formattedData, error: null }
            } catch (error) {
                console.error('Error fetching ownerships:', error)
                return { data: null, error }
            }
        },

        async create(data: { code: string; labelEn: string; labelAr: string }): Promise<{ data: Ownership | null; error: any }> {
            try {
                const { data: result, error } = await supabase
                    .from('ownerships')
                    .insert({
                        code: data.code.toUpperCase(),
                        label_en: data.labelEn,
                        label_ar: data.labelAr,
                        label: data.labelEn
                    })
                    .select()
                    .single()

                if (error) throw error

                const formattedData: Ownership = {
                    id: result.id,
                    code: result.code,
                    label: result.label || result.label_en,
                    labelEn: result.label_en,
                    labelAr: result.label_ar,
                    createdAt: new Date(result.created_at)
                }

                return { data: formattedData, error: null }
            } catch (error) {
                console.error('Error creating ownership:', error)
                return { data: null, error }
            }
        },

        async update(id: number, data: { code?: string; labelEn?: string; labelAr?: string }): Promise<{ data: Ownership | null; error: any }> {
            try {
                const updateData: any = {}
                if (data.code) updateData.code = data.code.toUpperCase()
                if (data.labelEn) {
                    updateData.label_en = data.labelEn
                    updateData.label = data.labelEn
                }
                if (data.labelAr) updateData.label_ar = data.labelAr

                const { data: result, error } = await supabase
                    .from('ownerships')
                    .update(updateData)
                    .eq('id', id)
                    .select()
                    .single()

                if (error) throw error

                const formattedData: Ownership = {
                    id: result.id,
                    code: result.code,
                    label: result.label || result.label_en,
                    labelEn: result.label_en,
                    labelAr: result.label_ar,
                    createdAt: new Date(result.created_at)
                }

                return { data: formattedData, error: null }
            } catch (error) {
                console.error('Error updating ownership:', error)
                return { data: null, error }
            }
        },

        async delete(id: number): Promise<{ error: any }> {
            try {
                const { error } = await supabase
                    .from('ownerships')
                    .delete()
                    .eq('id', id)

                if (error) throw error
                return { error: null }
            } catch (error) {
                console.error('Error deleting ownership:', error)
                return { error }
            }
        }
    },

    // Property Types
    propertyTypes: {
        async getAll(): Promise<{ data: PropertyType[] | null; error: any }> {
            try {
                const { data, error } = await supabase
                    .from('property_types')
                    .select('*')
                    .order('label_en')

                if (error) throw error

                const formattedData = data?.map(item => ({
                    id: item.id,
                    code: item.code,
                    label: item.label || item.label_en,
                    labelEn: item.label_en,
                    labelAr: item.label_ar,
                    createdAt: new Date(item.created_at)
                })) || []

                return { data: formattedData, error: null }
            } catch (error) {
                console.error('Error fetching property types:', error)
                return { data: null, error }
            }
        },

        async create(data: { code: string; labelEn: string; labelAr: string }): Promise<{ data: PropertyType | null; error: any }> {
            try {
                const { data: result, error } = await supabase
                    .from('property_types')
                    .insert({
                        code: data.code.toUpperCase(),
                        label_en: data.labelEn,
                        label_ar: data.labelAr,
                        label: data.labelEn
                    })
                    .select()
                    .single()

                if (error) throw error

                const formattedData: PropertyType = {
                    id: result.id,
                    code: result.code,
                    label: result.label || result.label_en,
                    labelEn: result.label_en,
                    labelAr: result.label_ar,
                    createdAt: new Date(result.created_at)
                }

                return { data: formattedData, error: null }
            } catch (error) {
                console.error('Error creating property type:', error)
                return { data: null, error }
            }
        },

        async update(id: number, data: { code?: string; labelEn?: string; labelAr?: string }): Promise<{ data: PropertyType | null; error: any }> {
            try {
                const updateData: any = {}
                if (data.code) updateData.code = data.code.toUpperCase()
                if (data.labelEn) {
                    updateData.label_en = data.labelEn
                    updateData.label = data.labelEn
                }
                if (data.labelAr) updateData.label_ar = data.labelAr

                const { data: result, error } = await supabase
                    .from('property_types')
                    .update(updateData)
                    .eq('id', id)
                    .select()
                    .single()

                if (error) throw error

                const formattedData: PropertyType = {
                    id: result.id,
                    code: result.code,
                    label: result.label || result.label_en,
                    labelEn: result.label_en,
                    labelAr: result.label_ar,
                    createdAt: new Date(result.created_at)
                }

                return { data: formattedData, error: null }
            } catch (error) {
                console.error('Error updating property type:', error)
                return { data: null, error }
            }
        },

        async delete(id: number): Promise<{ error: any }> {
            try {
                const { error } = await supabase
                    .from('property_types')
                    .delete()
                    .eq('id', id)

                if (error) throw error
                return { error: null }
            } catch (error) {
                console.error('Error deleting property type:', error)
                return { error }
            }
        }
    }
}
