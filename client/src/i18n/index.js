import { createI18n } from 'vue-i18n'
import pl from './pl.js'
import en from './en.js'
import lt from './lt.js'
import ru from './ru.js'
import de from './de.js'

const savedLocale = localStorage.getItem('am-locale') || 'en'

const i18n = createI18n({
  legacy: false,        // Use Composition API mode
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { pl, en, lt, ru, de },
  numberFormats: {
    pl: { currency: { style: 'currency', currency: 'PLN', notation: 'standard' } },
    en: { currency: { style: 'currency', currency: 'EUR', notation: 'standard' } },
    lt: { currency: { style: 'currency', currency: 'EUR', notation: 'standard' } },
    ru: { currency: { style: 'currency', currency: 'EUR', notation: 'standard' } },
    de: { currency: { style: 'currency', currency: 'EUR', notation: 'standard' } }
  }
})

export default i18n
