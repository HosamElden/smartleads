import { supabase } from './src/lib/supabase'
import { userApi } from './src/lib/api/users'

async function testAdminUser() {
    console.log('=== Testing Admin User ===\n')

    // Test 1: Check if admin user exists
    console.log('1. Checking if admin user exists in database...')
    const { data: adminUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'admin@smartleads.com')
        .maybeSingle()

    if (fetchError) {
        console.error('❌ Error fetching admin user:', fetchError)
        return
    }

    if (!adminUser) {
        console.log('❌ Admin user does NOT exist in database!')
        console.log('👉 You need to run the migration SQL in Supabase Dashboard')
        return
    }

    console.log('✅ Admin user exists!')
    console.log('   Email:', adminUser.email)
    console.log('   User Type:', adminUser.user_type)
    console.log('   Is Active:', adminUser.is_active)
    console.log('   Email Verified:', adminUser.email_verified)
    console.log('')

    // Test 2: Verify password
    console.log('2. Testing password verification...')
    const isPasswordValid = await userApi.verifyPassword('Admin@123', adminUser.password)

    if (isPasswordValid) {
        console.log('✅ Password is correct!')
    } else {
        console.log('❌ Password verification FAILED!')
        console.log('   Stored hash:', adminUser.password)
        console.log('   This means the password hash in the database is wrong.')
    }
    console.log('')

    // Test 3: Check user API
    console.log('3. Testing userApi.getUserByEmail...')
    const { data: userFromApi, error: apiError } = await userApi.getUserByEmail('admin@smartleads.com')

    if (apiError) {
        console.error('❌ Error from userApi:', apiError)
    } else if (userFromApi) {
        console.log('✅ userApi successfully retrieved admin user')
        console.log('   User Type:', userFromApi.userType)
    } else {
        console.log('❌ userApi returned null')
    }

    console.log('\n=== Summary ===')
    if (adminUser && isPasswordValid && userFromApi) {
        console.log('✅ Admin user is properly configured!')
        console.log('👉 Try logging in at: http://localhost:5173/auth/login')
        console.log('   Email: admin@smartleads.com')
        console.log('   Password: Admin@123')
    } else {
        console.log('❌ There are issues with the admin user setup.')
        console.log('👉 Run the SQL migration in Supabase Dashboard to fix.')
    }
}

testAdminUser().catch(console.error)
