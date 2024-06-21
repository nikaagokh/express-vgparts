import { pool } from "../database/connect.mjs"
import { Product } from "../models/product.model.mjs";
import { insertRow, limit } from "../utils/index.mjs";

export const getSingleProduct = async (id) => {
    let sql = `
    select prod.*, GROUP_CONCAT(img.path) as images
    from product prod
    left join image img on prod.id = img.productId
    left join product_category categories on prod.id = categories.productId
    left join category_year catyear on catyear.id = categories.categoryYearId
    left join year year on year.id = catyear.yearId
    where prod.id = ${id}
    group by prod.id;
    `
    let [row] = (await pool.query(sql))[0];
    /*
    const product = rows.reduce((acc, product) => {
        if(!acc.id) {
            acc = {...product, images:[]};
        }

        acc.images.push(product.path);
        return acc;
    }, {});
    */
    const imagesArray = row.images?.split(',');
    row.images = imagesArray;
    console.log(row);
    return row;
}

export const getProductsBySearch = async (word, offset=1, limit=22) => {
    const query = `
    select prod.*, GROUP_CONCAT(img.path) as images, GROUP_CONCAT(DISTINCT cy.yearId) as yearId from product prod
    left join image img on prod.id = img.productId
    left join product_category pc on prod.id = pc.productId
    left join category_year cy on cy.id = pc.categoryYearId
    where prod.nameGeo like '%${word}%' or prod.nameEng like '%${word}%'
    group by prod.id
    limit ${limit} offset ${offset};
    `;
    const [rows] = await pool.query(query);
    rows.forEach((row, i) => {
        const imagesArray = row.images?.split(',');
        row.images = imagesArray;
    })
    return rows;
}

export const getProductByCategoryYear = async (yearId, page=1) => {
    const query = `
    select prod.*, 
    GROUP_CONCAT(img.path) as images, 
    category.id as categoryId, 
    category.name as categoryName,
    CONCAT(MIN(year.start), '-', MAX(year.end)) as yearRange
    from product as prod
    left join image img on prod.id = img.productId
    left join product_category pc on prod.id = pc.productId
    left join category_year catyear on catyear.id = pc.categoryYearId
    left join category on category.id = catyear.categoryId
    left join year year on year.id = catyear.yearId
    where pc.categoryYearId = ${yearId}
    group by prod.id
    limit ${limit} offset ${(page-1)*limit}
    `;
    const [rows] = await pool.query(query);
    rows.forEach((row, i) => {
        const imagesArray = row.images?.split(',');
        row.images = imagesArray;
    })
    const [response] = (await pool.query(`
    select count(*) as total from product as prod
    left join product_category pc on prod.id = pc.categoryYearId
    where pc.categoryYearId = ${yearId}
    `))[0];
    const totalCount = response.total;
    const totalPagesNum = Math.ceil(totalCount / limit);
    let totalPages = [];
    for(let i = 1; i <= totalPagesNum; i++) {
        totalPages.push(i);
    }
    return {rows, totalCount, totalPages};
    
}

export const getProductsByCart = async (id) => {
    const sql = `
     SELECT prod.*, cart.quantity, img.* FROM product prod
     LEFT JOIN cart ON prod.id = cart.productId
     LEFT JOIN image img ON prod.id = img.productId 
     WHERE cart.userId = ${id};`;
    const [rows] = await pool.query(sql);
    rows.forEach((row, i) => {
        const imagesArray = row.path?.split(',');
        row.images = imagesArray;
    })
    return rows;
}


export const getProductsByFilter = async (yearIds, page=1) => {
    const placeholders = yearIds.map(() => '?').join(', ');
    const query = `
    select prod.*, 
    GROUP_CONCAT(img.path) as images, 
    category.id as categoryId, 
    category.name as categoryName,
    CONCAT(MIN(year.start), '-', MAX(year.end)) as yearRange
    from product as prod
    left join image img on prod.id = img.productId
    left join product_category pc on prod.id = pc.productId
    left join category_year catyear on catyear.id = pc.categoryYearId
    left join category on category.id = catyear.categoryId
    left join year year on year.id = catyear.yearId
    where pc.categoryYearId in (${placeholders})
    group by prod.id
    limit ${limit} offset ${(page-1)*limit}
    `;
    const [rows] = await pool.query(query, yearIds);
    rows.forEach((row, i) => {
        const imagesArray = row.images?.split(',');
        row.images = imagesArray;
    })
    const sql2 =  `
    select count(*) as total from product as prod
    left join product_category pc on prod.id = pc.categoryYearId
    where pc.categoryYearId in (${placeholders})`;
    const [response] = (await pool.query(sql2, yearIds))[0];
    const totalCount = response.total;
    console.log(response);
    const totalPagesNum = Math.ceil(totalCount / limit);
    let totalPages = [];
    for(let i = 1; i <= totalPagesNum; i++) {
        totalPages.push(i);
    }
    return {rows, totalCount, totalPages};
}

export const getProductsByDiscount = async (page=1, limiti) => {
    console.log(123);
    const limitNumber = limiti === 0 ? limit : limiti;
    
    const sql = `
      select prod.*, 
      GROUP_CONCAT(img.path) as images, 
      category.id as categoryId, 
      category.name as categoryName,
      CONCAT(MIN(year.start), '-', MAX(year.end)) as yearRange
      from product as prod
      left join image img on prod.id = img.productId
      left join product_category pc on prod.id = pc.productId
      left join category_year catyear on catyear.id = pc.categoryYearId
      left join category on category.id = catyear.categoryId
      left join year year on year.id = catyear.yearId
      where prod.discount > 0
      group by prod.id
      order by prod.discount desc
      limit ${limitNumber} offset ${(page-1)*limit};
    `
    const [rows] = await pool.query(sql);
    rows.forEach((row, i) => {
        const imagesArray = row.images?.split(',');
        row.images = imagesArray;
    })
    
    const [response] = (await pool.query(`
    select count(*) as total from product as prod
    where prod.discount > 0
    `))[0];
    const totalCount = response.total;
    const totalPagesNum = Math.ceil(totalCount / limit);
    let totalPages = [];
    for(let i = 1; i <= totalPagesNum; i++) {
        totalPages.push(i);
    }

    return {rows, totalCount, totalPages};
    
}

export const getProductsByPopular = async (page, limiti) => {
    const limitNumber = limiti === 0 ? limit : limiti;
    const sql = `
      select prod.*, 
      GROUP_CONCAT(img.path) as images, 
      category.id as categoryId, 
      category.name as categoryName,
      CONCAT(MIN(year.start), '-', MAX(year.end)) as yearRange
      from product as prod
      left join image img on prod.id = img.productId
      left join product_category pc on prod.id = pc.productId
      left join category_year catyear on catyear.id = pc.categoryYearId
      left join category on category.id = catyear.categoryId
      left join year year on year.id = catyear.yearId
      where prod.type = 0 and prod.views > 100
      group by prod.id
      order by prod.views desc
      limit ${limitNumber} offset ${(page-1)*limit};
    `
    const [rows] = await pool.query(sql);
    rows.forEach((row, i) => {
        const imagesArray = row.images?.split(',');
        row.images = imagesArray;
    })
    const [response] = (await pool.query(`
    select count(*) as total from product as prod
    where prod.type = 0 and prod.views > 100
    `))[0];
    const totalCount = response.total;
    const totalPagesNum = Math.ceil(totalCount / limit);
    let totalPages = [];
    for(let i = 1; i <= totalPagesNum; i++) {
        totalPages.push(i);
    }
    return {rows, totalCount, totalPages};
}

export const getProductsByPrius = async (page,limiti) => {
    const limitNumber = limiti === 0 ? limit : limiti;
    const [categories] = await pool.query(`select * from category where name like '%Toyota Prius%'`);
    const categoryIds = categories.map(cat => cat.id);
    const categoryPlaceholders = categoryIds.map(() => '?').join(', ');
    const cquery = `select * from category_year where categoryId in (${categoryPlaceholders})`;
    const [categoryYears] = await pool.query(cquery, categoryIds);
    const categoryYearIds = categoryYears.map((catyear) => catyear.id);
    const yearPlaceholders = categoryYearIds.map(() => '?').join(', ');
    const sql = `
      select prod.*, 
      GROUP_CONCAT(img.path) as images, 
      category.id as categoryId, 
      category.name as categoryName,
      CONCAT(MIN(year.start), '-', MAX(year.end)) as yearRange
      from product as prod
      left join image img on prod.id = img.productId
      left join product_category pc on prod.id = pc.productId
      left join category_year catyear on catyear.id = pc.categoryYearId
      left join category on category.id = catyear.categoryId
      left join year year on year.id = catyear.yearId
      where pc.categoryYearId in (${yearPlaceholders})
      group by prod.id
      order by prod.views desc
      limit ${limitNumber} offset ${(page-1)*limit};
     `
    const [rows] = await pool.query(sql, categoryYearIds);
    console.log(rows);
    rows.forEach((row, i) => {
        const imagesArray = row.images?.split(',');
        row.images = imagesArray;
    })
    const tquery = `select count(*) as total from product as prod
    left join product_category as pc on pc.productId = prod.id
    where pc.categoryYearId in (${yearPlaceholders})`;
    const [response] = (await pool.query(tquery,categoryYearIds))[0];
    const totalCount = response.total;
    const totalPagesNum = Math.ceil(totalCount / limit);
    let totalPages = [];
    for(let i = 1; i <= totalPagesNum; i++) {
        totalPages.push(i);
    }
    return {rows, totalCount, totalPages};
}

export const getProductsByCar = async (page, limiti) => {
    const limitNumber = limiti === 0 ? limit : limiti;
    const sql = `
      select prod.*, 
      GROUP_CONCAT(img.path) as images, 
      category.id as categoryId, 
      category.name as categoryName,
      CONCAT(MIN(year.start), '-', MAX(year.end)) as yearRange
      from product as prod
      left join image img on prod.id = img.productId
      left join product_category pc on prod.id = pc.productId
      left join category_year catyear on catyear.id = pc.categoryYearId
      left join category on category.id = catyear.categoryId
      left join year year on year.id = catyear.yearId
      where prod.type = 1
      group by prod.id
      limit ${limitNumber} offset ${(page-1)*limit};
    `
    const [rows] = await pool.query(sql);
    rows.forEach((row, i) => {
        const imagesArray = row.images?.split(',');
        row.images = imagesArray;
    })
    const [response] = (await pool.query(`
        select count(*) as total from product as prod
        where prod.type = 1
        `))[0];
        const totalCount = response.total;
        const totalPagesNum = Math.ceil(totalCount / limit);
        let totalPages = [];
        for(let i = 1; i <= totalPagesNum; i++) {
            totalPages.push(i);
        }
        return {rows, totalCount, totalPages};
}

export const addProduct = async (file, object) => {
    const {nameGeo, nameEng, price, type, discount, condition, description, quantity, views} = object;
    const product = new Product(nameGeo, nameEng, price, type, discount, condition, description, quantity, views);
    const addedProduct = await insertRow('product', product);
}

export const getProductsByFavorites = async (id) => {
    const sql = `
      SELECT prod.*, fav.quantity, img.path FROM product prod
      LEFT JOIN cart ON prod.id = cart.productId
      LEFT JOIN image img ON prod.id = img.productId 
      WHERE cart.userId = ${id};
    `
    const [response] = await pool.query(sql);
    return response;
}

export const getSimillars = async (id) => {
    const [exist] = await pool.query(`select * from product where id = ${id}`)
    if(exist.length === 0) {
        console.log('err');
        return;
    }
    console.log(exist)
    if(exist[0].type === 0) {
        let sql = `select * from product_category pc where pc.productId =${id} limit 1`;
        const [yearId] = await pool.query(sql);
        let sql2 = `
        select prod.*,
        GROUP_CONCAT(img.path) as images, 
        category.id as categoryId, 
        category.name as categoryName
        from product as prod
        left join image img on prod.id = img.productId
        left join product_category pc on prod.id = pc.productId
        left join category_year catyear on catyear.id = pc.categoryYearId
        left join category on category.id = catyear.categoryId
        where pc.categoryYearId = ${yearId[0]?.categoryYearId} and pc.productId <> ${id}
        group by prod.id
        limit 15
        `
        const [products] = await pool.query(sql2);
        products.forEach((row) => {
            const imagesArray = row.images?.split(',');
            row.images = imagesArray;
        })
        return products; 
    } else {
        const sql = `
        select * from product as prod
        left join image img on prod.id = img.productId
        where prod.type = 1 and prod.id <> ${id}
        `
        const [products] = await pool.query(sql);
        return products; 
    }
}