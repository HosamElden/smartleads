import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
    const { i18n } = useTranslation()

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en'
        i18n.changeLanguage(newLang)
    }

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-primary-blue transition-colors rounded-lg hover:bg-gray-100"
            aria-label="Switch language"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
            </svg>
            <span className="hidden md:inline font-medium">
                {i18n.language === 'en' ? 'عربي' : 'English'}
            </span>
        </button>
    )
}
