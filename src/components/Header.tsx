import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/context/AuthContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 text-primary-blue font-bold text-2xl">
              <span>{t('header.brand')}</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/sell"
                className="text-gray-600 hover:text-primary-blue transition-colors font-medium"
              >
                {t('header.sell')}
              </Link>

              <Link
                to="/rent"
                className="text-gray-600 hover:text-primary-blue transition-colors font-medium"
              >
                {t('header.rent')}
              </Link>

              <Link
                to="/agents"
                className="text-gray-600 hover:text-primary-blue transition-colors font-medium"
              >
                {t('header.agents')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
                {user?.userType === 'buyer' && (
                  <Link
                    to="/my-interests"
                    className="hidden md:block text-gray-600 hover:text-primary-blue transition-colors font-medium"
                  >
                    {t('header.myInterests')}
                  </Link>
                )}
                {user?.userType === 'marketer' && (
                  <Link
                    to="/dashboard/listings"
                    className="hidden md:block text-gray-600 hover:text-primary-blue transition-colors font-medium"
                  >
                    {t('header.dashboard')}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-blue transition-colors font-medium"
                >
                  <span>{user?.fullName}</span>
                  <span className="text-gray-400">|</span>
                  <span>{t('header.logout')}</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors bg-white"
                >
                  {t('header.login')}
                </Link>
                <Link
                  to="/register/buyer"
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  {t('header.signUp')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
