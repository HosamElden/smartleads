/* ============================================
   ADMIN USER FIX - RUN THIS IN SUPABASE
   ============================================
   
   This will DELETE the old admin user (if exists)
   and create a fresh one with a working password.
*/

-- Step 1: Delete old admin user (if exists)
DELETE FROM users WHERE email = 'admin@smartleads.com';

-- Step 2: Create fresh admin user with new password hash
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
    '$2b$10$6IgNMIOHqovQRkb3cOSNSuYLRtFvi40ULoe5i6tIXorp2rjRQ4w4K',
    'admin',
    true,
    true,
    now(),
    now()
);

-- Step 3: Verify the user was created
SELECT id, email, user_type, is_active, email_verified, 
       LEFT(password, 20) as password_preview
FROM users 
WHERE email = 'admin@smartleads.com';

/* 
   LOGIN CREDENTIALS:
   Email: admin@smartleads.com
   Password: Admin@123
   
   After running this SQL, try logging in again.
*/
