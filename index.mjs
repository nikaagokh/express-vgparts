import express from 'express';
import routes from './src/routes/index.mjs';
import { ErrorHandler } from './src/handlers/error.mjs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { configureHbs } from './src/views/configure-hbs.mjs';
import i18next from './i18n.js';
import LanguageDetector from './language-detector.js';
import i18nextMiddleware from 'i18next-http-middleware';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
/* 
import session from 'express-session';
import MySqlStoreModule from 'express-mysql-session';
import mysql from 'mysql2';
import http from 'http';
import { Server } from 'socket.io';
import { configureIO } from './src/gateway/configuration.mjs';
*/
const PORT = 3001
const __filename = fileURLToPath(import.meta.url);
export const  __dirname = dirname(__filename);
dotenv.config();

const app = express();
//const server = http.createServer(app);
//const io = new Server(server);

//configureIO(io);
/*
const MySqlStore = MySqlStoreModule(session);
const dbOptions = {
    host:process.env.MYSQL_HOST,
    database:process.env.MYSQL_DATABASE,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD
}
const dbPool = mysql.createPool(dbOptions);
const sessionStore = new MySqlStore({}, dbPool);
app.use(session({
    secret:'abcd',
    resave:false,
    saveUninitialized:false,
    store:sessionStore,
    cookie:{
        maxAge:6000*1000
    }
}))
*/

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "hbs");
app.use('/public', express.static(path.resolve(__dirname, "public")));
app.use('/lng', express.static(path.resolve(__dirname, "locales")));

configureHbs();

app.use(LanguageDetector);
app.use(i18nextMiddleware.handle(i18next));
app.use(cookieParser());
app.use(express.json());
app.use(routes);
app.use(ErrorHandler);
/*
const isAuthenticated = (req, res, next) => {
    if(!req.session.user) {
        //return res.status(401).json({message:"გთხოვთ გაიაროთ რეგისტრაცია"});
        return res.redirect("/");
    }
    next();
    
}

app.post("/login", isAuthenticated , async (req, res) => {
    const register = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({name:'nika', gvari:'gokhadze'});
        }, 5000);
    })
    console.log(123);
    //req.session.user = register;
    res.send('');
})

app.get("/magaliti", (req, res) => {
    req.session.visited = true;
    res.send('abc');
});

app.get("/destroy", (req, res) => {
    req.session.destroy(err => {
        if(err) {
            
        } 
        res.clearCookie('connect.sid', { path: '/' });
        res.send('a');

    })
})
app.get("/sabab", (req, res) => {
    req.session.regenerate(e => {
        req.session.visited = false;
        res.send("added");
    })
})

app.get("/modify", (req, res) => {
    req.session.user = 'abcd';
    req.session.visited = 'ab';
    console.log(req.session)
    req.session.reload(e => {
        console.log(e);
        console.log(req.session)
    })
    res.send('a');
})

app.get("reset", (req, res) => {
    req.session.resetMaxAge();
    res.send('a');
})
*/


app.listen(PORT, () => {
    console.log('listening');
});