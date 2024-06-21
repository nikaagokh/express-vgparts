import { pool } from "../database/connect.mjs"
import { Favorite } from "../models/favorite.model.mjs";
import { Product } from "../models/product.model.mjs";
import { deleteRow, insertRow, limit, throwError, updateRow } from "../utils/index.mjs";

export const manageFavorites = async (prodId, userId) => {
    const [exist] = (await pool.query(`select * from product where id = ${prodId}`))[0];
    if(!exist) throwError("მსგავსი პროდუქტი ვერ მოიძებნა", 400);
    const favorited = (await pool.query(`select * from favorites where productId = ${prodId} and userId = ${userId}`))[0];
    return generateFavorites(favorited, prodId, userId);
}

export const clearFavoritesOfUser = async (userId) => {
    const [product] = (await pool.query(`select * from favorites where userId = ${userId}`))[0];
    await deleteRow('favorites', {productId:product.id});
    return {delete:true};
}

export const checkIfFavorite = async (userId, prodId) => {
    const [product] = (await pool.query(`select * from favorites where userId = ${userId} and productId = ${prodId}`))[0];
    if(!product) throwError('მსგავსი პროდუქტი ვერ მოიძებნა', 400);
    return {favorite:true};
}

const generateFavorites = async (favorited, prodId, userId) => {
    if(favorited) {
        await deleteRow('favorites', {userId, prodId});
        return {delete:true};
    } else {
        const fav = new Favorite(prodId, userId);
        await insertRow('favorites', fav);
        return {insert:true};
    }
}