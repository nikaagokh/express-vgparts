import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { pool } from '../database/connect.mjs';
export const limit = 24;
export const offset = 15;
const SECRET_KEY = process.env.SECRET_KEY;

export const checkRoles = (roles) => {
    return (req, res, next) => {
        if(!req.user || !req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'მომხმარებელს ამ რესურსზე წვდომა არ აქვს' });
        }
        next();
    }
}



export const authenticateJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization) {
        return res.status(401).json({message:'გთხოვთ გაიარეთ რეგისტრაცია ან ავტორიზაცია'});
    }

    const token = authorization.split(' ')[1];
    if(!token) {
        return res.status(401).json({message:'გთხოვთ გაიარეთ რეგისტრაცია ან ავტორიზაცია'});
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(err) {
            return res.status(401).json({message:'გთხოვთ გაიარეთ რეგისტრაცია ან ავტორიზაცია'});
        }
        req.user = decoded.user;
        next();
    })
}

export const extractToken = (req, res, next) => {
    
    const authorization = req.headers.authorization;
    if(!authorization) {
        req.token = undefined;
        next();
    }

    const token = authorization.split(' ')[1];
    if(!token) {
        req.token = undefined;
        next();
    } else {
        req.token = token;
        next();
    }

    
}

export const getUserWithJWT = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization) {
        
        req.user = undefined;
        next();
    }

    const token = authorization.split(' ')[1];
    if(!token) {
       
        req.user = undefined;
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(err) {
           
            req.user = undefined;
            next();
        } else {
            req.user = decoded.user.id;
            next();
        }
       
    })
}

export const userIsUser = async (req, res, next) => {
    try {
        const user = req.user;
        const params = req.params;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const find = await userService.findOne(user.id);

        if (!find) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (find.id === Number(params.id)) {
            return next();
        }

        return res.status(403).json({ message: 'Forbidden' });
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

export const authSocket = (socket, next) => {
    try {
        const user = validateToken(socket);
        socket.user = user;
        next();
    } catch(err) {
        next(err);
    }
}

const validateToken = (socket) => {
    const authorization = socket.handshake.query['token'];
    console.log(authorization);
    const token = Array.isArray(authorization) ? authorization[0] : authorization;
    const payload = jwt.verify(token, `${process.env.SECRET_KEY}`);
    console.log(payload);
    return payload
}

export const throwError = (message, status) => {
    const error = new Error(message);
    error.status = 400;
    throw error;
}

export const insertRow = async (tableName, object) => {
    const columns = Object.keys(object).join(', ');
    const values = Object.values(object).map(value => pool.escape(value)).join(', ');
    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
    console.log(sql);
    //console.log(sql);
    //return await pool.query(sql);
}

export const updateRow = async (tableName, updateObject, whereObject) => {
    const setValues = Object.entries(updateObject).map(([key, value]) => `${key} = ${pool.escape(value)}`).join(', ');
    console.log(setValues)
    const whereValues = Object.entries(whereObject).map(([key, value]) => `${key} = ${pool.escape(value)}`).join(' AND ');
    const sql = `UPDATE ${tableName} SET ${setValues} WHERE ${whereValues}`;
    console.log(sql);
    return await pool.query(sql);
}

export const upsertRow = async (tableName, object, whereObject) => {
    const [updateResult] = await updateRow(tableName, object, whereObject);
    if (updateResult.affectedRows === 0) {
        await insertRow(tableName, object);
    }
}

export const deleteRow = async (tableName, whereObject) => {
    const whereValues = Object.entries(whereObject).map(([key, value]) => `${key} = ${pool.escape(value)}`).join(' AND ');
    const sql = `DELETE FROM ${tableName} WHERE ${whereValues}`;
    console.log(sql);
    await pool.query(sql);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = '';
      if (req.baseUrl === '/api/product') {
        uploadPath = 'uploads/product';
      } else if (req.baseUrl === '/api/category') {
        uploadPath = 'uploads/category';
      } else if(req.baseUrl === '/api/subcategory') {
        uploadPath = 'uploads/subcategory';
      }
      const fullPath = path.join(process.cwd(), uploadPath)
      fs.mkdirSync(fullPath, { recursive: true }); // Ensure the directory exists
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  

export const upload = multer({storage});
export const memoryUpload = multer({storage:multer.memoryStorage()});