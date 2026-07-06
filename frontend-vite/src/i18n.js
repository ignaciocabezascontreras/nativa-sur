import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Auto-discovery de locales (patrón Vanellix)
// Agrega un archivo en locales/es/<modulo>.json y se registra solo.
const esModules = import.meta.glob('./locales/es/*.json', { eager: true });
const enModules = import.meta.glob('./locales/en/*.json', { eager: true });

function buildNamespace(modules) {
  const ns = {};
  for (const [path, mod] of Object.entries(modules)) {
    const key = path.replace(/^.*\/([^/]+)\.json$/, '$1');
    ns[key] = mod.default ?? mod;
  }
  return ns;
}

i18n.use(initReactI18next).init({
  lng: 'es',
  fallbackLng: 'en',
  resources: {
    es: { translation: buildNamespace(esModules) },
    en: { translation: buildNamespace(enModules) },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
