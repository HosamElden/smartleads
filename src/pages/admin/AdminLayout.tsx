import { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/context/AuthContext'

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Access control - only admin users can access
    useEffect(() => {
        if (!user || user.userType !== 'admin') {
            navigate('/')
        }
    }, [user, navigate])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/')
    }

    const navSections = [
        {
            title: 'Dashboard',
            items: [
                {
                    path: '/admin',
                    label: 'Admin Overview',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    )
                },
                {
                    path: '/dashboard',
                    label: 'Marketer Analytics',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )
                }
            ]
        },
        {
            title: 'Property Management',
            items: [
                {
                    path: '/properties',
                    label: 'Browse Properties',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )
                },
                {
                    path: '/dashboard/listings',
                    label: 'Property Listings',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    )
                },
                {
                    path: '/dashboard/add-property',
                    label: 'Add New Property',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    )
                }
            ]
        },
        {
            title: 'Users & Leads',
            items: [
                {
                    path: '/dashboard/leads',
                    label: 'Leads',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    )
                }
            ]
        },
        {
            title: 'Content Management',
            items: [
                {
                    path: '/dashboard/developers',
                    label: 'Developers',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    )
                },
                {
                    path: '/dashboard/projects',
                    label: 'Projects',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    )
                }
            ]
        },
        {
            title: 'System Settings',
            items: [
                {
                    path: '/admin/lookups',
                    label: 'Lookup Tables',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    )
                },
                {
                    path: '/admin/areas',
                    label: 'Areas',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )
                }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        {/* Admin Header */}
                        <div className="flex items-center flex-shrink-0 px-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center font-bold text-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-semibold">Admin Panel</p>
                                <p className="text-xs text-purple-200">{user?.fullName}</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-2 space-y-1">
                            {navSections.map((section, idx) => (
                                <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
                                    {section.title && (
                                        <h3 className="px-3 text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
                                            {section.title}
                                        </h3>
                                    )}
                                    {section.items.map((item) => {
                                        const active = isActive(item.path)
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-1 ${active
                                                    ? 'bg-purple-700 text-white'
                                                    : 'text-purple-100 hover:bg-purple-700/50'
                                                    }`}
                                            >
                                                <span className={active ? 'text-white' : 'text-purple-300 group-hover:text-white'}>
                                                    {item.icon}
                                                </span>
                                                <span className="ml-3">{item.label}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            ))}
                        </nav>

                        {/* Logout Button */}
                        <div className="px-2 pt-4 border-t border-purple-700">
                            <button
                                onClick={handleLogout}
                                className="group w-full flex items-center px-3 py-3 text-sm font-medium text-purple-100 hover:bg-purple-700/50 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="ml-3">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-40 flex">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)} />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-purple-900 to-purple-800 text-white">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            {/* Mobile Header */}
                            <div className="flex items-center flex-shrink-0 px-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center font-bold text-lg">
                                    ⚙️
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-semibold">Admin Panel</p>
                                    <p className="text-xs text-purple-200">{user?.fullName}</p>
                                </div>
                            </div>

                            {/* Mobile Navigation */}
                            <nav className="px-2 space-y-1">
                                {navSections.map((section, idx) => (
                                    <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
                                        {section.title && (
                                            <h3 className="px-3 text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
                                                {section.title}
                                            </h3>
                                        )}
                                        {section.items.map((item) => {
                                            const active = isActive(item.path)
                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setIsSidebarOpen(false)}
                                                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 ${active
                                                        ? 'bg-purple-700 text-white'
                                                        : 'text-purple-100 hover:bg-purple-700/50'
                                                        }`}
                                                >
                                                    {item.icon}
                                                    <span className="ml-3">{item.label}</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Mobile Logout */}
                        <div className="px-2 pb-4 border-t border-purple-700">
                            <button
                                onClick={handleLogout}
                                className="group w-full flex items-center px-3 py-3 text-sm font-medium text-purple-100 hover:bg-purple-700/50 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="ml-3">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-purple-900">Admin Panel</h1>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
