import { pool } from "../database/connect.mjs"
import { Cart } from "../models/cart.model.mjs";
import { deleteRow, insertRow, limit, throwError, updateRow } from "../utils/index.mjs";

export const addOne = async (productId, userId) => {
    const [exist] = (await pool.query(`select * from product where id = ${productId}`))[0];
    
    if(!exist) throwError("პროდუქტი ვერ მოიძებნა", 400);
    const [cart] = (await pool.query(`select * from cart where productId = ${productId} and userId =${userId}`))[0]
    return manageAdd(cart, productId, userId);
    
}

export const removeOne = async (productId, userId) => {
    const [exist] = (await pool.query(`select * from product where id = ${productId}`))[0];
    if(!exist) throwError("პროდუქტი ვერ მოიძებნა", 400);
    const cart = (await pool.query(`select * from cart where productId = ${productId} and userId =${userId}`))[0];
    return manageRemove(cart, productId, userId);
}

export const clearOne = async (productId, userId) => {
    const [exist] = (await pool.query(`select * from product where id = ${productId}`))[0];
    if(!exist) throwError("პროდუქტი ვერ მოიძებნა", 400);
    const cart = (await pool.query(`select * from cart where productId = ${productId} and userId =${userId}`))[0];
    if(!cart) throwError("პროდუქტი კალათაში არ არის", 400);
    await deleteRow('cart', {id:cart.id});
}

const manageAdd = async (cart, productId, userId) => {
    if(cart) {
        cart.quantity++;
        await updateRow('cart', cart, {id:cart.id});
    } else {
        const newCart = new Cart(productId, userId, 1);
        await insertRow('cart', newCart);
    }
}

const manageRemove = async(cart, productId, userId) => {
    if(cart && cart.quantity !== 1) {
        cart.quantity--;
        await updateRow('cart', cart, {id:cart.id});
    } else if(cart && cart.quantity === 1) {
        await deleteRow('cart', {id:cart.id});
    } else {
        throwError('პროდუქტის წაშლა ვერ მოხერხდა', 400);
    }
}