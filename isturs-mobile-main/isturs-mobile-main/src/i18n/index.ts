import {useSelector} from 'react-redux';
import {selectLanguage} from '../redux/slices/app.slice';
import es from './locales/es';
import en from './locales/en';
import pt from './locales/pt';

const locales = {es, en, pt};

export type Translations = typeof es;

export function useTranslation() {
  const language = useSelector(selectLanguage);
  const t = locales[language] ?? locales.es;
  return {t};
}