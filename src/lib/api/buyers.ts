import { supabase } from '../supabase'
import type { Buyer } from '../types'

/**
 * Buyers API
 * Handles buyer profile operations
 */

// Format database row to Buyer interface
function formatBuyer(row: any): Buyer {
    return {
        id: row.id,
        userId: row.user_id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        password: row.password,
        budget: Number(row.budget),
        locations: row.locations || [],
        propertyTypes: row.property_types || [],
        buyingIntent: row.buying_intent,
        score: row.score,
        scoreTier: row.score_tier,
        createdAt: new Date(row.created_at)
    }
}

export const buyerApi = {
    /**
     * Get buyer by email (old flow - backwards compatibility)
     */
    async getBuyerByEmail(email: string) {
        try {
            const { data, error } = await supabase
                .from('buyers')
                .select('*')
                .eq('email', email.toLowerCase())
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return { data: null, error: null }
                }
                throw error
            }

            return { data: data ? formatBuyer(data) : null, error: null }
        } catch (error: any) {
            console.error('Error fetching buyer by email:', error)
            return { data: null, error }
        }
    },

    /**
     * Get buyer by user_id (new flow)
     */
    async getBuyerByUserId(userId: string) {
        try {
            const { data, error } = await supabase
                .from('buyers')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return { data: null, error: null }
                }
                throw error
            }

            return { data: data ? formatBuyer(data) : null, error: null }
        } catch (error: any) {
            console.error('Error fetching buyer by user_id:', error)
            return { data: null, error }
        }
    },

    /**
     * Get buyer by ID
     */
    async getBuyerById(id: string) {
        try {
            const { data, error } = await supabase
                .from('buyers')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            return { data: data ? formatBuyer(data) : null, error: null }
        } catch (error: any) {
            console.error('Error fetching buyer:', error)
            return { data: null, error }
        }
    },

    /**
     * Create buyer profile (new two-step registration)
     * Used in Step 2 after user account is created
     */
    async createBuyerProfile(profileData: {
        userId: string
        fullName: string
        phone: string
        budget: number
        locations: string[]
        propertyTypes: string[]
        buyingIntent?: 'Cash' | 'Installment' | 'Mortgage'
    }) {
        try {
            // Get user email to store in buyer record (for backwards compat)
            const { data: userData } = await supabase
                .from('users')
                .select('email, password')
                .eq('id', profileData.userId)
                .single()

            if (!userData) {
                throw new Error('User not found')
            }

            const { data, error } = await supabase
                .from('buyers')
                .insert({
                    user_id: profileData.userId,
                    full_name: profileData.fullName,
                    email: userData.email,
                    password: userData.password, // Copy for backwards compat
                    phone: profileData.phone,
                    budget: profileData.budget,
                    locations: profileData.locations,
                    property_types: profileData.propertyTypes,
                    buying_intent: profileData.buyingIntent || null,
                    score: 0,
                    score_tier: 'Cold'
                })
                .select()
                .single()

            if (error) throw error

            return { data: data ? formatBuyer(data) : null, error: null }
        } catch (error: any) {
            console.error('Error creating buyer profile:', error)
            return { data: null, error }
        }
    },

    /**
     * Create buyer (old flow - backwards compatibility)
     * Creates both user and buyer profile in one step
     */
    async createBuyer(buyerData: Omit<Buyer, 'id' | 'score' | 'scoreTier' | 'createdAt'>) {
        try {
            const { data, error } = await supabase
                .from('buyers')
                .insert({
                    full_name: buyerData.fullName,
                    email: buyerData.email,
                    phone: buyerData.phone,
                    password: buyerData.password,
                    budget: buyerData.budget,
                    locations: buyerData.locations,
                    property_types: buyerData.propertyTypes,
                    buying_intent: buyerData.buyingIntent || null,
                    score: 0,
                    score_tier: 'Cold'
                })
                .select()
                .single()

            if (error) throw error

            return { data: data ? formatBuyer(data) : null, error: null }
        } catch (error: any) {
            console.error('Error creating buyer:', error)
            return { data: null, error }
        }
    },

    /**
     * Update buyer profile
     */
    async updateBuyer(id: string, updates: Partial<Buyer>) {
        try {
            const dbData: any = {}
            if (updates.fullName) dbData.full_name = updates.fullName
            if (updates.phone) dbData.phone = updates.phone
            if (updates.budget) dbData.budget = updates.budget
            if (updates.locations) dbData.locations = updates.locations
            if (updates.propertyTypes) dbData.property_types = updates.propertyTypes
            if (updates.buyingIntent) dbData.buying_intent = updates.buyingIntent

            const { data, error } = await supabase
                .from('buyers')
                .update(dbData)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            return { data: data ? formatBuyer(data) : null, error: null }
        } catch (error: any) {
            console.error('Error updating buyer:', error)
            return { data: null, error }
        }
    },

    /**
     * Update buyer score
     */
    async updateBuyerScore(id: string, score: number) {
        try {
            let scoreTier: 'Hot' | 'Warm' | 'Cold'
            if (score >= 70) scoreTier = 'Hot'
            else if (score >= 40) scoreTier = 'Warm'
            else scoreTier = 'Cold'

            const { error } = await supabase
                .from('buyers')
                .update({ score, score_tier: scoreTier })
                .eq('id', id)

            if (error) throw error

            return { error: null }
        } catch (error: any) {
            console.error('Error updating buyer score:', error)
            return { error }
        }
    }
}
