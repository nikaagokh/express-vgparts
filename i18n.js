import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supportedLanguages = ['en', 'ka'];

i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        preload: supportedLanguages,
        ns: ['translations'],
        defaultNS: 'translations',
        backend: {
            loadPath: `${__dirname}/locales/{{lng}}/{{ns}}.json`,
        },
        detection: {
            order: ['path', 'querystring', 'cookie', 'header'],
            lookupFromPathIndex: 0,
        },
        returnObjects:true
    });

export default i18next;