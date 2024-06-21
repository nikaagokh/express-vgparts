const definedLanguages = ['en', 'ka'];

const LanguageDetector = (req, res, next) => {
    console.log(req.path);
    const segments = req.path.split('/');
    
    console.log(segments);
    if(segments.length > 1 && isLanguageCode(segments[1])) {
        req.language = segments[1];
        req.url = req.url.substring(req.url.indexOf('/', req.url.indexOf('/') + 1));
    } else {

        req.language = 'en';
        req.url = '/';
    } 
    //next();
}

const isLanguageCode = (code) => {
    return definedLanguages.includes(code);
}

export default LanguageDetector;