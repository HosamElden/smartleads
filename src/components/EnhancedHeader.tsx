import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/context/AuthContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function EnhancedHeader() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const [isScrolled, setIsScrolled] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      setIsScrolled(currentScrollY > 10)

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
    setIsUserDropdownOpen(false)
  }

  const getUserInitials = () => {
    if (!user?.fullName) return 'U'
    const names = user.fullName.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return user.fullName.substring(0, 2).toUpperCase()
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-header-scrolled shadow-lg'
        : 'bg-white border-b border-gray-200'
        } ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center gap-2 font-bold text-xl transition-colors ${isScrolled ? 'text-header-accent' : 'text-primary-blue'
              }`}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{t('header.brand')}</span>
          </Link>

          {/* Desktop Navigation */}


          {/* Right Section */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <>
                {user?.userType === 'buyer' && (
                  <Link
                    to="/my-interests"
                    className={`hidden md:block transition-colors ${isScrolled ? 'text-white hover:text-header-accent' : 'text-gray-700 hover:text-primary-blue'
                      }`}
                  >
                    {t('header.myInterests')}
                  </Link>
                )}
                {user?.userType === 'marketer' && (
                  <Link
                    to="/dashboard/listings"
                    className={`hidden md:block transition-colors ${isScrolled ? 'text-white hover:text-header-accent' : 'text-gray-700 hover:text-primary-blue'
                      }`}
                  >
                    {t('header.dashboard')}
                  </Link>
                )}
                {user?.userType === 'admin' && (
                  <Link
                    to="/admin"
                    className={`hidden md:block transition-colors ${isScrolled ? 'text-white hover:text-header-accent' : 'text-gray-700 hover:text-primary-blue'
                      }`}
                  >
                    Admin Panel
                  </Link>
                )}

                {/* User Dropdown */}
                <div ref={dropdownRef} className="relative hidden md:block">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth ${isScrolled
                      ? 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
                      : 'bg-white hover:bg-gray-50 border border-gray-300'
                      }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-header-accent text-header-scrolled flex items-center justify-center font-bold text-sm">
                      {getUserInitials()}
                    </div>
                    <span className="text-sm">
                      {t('header.hello')}, {user?.fullName?.split(' ')[0]}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 animate-fadeIn border border-gray-200">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {t('header.dashboard')}
                      </Link>
                      {user?.userType === 'marketer' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-purple-600 hover:bg-purple-50 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {t('header.logout')}
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Logout */}
                <button
                  onClick={handleLogout}
                  className={`md:hidden flex items-center gap-2 px-4 py-2 transition-colors ${isScrolled ? 'text-white hover:text-header-accent' : 'text-gray-700 hover:text-primary-blue'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <Link
                to="/auth/login"
                className={`flex items-center gap-2 px-4 py-2 transition-colors ${isScrolled ? 'text-white hover:text-header-accent' : 'text-gray-700 hover:text-primary-blue'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>{t('header.login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
