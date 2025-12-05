import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { t } = useTranslation('home')
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/properties')
  }

  return (
    <section 
      className="relative text-white py-32 px-4"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            {t('hero.subtitle')}
          </p>
        </div>

        <form 
          onSubmit={handleSearch} 
          className="bg-white rounded-xl shadow-2xl p-4 max-w-4xl mx-auto"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('hero.searchPlaceholder')}
              className="flex-1 px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 text-lg"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-smooth shadow-md hover:shadow-lg whitespace-nowrap"
            >
              {t('hero.searchButton')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
