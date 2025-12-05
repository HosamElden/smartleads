// Supabase Edge Function for sending password reset emails
// Deploy with: supabase functions deploy send-password-reset

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { email } = await req.json()

        if (!email) {
            return new Response(
                JSON.stringify({ success: false, error: 'Email is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Check if user exists
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', email.toLowerCase().trim())
            .single()

        if (userError || !user) {
            // Don't reveal if email exists (security)
            console.log('User not found, but returning success')
            return new Response(
                JSON.stringify({ success: true }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Check rate limiting - max 3 requests per hour
        const oneHourAgo = new Date()
        oneHourAgo.setHours(oneHourAgo.getHours() - 1)

        const { data: recentTokens } = await supabase
            .from('password_reset_tokens')
            .select('id')
            .eq('user_id', user.id)
            .gte('created_at', oneHourAgo.toISOString())

        if (recentTokens && recentTokens.length >= 3) {
            return new Response(
                JSON.stringify({ success: false, error: 'Too many reset requests. Please try again later.' }),
                { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Generate secure token
        const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '')

        // Set expiration (30 minutes)
        const expiresAt = new Date()
        expiresAt.setMinutes(expiresAt.getMinutes() + 30)

        // Store token
        const { error: tokenError } = await supabase
            .from('password_reset_tokens')
            .insert({
                user_id: user.id,
                token,
                expires_at: expiresAt.toISOString()
            })

        if (tokenError) {
            console.error('Error creating token:', tokenError)
            return new Response(
                JSON.stringify({ success: false, error: 'Failed to create reset token' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Send email via Resend
        const resendApiKey = Deno.env.get('RESEND_API_KEY')
        const appUrl = Deno.env.get('APP_URL') || 'http://localhost:5173'
        const resetLink = `${appUrl}/auth/reset-password?token=${token}`

        if (!resendApiKey) {
            console.error('RESEND_API_KEY not configured')
            // For development, just log the link
            console.log('Password reset link:', resetLink)
            return new Response(
                JSON.stringify({ success: true, resetLink }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'SmartLeads <noreply@smartleads.com>',
                to: [email],
                subject: 'Reset Your SmartLeads Password',
                html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #2563eb;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                  margin: 20px 0;
                }
                .footer {
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #eee;
                  font-size: 12px;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Reset Your SmartLeads Password</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password for your SmartLeads account.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetLink}" class="button">Reset Password</a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="color: #666; font-size: 12px;">${resetLink}</p>
                <p><strong>This link will expire in 30 minutes.</strong></p>
                <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                <div class="footer">
                  <p>Thanks,<br>SmartLeads Team</p>
                  <p>This is an automated email, please do not reply.</p>
                </div>
              </div>
            </body>
          </html>
        `,
            }),
        })

        if (!resendResponse.ok) {
            const errorData = await resendResponse.text()
            console.error('Resend API error:', errorData)
            // Still return success to prevent email enumeration
            return new Response(
                JSON.stringify({ success: true }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log('Password reset email sent successfully to:', email)

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Edge function error:', error)
        return new Response(
            JSON.stringify({ success: false, error: 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
