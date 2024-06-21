import nodemailer from 'nodemailer';
import { pool } from "../database/connect.mjs";
import { OtpUser } from "../models/userotp.model.mjs";
import { throwError, insertRow, updateRow, deleteRow } from "../utils/index.mjs";
import { comparePassword, generateAccess, generateJWT, hashPassword } from "./auth.mjs";
import { User, UserRole } from '../models/user.model.mjs';

const transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth: {
        user: "vgparts.info@gmail.com",
        pass: "jtbv qckw whtm fuwf",
    }
    
});

export const updatePassword = async (oldPassword, newPassword, id) => {
    const [user] = (await pool.query(`select * from user where id = ${id}`))[0];
    if(!user) throwError('მომხმარებელი ვერ მოიძებნა', 400);
    const match = await comparePassword(oldPassword, user.password);
    if(user.password !== 'undefined' && match || user.password === 'undefined') {
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await updateRow('user', user, {id})
    } else if(user.password !== 'undefined' && !match) {
        throwError('პაროლი არასწორია', 400);
    }
    return {updated:true};
}

export const verifyRenewOtp = async (pin) => {
    const exist = await otpPin(pin);
    if(!exist) throwError("არასწორი პინი", 400);
    const dateUtc = new Date();
    const now = new Date(dateUtc.getTime() - dateUtc.getTimezoneOffset() * 60 * 1000);
    const otpDate = otp.updated !== undefined ? otp.updated : otp.created;
    const diff = (now.getTime() - otpDate.getTime()) / 60000;
    if(diff > 5) throwError("5 წუთიანი შუალედი გავიდა, კიდევ სცადეთ", 400);
    return {done:true, pin};
}

export const verifyOtp = async (pin) => {
    const otp = await otpPin(pin);
    console.log(otp);
    if(!otp || otp.otp !== pin) {
        await deleteRow('otp_user', {otp:pin});
        throwError("თქვენი პინი არასწორია", 400);
    }
    return await registerOtpUser(otp);
}


export const changePassword = async (pin, password) => {
    const otpUser = await otpPin(pin);
    if(!otpUser) throwError("პაროლის შეცვლა ვერ მოხერხდა", 400);
    console.log(otpUser);
    const user = await userExists(otpUser.email);
    if(!user) throwError("მსგავსი მომხმარებელი ვერ მოიძებნა", 400);
    user.password = await hashPassword(password);
    await deleteRow('otp_user', {pin});
    await updateRow('user', user, {id:user.id});
    return otpUser;
}

export const registerUser = async (user) => {
    //const exist = await userExists(user.email);
    //if(exist) throwError('მომხმარებელი ვერ მოიძებნა', 400);
    const pin = generatePinCode();
    console.log(pin);
    const verifyUser = await sendOtp(user.email, pin);
    if(verifyUser) {
       const otpUser = new OtpUser();
       otpUser.otp = pin;
       otpUser.firstName = user.firstName;
       otpUser.lastName = user.lastName;
       otpUser.email = user.email;
       otpUser.password = user.password;
       await insertRow('otp_user', otpUser);
    }
    return {done:true};
    
}

export const loginUser = async (user) => {
    const validate = await validateUser(user);
    const jwt = generateJWT(validate);
    return jwt;
}

export const refreshToken = async (user) => {
    const token = generateAccess(user);
    return {accessToken:token};
}

export const verifyMail = async(email) => {
    const existUser = await userExists(email);
    if(!existUser) throwError('მსგავსი მეილი ვერ მოიძებნა', 400);
    const pin = generatePinCode();
    const sendOtp = await sendOtp(email, pin);
    if(sendOtp) {
        const exist = await otpExists(email);
        if(exist) {
            exist.email = email;
            exist.otp = pin;
            await updateRow('otp_user', exist, {email});
        } else {
            const otpUser = new OtpUser();
            otpUser.email = email;
            otpUser.otp = pin;
            await insertRow('otp_user', otpUser);
        }
    }

    return {done:true};
}

const registerOtpUser = async (otp) => {
    const password = await hashPassword(otp.password);
    const user = new User();
    user.firstName = otp.firstName;
    user.lastName = otp.lastName;
    user.email = otp.email;
    user.password = password;
    user.role = UserRole.USER;
    console.log(user);
    await insertRow('user', user);
    return {done:true};
}

const otpPin = async (pin) => {
    const sql = `select * from otp_user where otp = ${pin}`;
    const [result] = (await pool.query(sql))[0];
    console.log(result);
    return result;
}


const validateUser = async (user) => {
    const exist = await userExists(user.email);
    if(!exist) throwError('მომხმარებელი ვერ მოიძებნა', 400);
    console.log(user);
    console.log(exist);
    const match = await comparePassword(user.password, exist.password);
    if(!match) throwError('პაროლი არასწორია', 400);
    const {password, ...result} = exist;
    return result;
}

const userExists = async (email) => {
    const sql = `select * from user where user.email = '${email}'`;
    const [exist] = (await pool.query(sql))[0];
    return exist;
}

const otpExists = async (email) => {
    const sql = `select * from otp_user where email = '${email}'`;
    const [exist] = (await pool.query(sql))[0];
}

const generatePinCode = () => {
    const otp = Math.floor(10000000 + Math.random() * 90000000);
    return otp;
}

const sendOtp = async (mail, otp) => {
    console.log(mail);
    console.log(otp);
    const info = await transporter.sendMail({
        from:'vgparts.info@gmail.com',
        to:`${mail}`,
        subject:"ვერიფიკაცია",
        text:`თქვენი ვერიფიკაციის კოდია - ${otp}`
    });
    if(info.rejected.length > 0) throwError('პრობლემა შეიქმნა მეილის გაგზავნისას, მოგვიანებით სცადეთ', 400);
    return {done:true};
}