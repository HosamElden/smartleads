import { supabase } from '../supabase'
import type { User } from '../types'
import bcrypt from 'bcryptjs'

/**
 * Users API - Centralized authentication
 * Handles all user account operations
 */

// Format database row to User interface
function formatUser(row: any): User {
    return {
        id: row.id,
        email: row.email,
        password: row.password,
        userType: row.user_type,
        isActive: row.is_active,
        emailVerified: row.email_verified,
        lastLogin: row.last_login ? new Date(row.last_login) : undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
    }
}

// Convert User data to database format
function toDbFormat(data: any): any {
    const dbData: any = {}
    if ('email' in data) dbData.email = data.email
    if ('password' in data) dbData.password = data.password
    if ('userType' in data) dbData.user_type = data.userType
    if ('isActive' in data) dbData.is_active = data.isActive
    if ('emailVerified' in data) dbData.email_verified = data.emailVerified
    if ('lastLogin' in data) dbData.last_login = data.lastLogin
    return dbData
}

export const userApi = {
    /**
     * Get user by email
     */
    async getUserByEmail(email: string) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email.toLowerCase())
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    // Not found
                    return { data: null, error: null }
                }
                throw error
            }

            return { data: data ? formatUser(data) : null, error: null }
        } catch (error: any) {
            console.error('Error fetching user by email:', error)
            return { data: null, error }
        }
    },

    /**
     * Get user by ID
     */
    async getUserById(id: string) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            return { data: data ? formatUser(data) : null, error: null }
        } catch (error: any) {
            console.error('Error fetching user by ID:', error)
            return { data: null, error }
        }
    },

    /**
     * Create new user account
     */
    async createUser(userData: {
        email: string
        password: string
        userType: 'buyer' | 'marketer' | 'admin'
    }) {
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10)

            const { data, error } = await supabase
                .from('users')
                .insert({
                    email: userData.email.toLowerCase(),
                    password: hashedPassword,
                    user_type: userData.userType,
                    is_active: true,
                    email_verified: false
                })
                .select()
                .single()

            if (error) throw error

            return { data: data ? formatUser(data) : null, error: null }
        } catch (error: any) {
            console.error('Error creating user:', error)
            return { data: null, error }
        }
    },

    /**
     * Update user
     */
    async updateUser(id: string, updates: {
        email?: string
        password?: string
        isActive?: boolean
        emailVerified?: boolean
        lastLogin?: Date
    }) {
        try {
            const dbData = toDbFormat(updates)

            // Hash password if being updated
            if (updates.password) {
                dbData.password = await bcrypt.hash(updates.password, 10)
            }

            const { data, error } = await supabase
                .from('users')
                .update(dbData)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            return { data: data ? formatUser(data) : null, error: null }
        } catch (error: any) {
            console.error('Error updating user:', error)
            return { data: null, error }
        }
    },

    /**
     * Update last login timestamp
     */
    async updateLastLogin(id: string) {
        try {
            const { error } = await supabase
                .from('users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', id)

            if (error) throw error

            return { error: null }
        } catch (error: any) {
            console.error('Error updating last login:', error)
            return { error }
        }
    },

    /**
     * Verify password
     */
    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword)
        } catch (error) {
            console.error('Error verifying password:', error)
            return false
        }
    },

    /**
     * Check if email exists
     */
    async emailExists(email: string): Promise<boolean> {
        try {
            const { data } = await supabase
                .from('users')
                .select('id')
                .eq('email', email.toLowerCase())
                .single()

            return !!data
        } catch (error) {
            return false
        }
    },

    /**
     * Deactivate user account
     */
    async deactivateUser(id: string) {
        try {
            const { error } = await supabase
                .from('users')
                .update({ is_active: false })
                .eq('id', id)

            if (error) throw error

            return { error: null }
        } catch (error: any) {
            console.error('Error deactivating user:', error)
            return { error }
        }
    },

    /**
     * Activate user account
     */
    async activateUser(id: string) {
        try {
            const { error } = await supabase
                .from('users')
                .update({ is_active: true })
                .eq('id', id)

            if (error) throw error

            return { error: null }
        } catch (error: any) {
            console.error('Error activating user:', error)
            return { error }
        }
    }
}
