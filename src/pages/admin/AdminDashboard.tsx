export default function AdminDashboard() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage system settings and data</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Lookup Tables Card */}
                <a
                    href="/admin/lookups"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-purple-500"
                >
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </div>
                        <h3 className="ml-4 text-lg font-semibold text-gray-900">Lookup Tables</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Manage offer types, ownership types, and property types
                    </p>
                    <div className="mt-4 text-purple-600 font-medium flex items-center">
                        Manage →
                    </div>
                </a>

                {/* Statistics Card */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="ml-4 text-lg font-semibold">System Info</h3>
                    </div>
                    <p className="text-white/90 text-sm">
                        SmartLeads Platform v1.0
                    </p>
                    <p className="text-white/75 text-xs mt-2">
                        Database status: Healthy ✓
                    </p>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="ml-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="space-y-2">
                        <a href="/dashboard" className="block text-sm text-gray-600 hover:text-purple-600">
                            → Go to Dashboard
                        </a>
                        <a href="/dashboard/developers" className="block text-sm text-gray-600 hover:text-purple-600">
                            → Manage Developers
                        </a>
                        <a href="/dashboard/projects" className="block text-sm text-gray-600 hover:text-purple-600">
                            → Manage Projects
                        </a>
                    </div>
                </div>
            </div>

            {/* Welcome Message */}
            <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Welcome to the Admin Panel</h3>
                <p className="text-purple-700 text-sm">
                    Use this panel to manage system-wide settings and data. Start by managing lookup tables for properties, offer types, and ownership categories.
                </p>
            </div>
        </div>
    )
}
