import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ConnectionTest() {
    const [status, setStatus] = useState('Testing...')
    const [results, setResults] = useState<any[]>([])
    const [error, setError] = useState('')

    useEffect(() => {
        testConnection()
    }, [])

    const testConnection = async () => {
        const testResults: any[] = []

        // Test 1: Check environment variables
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

        testResults.push({
            test: 'Environment Variables',
            status: supabaseUrl && supabaseKey ? 'PASS' : 'FAIL',
            details: supabaseUrl && supabaseKey
                ? `URL: ${supabaseUrl}`
                : 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env file'
        })

        if (!supabaseUrl || !supabaseKey) {
            setStatus('Configuration Error')
            setResults(testResults)
            setError('Please check your .env file')
            return
        }

        // Test 2: Database connection
        try {
            const { error: connectionError } = await supabase
                .from('buyers')
                .select('count')
                .limit(1)

            if (connectionError) {
                if (connectionError.message.includes('relation') || connectionError.message.includes('does not exist')) {
                    testResults.push({
                        test: 'Database Connection',
                        status: 'WARN',
                        details: 'Connected but base tables not found. Run migrations/000_BASE_SCHEMA.sql'
                    })
                } else {
                    throw connectionError
                }
            } else {
                testResults.push({
                    test: 'Database Connection',
                    status: 'PASS',
                    details: 'Successfully connected to Supabase'
                })

                // Test 3: Check base tables
                const baseTables = ['buyers', 'marketers', 'properties', 'leads']
                for (const table of baseTables) {
                    try {
                        const { error } = await supabase
                            .from(table)
                            .select('count')
                            .limit(1)

                        testResults.push({
                            test: `Table: ${table}`,
                            status: error ? 'FAIL' : 'PASS',
                            details: error ? error.message : 'Table exists'
                        })
                    } catch (err: any) {
                        testResults.push({
                            test: `Table: ${table}`,
                            status: 'FAIL',
                            details: err.message
                        })
                    }
                }

                // Test 4: Check enhancement tables
                const enhancementTables = ['developers', 'projects', 'offer_types', 'ownerships', 'property_types', 'property_amenities']
                for (const table of enhancementTables) {
                    try {
                        const { error } = await supabase
                            .from(table)
                            .select('count')
                            .limit(1)

                        testResults.push({
                            test: `Enhancement: ${table}`,
                            status: error ? 'WARN' : 'PASS',
                            details: error
                                ? 'Not found. Run migrations/COMPLETE_MIGRATION.sql'
                                : 'Table exists'
                        })
                    } catch (err: any) {
                        testResults.push({
                            test: `Enhancement: ${table}`,
                            status: 'WARN',
                            details: 'Not found. Run migrations/COMPLETE_MIGRATION.sql'
                        })
                    }
                }

                // Test 5: Check seed data
                try {
                    const { data: offerTypes } = await supabase.from('offer_types').select('count')
                    const { data: ownerships } = await supabase.from('ownerships').select('count')
                    const { data: propertyTypes } = await supabase.from('property_types').select('count')

                    testResults.push({
                        test: 'Seed Data',
                        status: offerTypes && ownerships && propertyTypes ? 'PASS' : 'WARN',
                        details: offerTypes && ownerships && propertyTypes
                            ? `${offerTypes.length} offer types, ${ownerships.length} ownerships, ${propertyTypes.length} property types`
                            : 'Lookup tables empty or missing'
                    })
                } catch (err) {
                    testResults.push({
                        test: 'Seed Data',
                        status: 'WARN',
                        details: 'Could not check seed data'
                    })
                }
            }

            setStatus('Tests Complete')
            setResults(testResults)

        } catch (err: any) {
            testResults.push({
                test: 'Database Connection',
                status: 'FAIL',
                details: err.message
            })
            setStatus('Connection Failed')
            setError(err.message)
            setResults(testResults)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PASS': return 'text-green-600 bg-green-50'
            case 'FAIL': return 'text-red-600 bg-red-50'
            case 'WARN': return 'text-yellow-600 bg-yellow-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Supabase Connection Test
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Status: <span className="font-semibold">{status}</span>
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                            <p className="font-semibold">Error:</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg"
                            >
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{result.test}</p>
                                    <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(result.status)}`}
                                >
                                    {result.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    {results.length === 0 && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mb-4"></div>
                            <p className="text-gray-600">Running connection tests...</p>
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="font-semibold text-blue-900 mb-2">Next Steps:</p>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>If base tables missing: Run <code className="bg-blue-100 px-1 rounded">migrations/000_BASE_SCHEMA.sql</code> in Supabase SQL Editor</li>
                            <li>If enhancement tables missing: Run <code className="bg-blue-100 px-1 rounded">migrations/COMPLETE_MIGRATION.sql</code></li>
                            <li>Refresh this page after running migrations</li>
                        </ul>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={testConnection}
                            className="px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Re-run Tests
                        </button>
                        <a
                            href="/dashboard"
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Back to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
