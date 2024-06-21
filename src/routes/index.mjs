import { Router } from "express";
import usersRouter from './users.mjs';
import productsRouter from './products.mjs';
import uploadsRouter from './uploads.mjs';
import categoryRouter from './category.mjs';
import cartRouter from './cart.mjs';
import favoriteRouter from './favorite.mjs';
import chatRouter from './chat.mjs';
import viewRouter from './view.mjs';
import languageRouter from './language.mjs';
import themeRouter from './theme.mjs';


const router = Router();

router.use(viewRouter);
router.use('/api/theme', themeRouter);
router.use('/api/lng', languageRouter);
router.use('/api/user', usersRouter);
router.use('/api/product', productsRouter);
router.use('/api/category', categoryRouter);
router.use('/api/cart', cartRouter);
router.use('/api/favorite', favoriteRouter);
router.use('/api/upload', uploadsRouter);
router.use('/api/chat', chatRouter);

export default router;