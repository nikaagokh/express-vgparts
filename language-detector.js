const definedLanguages = ['en', 'ka'];

const LanguageDetector = (req, res, next) => {
    console.log(req.path);
    const segments = req.path.split('/');
    console.log(segments);
    console.log(segments);
    if(segments.length > 1 && isLanguageCode(segments[1])) {
        console.log(2);
        req.language = segments[1];
        console.log(req.language);
        req.url = req.url.substring(req.url.indexOf('/', req.url.indexOf('/') + 1));
    } else {
        console.log(3);
        req.language = 'en';
        console.log(req.language);
        //req.url = '/';
    } 
    console.log(req.url);
    next();
}

const isLanguageCode = (code) => {
    return definedLanguages.includes(code);
}

export default LanguageDetector;