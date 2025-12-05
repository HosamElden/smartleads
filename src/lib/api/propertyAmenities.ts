import { supabase } from '../supabase'
import type { PropertyAmenity } from '../types'

/**
 * Property Amenities API Functions
 * Manage amenities for properties
 */

export const propertyAmenitiesApi = {
    /**
     * Get all amenities for a property
     */
    async getByPropertyId(propertyId: string): Promise<{ data: PropertyAmenity[] | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('property_amenities')
                .select('*')
                .eq('property_id', propertyId)
                .order('created_at')

            if (error) throw error

            const formattedData = data?.map(amenity => ({
                id: amenity.id,
                propertyId: amenity.property_id,
                label: amenity.label,
                createdAt: new Date(amenity.created_at)
            })) || []

            return { data: formattedData, error: null }
        } catch (error) {
            console.error('Error fetching property amenities:', error)
            return { data: null, error }
        }
    },

    /**
     * Add an amenity to a property
     */
    async create(propertyId: string, label: string): Promise<{ data: PropertyAmenity | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('property_amenities')
                .insert({
                    property_id: propertyId,
                    label
                })
                .select()
                .single()

            if (error) throw error

            const formattedData: PropertyAmenity = {
                id: data.id,
                propertyId: data.property_id,
                label: data.label,
                createdAt: new Date(data.created_at)
            }

            return { data: formattedData, error: null }
        } catch (error) {
            console.error('Error creating property amenity:', error)
            return { data: null, error }
        }
    },

    /**
     * Add multiple amenities to a property
     */
    async createMany(propertyId: string, labels: string[]): Promise<{ data: PropertyAmenity[] | null; error: any }> {
        try {
            const amenities = labels.map(label => ({
                property_id: propertyId,
                label
            }))

            const { data, error } = await supabase
                .from('property_amenities')
                .insert(amenities)
                .select()

            if (error) throw error

            const formattedData = data?.map(amenity => ({
                id: amenity.id,
                propertyId: amenity.property_id,
                label: amenity.label,
                createdAt: new Date(amenity.created_at)
            })) || []

            return { data: formattedData, error: null }
        } catch (error) {
            console.error('Error creating property amenities:', error)
            return { data: null, error }
        }
    },

    /**
     * Delete an amenity
     */
    async delete(id: number): Promise<{ error: any }> {
        try {
            const { error } = await supabase
                .from('property_amenities')
                .delete()
                .eq('id', id)

            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Error deleting property amenity:', error)
            return { error }
        }
    },

    /**
     * Delete all amenities for a property
     */
    async deleteAllForProperty(propertyId: string): Promise<{ error: any }> {
        try {
            const { error } = await supabase
                .from('property_amenities')
                .delete()
                .eq('property_id', propertyId)

            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Error deleting property amenities:', error)
            return { error }
        }
    },

    /**
     * Replace all amenities for a property
     * (Useful for updating amenities list)
     */
    async replaceForProperty(propertyId: string, labels: string[]): Promise<{ data: PropertyAmenity[] | null; error: any }> {
        try {
            // Delete existing amenities
            const deleteResult = await this.deleteAllForProperty(propertyId)
            if (deleteResult.error) throw deleteResult.error

            // Create new amenities
            if (labels.length === 0) {
                return { data: [], error: null }
            }

            return await this.createMany(propertyId, labels)
        } catch (error) {
            console.error('Error replacing property amenities:', error)
            return { data: null, error }
        }
    }
}
