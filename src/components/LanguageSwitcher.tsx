import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const languages = [
    {
        code: 'en',
        name: 'English',
        flag: '🇬🇧',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="2" fill="#012169" />
                <path d="M0 0l32 21.3V0H0z" fill="#fff" />
                <path d="M32 0L0 21.3V32h32V0z" fill="#fff" />
                <path d="M13.3 0v32h5.4V0h-5.4zM0 10.7v10.6h32V10.7H0z" fill="#C8102E" />
                <path d="M0 12.8v6.4h32v-6.4H0z" fill="#fff" />
                <path d="M0 0v4l27.7 18.7H32V18L4.3 0H0zM0 32v-4L27.7 9.3H32V14L4.3 32H0z" fill="#C8102E" />
            </svg>
        )
    },
    {
        code: 'ar',
        name: 'العربية',
        flag: '🇸🇦',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="2" fill="#165E3A" />
                <path d="M8 11h16v2H8v-2zm0 4h12v2H8v-2z" fill="#fff" />
                <path d="M18 19l3-2-3-2v4z" fill="#fff" />
            </svg>
        )
    }
]

export default function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]
    const isRTL = i18n.language === 'ar'

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const changeLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode)
        setIsOpen(false)

        // Update document direction
        document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = langCode
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all bg-white shadow-sm"
                aria-label="Switch language"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-2">
                    {currentLanguage.icon}
                    <span className="font-medium text-sm">{currentLanguage.name}</span>
                </div>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className={`absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fadeIn ${isRTL ? 'left-0' : 'right-0'
                        }`}
                >
                    {languages.map((language) => {
                        const isActive = language.code === i18n.language

                        return (
                            <button
                                key={language.code}
                                onClick={() => changeLanguage(language.code)}
                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${isActive ? 'bg-blue-50' : ''
                                    }`}
                            >
                                {/* Flag/Icon */}
                                <div className="flex-shrink-0">
                                    {language.icon}
                                </div>

                                {/* Language Name */}
                                <div className="flex-1 text-left">
                                    <div className={`text-sm font-medium ${isActive ? 'text-primary-blue' : 'text-gray-900'
                                        }`}>
                                        {language.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {language.code.toUpperCase()}
                                    </div>
                                </div>

                                {/* Checkmark for active language */}
                                {isActive && (
                                    <svg
                                        className="w-5 h-5 text-primary-blue flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
