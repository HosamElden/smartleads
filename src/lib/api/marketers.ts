import { supabase } from '../supabase'
import type { Marketer } from '../types'

/**
 * Marketers API
 * Handles marketer profile operations
 */

// Format database row to Marketer interface
function formatMarketer(row: any): Marketer {
    return {
        id: row.id,
        userId: row.user_id,
        fullName: row.full_name,
        companyName: row.company_name,
        email: row.email,
        phone: row.phone,
        password: row.password,
        role: row.role,
        officeLocation: row.office_location,
        createdAt: new Date(row.created_at)
    }
}

export const marketerApi = {
    /**
     * Get marketer by email (old flow - backwards compatibility)
     */
    async getMarketerByEmail(email: string) {
        try {
            const { data, error } = await supabase
                .from('marketers')
                .select('*')
                .eq('email', email.toLowerCase())
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return { data: null, error: null }
                }
                throw error
            }

            return { data: data ? formatMarketer(data) : null, error: null }
        } catch (error: any) {
            console.error('Error fetching marketer by email:', error)
            return { data: null, error }
        }
    },

    /**
     * Get marketer by user_id (new flow)
     */
    async getMarketerByUserId(userId: string) {
        try {
            const { data, error } = await supabase
                .from('marketers')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return { data: null, error: null }
                }
                throw error
            }

            return { data: data ? formatMarketer(data) : null, error: null }
        } catch (error: any) {
            console.error('Error fetching marketer by user_id:', error)
            return { data: null, error }
        }
    },

    /**
     * Get marketer by ID
     */
    async getMarketerById(id: string) {
        try {
            const { data, error } = await supabase
                .from('marketers')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            return { data: data ? formatMarketer(data) : null, error: null }
        } catch (error: any) {
            console.error('Error fetching marketer:', error)
            return { data: null, error }
        }
    },

    /**
     * Create marketer profile (new two-step registration)
     * Used in Step 2 after user account is created
     */
    async createMarketerProfile(profileData: {
        userId: string
        fullName: string
        companyName?: string
        phone: string
        officeLocation: string
        role: 'Marketer' | 'Developer'
    }) {
        try {
            // Get user email to store in marketer record (for backwards compat)
            const { data: userData } = await supabase
                .from('users')
                .select('email, password')
                .eq('id', profileData.userId)
                .single()

            if (!userData) {
                throw new Error('User not found')
            }

            const { data, error } = await supabase
                .from('marketers')
                .insert({
                    user_id: profileData.userId,
                    full_name: profileData.fullName,
                    company_name: profileData.companyName || null,
                    email: userData.email,
                    password: userData.password, // Copy for backwards compat
                    phone: profileData.phone,
                    office_location: profileData.officeLocation,
                    role: profileData.role
                })
                .select()
                .single()

            if (error) throw error

            return { data: data ? formatMarketer(data) : null, error: null }
        } catch (error: any) {
            console.error('Error creating marketer profile:', error)
            return { data: null, error }
        }
    },

    /**
     * Create marketer (old flow - backwards compatibility)
     * Creates both user and marketer profile in one step
     */
    async createMarketer(marketerData: Omit<Marketer, 'id' | 'createdAt'>) {
        try {
            const { data, error } = await supabase
                .from('marketers')
                .insert({
                    full_name: marketerData.fullName,
                    company_name: marketerData.companyName || null,
                    email: marketerData.email,
                    phone: marketerData.phone,
                    password: marketerData.password,
                    office_location: marketerData.officeLocation,
                    role: marketerData.role
                })
                .select()
                .single()

            if (error) throw error

            return { data: data ? formatMarketer(data) : null, error: null }
        } catch (error: any) {
            console.error('Error creating marketer:', error)
            return { data: null, error }
        }
    },

    /**
     * Update marketer profile
     */
    async updateMarketer(id: string, updates: Partial<Marketer>) {
        try {
            const dbData: any = {}
            if (updates.fullName) dbData.full_name = updates.fullName
            if (updates.companyName !== undefined) dbData.company_name = updates.companyName
            if (updates.phone) dbData.phone = updates.phone
            if (updates.officeLocation) dbData.office_location = updates.officeLocation
            if (updates.role) dbData.role = updates.role

            const { data, error } = await supabase
                .from('marketers')
                .update(dbData)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            return { data: data ? formatMarketer(data) : null, error: null }
        } catch (error: any) {
            console.error('Error updating marketer:', error)
            return { data: null, error }
        }
    },

    /**
     * Get all marketers (admin use)
     */
    async getAllMarketers() {
        try {
            const { data, error } = await supabase
                .from('marketers')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            return { data: data?.map(formatMarketer) || [], error: null }
        } catch (error: any) {
            console.error('Error fetching all marketers:', error)
            return { data: null, error }
        }
    }
}
