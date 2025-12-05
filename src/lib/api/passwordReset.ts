import { supabase } from '../supabase'
import crypto from 'crypto'

/**
 * Password Reset API
 * Handles forgot password and reset password functionality
 */

const RESET_TOKEN_EXPIRY_MINUTES = 30
const MAX_RESET_REQUESTS_PER_HOUR = 3

interface ResetToken {
    id: string
    userId: string
    token: string
    expiresAt: Date
    used: boolean
    createdAt: Date
}

// Generate secure random token
function generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

// Calculate expiry time
function getExpiryTime(): Date {
    const now = new Date()
    now.setMinutes(now.getMinutes() + RESET_TOKEN_EXPIRY_MINUTES)
    return now
}

export const passwordResetApi = {
    /**
     * Request password reset - calls Supabase Edge Function
     */
    async requestPasswordReset(email: string) {
        try {
            // Get Supabase URL from environment
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

            if (!supabaseUrl) {
                console.error('VITE_SUPABASE_URL not configured')
                return { success: false, error: 'Configuration error' }
            }

            // Call Supabase Edge Function
            const response = await fetch(`${supabaseUrl}/functions/v1/send-password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({ email: email.trim().toLowerCase() })
            })

            const data = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || 'Failed to send reset email'
                }
            }

            return { success: true, error: null }
        } catch (error: any) {
            console.error('Error in requestPasswordReset:', error)
            return { success: false, error: error.message }
        }
    },

    /**
     * Validate reset token
     */
    async validateResetToken(token: string) {
        try {
            const { data: resetToken, error } = await supabase
                .from('password_reset_tokens')
                .select('*')
                .eq('token', token)
                .eq('used', false)
                .single()

            if (error || !resetToken) {
                return { valid: false, error: 'Invalid or expired token' }
            }

            // Check if token is expired
            const now = new Date()
            const expiresAt = new Date(resetToken.expires_at)

            if (now > expiresAt) {
                return { valid: false, error: 'Token has expired' }
            }

            return {
                valid: true,
                userId: resetToken.user_id,
                error: null
            }
        } catch (error: any) {
            console.error('Error validating token:', error)
            return { valid: false, error: error.message }
        }
    },

    /**
     * Reset password with valid token
     */
    async resetPassword(token: string, newPassword: string) {
        try {
            // Validate token first
            const validation = await this.validateResetToken(token)

            if (!validation.valid) {
                return { success: false, error: validation.error }
            }

            // Hash the new password
            const bcrypt = await import('bcryptjs')
            const hashedPassword = await bcrypt.hash(newPassword, 10)

            // Update user password
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    password: hashedPassword,
                    updated_at: new Date().toISOString()
                })
                .eq('id', validation.userId)

            if (updateError) {
                console.error('Error updating password:', updateError)
                return { success: false, error: 'Failed to update password' }
            }

            // Mark token as used
            await supabase
                .from('password_reset_tokens')
                .update({ used: true })
                .eq('token', token)

            return { success: true, error: null }
        } catch (error: any) {
            console.error('Error resetting password:', error)
            return { success: false, error: error.message }
        }
    },

    /**
     * Clean up expired tokens (can be run as a cron job)
     */
    async cleanExpiredTokens() {
        try {
            const now = new Date().toISOString()

            const { error } = await supabase
                .from('password_reset_tokens')
                .delete()
                .lt('expires_at', now)

            if (error) {
                console.error('Error cleaning expired tokens:', error)
                return { success: false, error: error.message }
            }

            return { success: true, error: null }
        } catch (error: any) {
            console.error('Error in cleanExpiredTokens:', error)
            return { success: false, error: error.message }
        }
    }
}
