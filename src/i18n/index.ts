import {useSelector} from 'react-redux';
import {selectLanguage} from '../redux/slices/app.slice';
import es from './locales/es';
import en from './locales/en';
import pt from './locales/pt';

export type Language = 'es' | 'en' | 'pt';
export type Translations = typeof es;

const translations: Record<Language, Translations> = {es, en, pt};

export function useTranslation() {
  const language = useSelector(selectLanguage) as Language;
  const t = translations[language] ?? translations.es;
  return {t, language};
}
