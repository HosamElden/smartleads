import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import commonEn from '../locales/en/common.json'
import commonAr from '../locales/ar/common.json'
import homeEn from '../locales/en/home.json'
import homeAr from '../locales/ar/home.json'
import propertiesEn from '../locales/en/properties.json'
import propertiesAr from '../locales/ar/properties.json'
import authEn from '../locales/en/auth.json'
import authAr from '../locales/ar/auth.json'
import dashboardEn from '../locales/en/dashboard.json'
import dashboardAr from '../locales/ar/dashboard.json'

const resources = {
    en: {
        common: commonEn,
        home: homeEn,
        properties: propertiesEn,
        auth: authEn,
        dashboard: dashboardEn,
    },
    ar: {
        common: commonAr,
        home: homeAr,
        properties: propertiesAr,
        auth: authAr,
        dashboard: dashboardAr,
    },
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    })

export default i18n
