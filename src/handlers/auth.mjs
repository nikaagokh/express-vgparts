import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt'; 

const SECRET_KEY = process.env.SECRET_KEY || 'nikagokh';

export const generateJWT = async (value) => {
    const {id, role, firstName} = value;
    const user = {id, role, firstName};
    const accessToken = jwt.sign({user}, SECRET_KEY, {
        expiresIn:'60600s'
    });
    const refreshToken = jwt.sign({user}, SECRET_KEY, {
        expiresIn:'36000000s'
    })
    return {accessToken, refreshToken};
}

export const generateAccess = async (user) => {
    return jwt.sign({user}, SECRET_KEY, {
        expiresIn:'600s'
    })
}

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
}

export const comparePassword = async (password, hashedpassword) => {
    console.log(password);
    console.log(hashedpassword);
    return await bcrypt.compare(password, hashedpassword);
}

