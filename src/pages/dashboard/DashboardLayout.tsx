import { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/context/AuthContext'

export default function DashboardLayout() {
  const { t } = useTranslation(['dashboard', 'common'])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Restrict dashboard to marketers and admins
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login')
      return
    }

    if (user?.userType !== 'marketer' && user?.userType !== 'admin') {
      // Redirect buyers to properties page
      navigate('/properties')
      return
    }
  }, [user, isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navItems = [
    {
      path: '/dashboard',
      label: t('dashboard:nav.dashboard'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: '/properties',
      label: t('dashboard:nav.browseProperties'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      path: '/dashboard/listings',
      label: t('dashboard:nav.myListings'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      path: '/dashboard/leads',
      label: t('dashboard:nav.leads'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      path: '/dashboard/developers',
      label: t('dashboard:nav.developers'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      path: '/dashboard/projects',
      label: t('dashboard:nav.projects'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      path: '/dashboard/add-property',
      label: t('dashboard:nav.addProperty'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* User Info */}
            <div className="flex items-center flex-shrink-0 px-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                {user?.fullName?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.userType}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${active
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <span className={active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}>
                      {item.icon}
                    </span>
                    <span className="ml-3">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Logout Button */}
            <div className="px-2 pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="group w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="ml-3">{t('common:header.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
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
              {/* Mobile User Info */}
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  {user?.fullName?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.userType}</p>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="px-2 space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${active
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Mobile Logout */}
            <div className="px-2 pb-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="group w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="ml-3">{t('common:header.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-900">{t('dashboard:title')}</h1>
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
