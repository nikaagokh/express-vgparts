app.get("/", async (req, res) => {
    let user = {name:'nika', gvari:'gokhadze', id:11};
    /*
    const token = jwt.sign({user:user}, SECRET_KEY, {
        expiresIn:'3600s'
    });
    
    res.json({token})
    */
    comparePassword('abcdevzt', '$2b$12$JFRQJguNDauagEdAnuul.eLWnUOo1Ts8Yj9iYbdgyfp1cKtjrcIvy').then(s => {
        console.log(s);
        res.json(s);
    })
})

app.get("/auth", authenticateJWT ,async (req, res) => {
    console.log(123);
})


app.use(express.json());
app.use(routes);
/*
app.use(
    session({
        saveUninitialized:true,
        resave:false,
        cookie:{
            maxAge:3600000
        },
    })
)
*/


/*
export const getAllProducts = async (req, res) => {
    let sql = `SELECT * FROM product where id < ${req.params.id}`;
    const [rows] = await pool.query(sql);
    console.log(rows);
    res.send({products:rows})
}

export const getSomeProducts = async (req, res) => {
    const {yearId, id} = req.query;
    let sql = `SELECT prod.*, img.path
               FROM product prod
               LEFT JOIN image img on prod.id = img.productId
               WHERE prod.id = 1085
               `
               /*
LEFT JOIN year ON catyear.yearId = year.id
LEFT JOIN category cat ON catyear.categoryId = cat.id
LEFT JOIN product_image img ON prod.id = img.productId
WHERE categories.categoryYearId = {yearId} AND categories.productId <> {id}
LIMIT 15;
}
*/


/* es shegvidzlia gavaketot memorys gareshe handlershi da ara middlewareshi
    upload.single('file')(req, res, (err) => {
        console.log(err);
    })
    */
/*
router.post('/add',memoryUpload.single('file'),async (req, res, next) => {
    const uploadedFile = req.file;
    const fileName = `${Date.now()}-${uploadedFile.originalname}`
    fs.writeFile(path.join(process.cwd(), 'uploads', 'product', fileName), req.file.buffer, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Error writing file');
        }

        console.log('File saved successfully');
        return res.status(200).send('File saved successfully');
    });
})
*/

/*
const server = http.createServer(app);
const io = new SocketIOServer(server);

io.use(authSocket);

io.on("connection", (socket) => {
    console.log(socket);
    /*
    setUserSocket(socket.user.id, socket);
    if(socket.user.role === 'admin') {
        getSockets().forEach((socket) => {
            socket.emit('online', {online:true});
        })
    }
    socket.on("disconnect", (socket) => {
        removeUserSocket(socket.user.id);
        if(socket.user.role === 'admin') {
            getSockets().forEach((socket) => {
                socket.emit('online', {online:true});
            })
        }
    })
    socket.on("typing", (socket, data) => {
        const {personId, typing} = data;
        const userSocket = getUserSocket(personId);
        if(userSocket) {
            userSocket.emit("typing", typing);
        }
    })
    
})
*/


import express from 'express';
import routes from './src/routes/index.mjs';
import { ErrorHandler } from './src/handlers/error.mjs';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import { configureHbs } from './src/views/configure-hbs.mjs';
import session from 'express-session';
import MySqlStoreModule from 'express-mysql-session';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import http from 'http';
import socketIo from 'socket.io';
 
const PORT = process.env.PORT || 3003;
const __filename = fileURLToPath(import.meta.url);
export const  __dirname = dirname(__filename);
dotenv.config();

const app = express();
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

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "hbs");
app.use('/public', express.static(path.resolve(__dirname, "public")));

configureHbs();

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
    console.log(1);
});