import { pool } from "../database/connect.mjs"

export const getAllCategoriesWithChildren = async () => {
        const sql = `
    SELECT 
        cat.id, 
        cat.name, 
        cat.image,
        CONCAT(
            '[',
            GROUP_CONCAT(
                CONCAT(
                    '{"id":', sub.id, 
                    ',"name":"', REPLACE(sub.name, '"', '\\"'), '"',
                    ',"images":[', (
                        SELECT 
                            GROUP_CONCAT(
                                CONCAT(
                                    '{"id":', cy.id,
                                    ',"imageUrl":"', REPLACE(cy.imageUrl, '"', '\\"'), '"',
                                    ',"range":"', y.start, '-', y.end, '"}'
                                ) SEPARATOR ','
                            )
                        FROM category_year cy 
                        LEFT JOIN year y ON y.id = cy.yearId
                        WHERE cy.categoryId = sub.id
                    ), ']}'
                )
                SEPARATOR ','
            ),
            ']'
        ) AS subcategories
    FROM 
        category cat
    LEFT JOIN 
        category sub ON cat.id = sub.categoryId
    WHERE 
        cat.categoryId IS NULL
    GROUP BY 
        cat.id, cat.name;
`;
    const [rows] = await pool.query(sql);
    rows.forEach(category => {
        if (category.hasOwnProperty('subcategories')) {
            category.subcategories = JSON.parse(category.subcategories);
        }
    })
    return rows;
}

export const getAllCategories = async () => {
    const sql = `select * from category where categoryId is null`;
    const [rows] = await pool.query(sql);
    return rows;
}

export const getBreadcrumbCategory = async (id) => {
    const sql = `
    WITH RECURSIVE CTE AS (
        SELECT id, name, categoryId, image
        FROM category
        WHERE id = ${id}
        UNION ALL
        SELECT e.id, e.name, e.categoryId, e.image
        FROM category e
        INNER JOIN CTE c ON e.id = c.categoryId
    )
    SELECT * FROM CTE;
    `
    const [rows] = await pool.query(sql);
    return rows;
}

export const getChildrenCategories = async (id) => {
    const sql = `
            WITH RECURSIVE CTE AS (
                SELECT c.id, c.name, cy.imageUrl, y.start, y.end
                FROM category c
                left join category_year cy on c.id = cy.categoryId
                left join year y on cy.yearId = y.id
                WHERE c.categoryId = ${id}
                UNION ALL
                SELECT e.id, e.name, cy.imageUrl, y.start, y.end
                FROM category e
                left join category_year cy on e.id = cy.categoryId
                left join year y on cy.yearId = y.id
                INNER JOIN CTE c ON e.categoryId = c.id
            )
            SELECT * FROM CTE;
    `;
    
    const [rows] = await pool.query(sql);
    return rows;
}

export const getSubcategories = async (id) => {
    
    const sql = `
     SELECT 
        cat.id, 
        cat.name, 
        cat.categoryId, 
        CONCAT('[', GROUP_CONCAT(
            CONCAT(
                '{\"yearId\": ', catyear.id, ', \"imageUrl\": \"', catyear.imageUrl, '\"}'
            )
        ), ']') AS cyear
    FROM 
        category AS cat
    LEFT JOIN 
        category AS sub ON cat.id = sub.categoryId
    LEFT JOIN 
        category_year AS catyear ON cat.id = catyear.categoryId
    LEFT JOIN 
        year AS year ON catyear.yearId = year.id
    WHERE 
        cat.categoryId = ${id}
    GROUP BY 
        cat.id
    `
    const [rows] = await pool.query(sql);
    rows.forEach(category => {
        if (category.hasOwnProperty('cyear')) {
            category.cyear = JSON.parse(category.cyear);
        }
    })
    return rows;
}

export const getOneCategory = async (id) => {
    const sql = `select * from category where id = ${id}`;
    const [row] = (await pool.query(sql))[0];
    return row;
}