import { supabase } from './src/lib/supabase.js'

console.log('🔍 Testing Supabase Connection...\n')

// Test 1: Check if credentials are loaded
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('📋 Configuration Check:')
console.log(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Loaded' : '❌ Missing'}`)
console.log(`   VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Loaded' : '❌ Missing'}`)

if (supabaseUrl) {
    console.log(`   URL: ${supabaseUrl}`)
}
if (supabaseKey) {
    console.log(`   Key: ${supabaseKey.substring(0, 20)}...${supabaseKey.substring(supabaseKey.length - 10)}`)
}

console.log('\n🔌 Testing Database Connection...\n')

// Test 2: Try to query database
async function testConnection() {
    try {
        // Test basic connection
        const { data, error } = await supabase
            .from('buyers')
            .select('count')
            .limit(1)

        if (error) {
            if (error.message.includes('relation') || error.message.includes('does not exist')) {
                console.log('⚠️  Database connected but tables not created yet')
                console.log('   Error:', error.message)
                console.log('\n📝 Next Step: Run migrations in Supabase SQL Editor:')
                console.log('   1. migrations/000_BASE_SCHEMA.sql')
                console.log('   2. migrations/COMPLETE_MIGRATION.sql')
                return
            }
            throw error
        }

        console.log('✅ Database connection successful!')
        console.log('✅ Tables exist and are accessible')

        // Test 3: Check if enhancement tables exist
        console.log('\n🔍 Checking for enhancement tables...\n')

        const tables = ['developers', 'projects', 'offer_types']
        for (const table of tables) {
            const { data, error } = await supabase
                .from(table)
                .select('count')
                .limit(1)

            if (error) {
                console.log(`   ❌ ${table}: Not found`)
                console.log(`      Run: migrations/COMPLETE_MIGRATION.sql`)
            } else {
                console.log(`   ✅ ${table}: Exists`)
            }
        }

        console.log('\n✅ Connection test complete!')

    } catch (err) {
        console.error('❌ Connection failed!')
        console.error('   Error:', err.message)
        console.log('\n🔧 Troubleshooting:')
        console.log('   1. Check your .env file has correct values')
        console.log('   2. Verify VITE_SUPABASE_URL format: https://xxxxx.supabase.co')
        console.log('   3. Verify VITE_SUPABASE_ANON_KEY is the "anon public" key')
        console.log('   4. Restart dev server: npm run dev')
    }
}

testConnection()
