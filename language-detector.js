const definedLanguages = ['en', 'ka'];

const LanguageDetector = (req, res, next) => {
    const segments = req.path.split('/');
    if(segments.length > 1 && isLanguageCode(segments[1])) {
        req.language = segments[1];
        console.log(req.url);
        req.url = req.url.substring(req.url.indexOf('/', req.url.indexOf('/') + 1));
        console.log(req.url);
    } else {
        req.language = 'en';
    } 
    next();
}

const isLanguageCode = (code) => {
    return definedLanguages.includes(code);
}

export default LanguageDetector;