-- Migration: Create Super Admin User
-- Created: 2025-12-05
-- Description: Creates a super admin user with full permissions to access the admin panel

-- Insert super admin user into users table
-- Email: admin@smartleads.com
-- Password: Admin@123 (hashed with bcrypt)
-- Note: The password hash below is for 'Admin@123' using bcrypt

INSERT INTO users (
    id,
    email,
    password,
    user_type,
    is_active,
    email_verified,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'admin@smartleads.com',
    '$2b$10$hYDb7z6dc2VVtyLXUtKSjuvxLOlqUBq6EXxnmFh4VY.5nJpVam.d6',
    'admin',
    true,
    true,
    now(),
    now()
)
ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    user_type = EXCLUDED.user_type,
    is_active = EXCLUDED.is_active,
    email_verified = EXCLUDED.email_verified,
    updated_at = now();

-- Grant admin user full permissions (if using RLS policies)
-- This is a placeholder - adjust based on your actual RLS setup
