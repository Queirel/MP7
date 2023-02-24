/**
 * @swagger
 * components:
 *   schemas:
 *     Products:
 *       description: Products properties
 * 
 *       type: object
 *       required:
 *         - prod_name
 *         - prod_user_id
 *         - prod_price
 *         - prod_stock
 *         - prod_published
 *         - prod_category
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique and auto-generated/increment id of the product
 *         prod_name:
 *           type: string
 *           description: The name of the product
 *         prod_user_id:
 *           type: integer
 *           description: The owner of the product
 *         prod_price:
 *           type: integer
 *           description: The price of the product
 *         prod_stock:
 *           type: integer
 *           description: The stock of the product
 *         prod_published:
 *           type: boolean
 *           description: If the product is published
 *         prod_category:
 *           type: string
 *           enum: [agro,fashion,food,home,tecnology,tools,toys]
 *           description: The category of the product
 *         createdAt:
 *           type: date
 *           description: Product creation date
 *         updateAt:
 *           type: date
 *           description: Product update date
 *       example:
 *         id: 8
 *         prod_name: car
 *         prod_user_id: 2
 *         prod_price: 413
 *         prod_stock: 100
 *         prod_published: true
 *         prod_category: toys
 *         createdAt: 10/02/2023
 *         updateAt: 11/02/2023
 */

/**
  * @swagger
  * tags:
  *   name: Products
  *   description: The products managing API
  */

/**
 * @swagger
 * /products:
 *   get:
 *     description: To see a list of all the products
 *     summary: Returns the list of all the products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *       404:
 *         description: There are no products
 *       500:
 *         description: An unexpected error occurred. please try again later
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     description: To see a product by id
 *     summary: Get the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product information by id
 *       404:
 *         description: Product does not exists
 *       500:
 *         description: An unexpected error occurred. please try again later
 */

/**
 * @swagger
 * /products/category/{category}:
 *   get:
 *     description: To see a list of a products filter by the category
 *     summary: Get the product by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *                type: string
 *                enum: [agro,fashion,food,home,tecnology,tools,toys]
 *         required: true
 *         description: The product category
 *     responses:
 *       200:
 *         description: Products by category
 *       404:
 *         description: Product does not exists for the category
 *       500:
 *         description: An unexpected error occurred. please try again later
 */

/**
 * @swagger
 * /products/user/{id}:
 *   get:
 *     description: To see a list of a products filter by the user id
 *     summary: Get the products by user id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user's products
 *     responses:
 *       200:
 *         description: Products by user id
 *       404:
 *         description: There is no products from the user
 *       500:
 *         description: An unexpected error occurred. please try again later
 */

/**
 * @swagger
 * /products:
 *  post:
 *    description: Create a product
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              prod_name:     
 *                type: string
 *              prod_price:  
 *                type: integer
 *              prod_stock:       
 *                type: integer
 *              prod_category: 
 *                type: string
 *                enum: [agro,fashion,food,home,tecnology,tools,toys]
 *            required:
 *              - prod_name
 *              - prod_price
 *              - prod_stock
 *              - prod_category
 *    summary: Create an own product
 *    tags: [Products]
 *    responses:
 *      200:
 *        description: The product was created
 *      403:
 *        description: You must be logged
 *      404:
 *        description: Some error happened
 *      500:
 *        description: An unexpected error occurred. please try again later
 */

/**
 * @swagger
 * /products/{id}:
 *  put:
 *    description: Features to change
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The product id
 *    requestBody:
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              prod_name:     
 *                type: string
 *              prod_price:  
 *                type: integer
 *              prod_stock:       
 *                type: integer
 *              prod_category: 
 *                type: string
 *                enum: [agro,fashion,food,home,tecnology,tools,toys]
 *              prod_published:  
 *                type: boolean
 *    summary: Update a product by id
 *    tags: [Products]
 *    responses:
 *      200:
 *        description: The product was updated
 *      403:
 *        description: You must be logged
 *      404:
 *        description: That's not your product
 *      500:
 *        description: An unexpected error occurred. please try again later
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     description: Delete own product by id
 *     summary: Delete the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: Product deleted
 *       403:
 *         description: You must be logged
 *       404:
 *         description: That's not your product
 *       500:
 *         description: An unexpected error occurred. please try again later
 */