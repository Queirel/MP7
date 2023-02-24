/**
  * @swagger
  * tags:
  *   name: Admin
  *   description: The user managing API
  */

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     description: Get the user complete information by id
 *     summary: To get a user by id
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user information by id
 *         content:
 *           application/json:
 *             examples:
 *               Nacho:
 *                 value:
 *                   Username: 10
 *                   Name: Juan
 *                   Lastname: Ignacio
 *                   DNI: 123456
 *                   Birthdate: 10/11/12
 *               Fede:
 *                 value:
 *                   Username: 11
 *                   Name: Federico
 *                   Lastname: Queirel
 *                   DNI: 4234234
 *                   Birthdate: 10/11/12
 *       401:
 *         description: You dont have access
 *       404:
 *         description: User does not exists
 *       500:
 *         description: An unexpected error occurred. please try again later
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     description: Get all the users
 *     summary: To get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Get all users
 *       401:
 *         description: You dont have access
 *       500:
 *         description: An unexpected error occurred. please try again later
 */

/**
 * @swagger
 * /admin/transactions:
 *   get:
 *     description: Get all the transactions
 *     summary: To get all transactions
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Get all transactions
 *       401:
 *         description: You dont have access
 *       500:
 *         description: An unexpected error occurred. please try again later
 */

/**
 * @swagger
 * /admin/transactions:
 *  post:
 *    description: Create a transaction (with user id and if its cancelled)
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              trans_prod_id:
 *                type: integer
 *              trans_buy_user_id:
 *                type: integer
 *              trans_prod_quantity:
 *                type: integer
 *              trans_cancel:
 *                type: boolean
 *            required:
 *              - trans_prod_id
 *              - trans_buy_user_id
 *              - trans_prod_quantity
 *              - trans_cancel
 *    summary: Create a transaction
 *    tags: [Admin]
 *    responses:
 *      200:
 *        description: The transaction was created
 *      403:
 *        description: You must be logged
 *      500:
 *        description: An unexpected error occurred. please try again later
 */

/**
 * @swagger
 * /admin/products:
 *  post:
 *    description: Create a product (with user id and if its published)
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
 *              prod_user_id: 
 *                type: integer
 *              prod_published: 
 *                type: boolean
 *            required:
 *              - prod_name
 *              - prod_price
 *              - prod_stock
 *              - prod_category
 *              - prod_user_id
 *              - prod_published
 *    summary: Create an own product
 *    tags: [Admin]
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
 * /admin/products/{id}:
 *  put:
 *    description: Features to change (any product and with user id)
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
 *              prod_category: 
 *                type: string
 *                enum: [agro,fashion,food,home,tecnology,tools,toys]
 *              prod_published:  
 *                type: boolean
 *              prod_user_id:  
 *                type: integer
 *    summary: Update a product by id
 *    tags: [Admin]
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
 * /admin/transactions/{id}:
 *   delete:
 *     description: Delete a transaction by id
 *     summary: Delete a transaction
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Transaction id
 *     responses:
 *       200:
 *         description: Transaction deleted
 *       401:
 *         description: You do not have access
 *       404:
 *         description: Transaction does not exists
 *       500:
 *         description: An unexpected error occurred. please try again later
 */

/**
* @swagger
* /admin/users/{id}:
*  put:
*    description: To change information by user id (with role and password)
*    parameters:
*      - in: path
*        name: id
*        schema:
*          type: integer
*        required: true
*        description: The user id
*    requestBody:
*      content:
*        application/x-www-form-urlencoded:
*          schema:
*            type: object
*            properties:
*              user_name:     
*                type: string
*              user_realname:  
*                type: string
*              user_lastname:  
*                type: string
*              user_dni:       
*                type: integer
*              user_birthdate: 
*                type: date
*    summary: Update user by id
*    tags: [Admin]
*    responses:
*      200:
*        description: The user was updated
*      401:
*        description: You must be logged
*      404:
*        description: User does not exists
*      500:
*        description: An unexpected error occurred. please try again later
*/

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     description: To delete user by id
 *     summary: Delete the user by id
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was deleted
 *       401:
 *         description: You must be logged
 *       404:
 *         description: User does not exists
 *       500:
 *         description: An unexpected error occurred. please try again later
 */

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     description: Delete a product by id
 *     summary: Delete a product by id
 *     tags: [Admin]
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
 *       401:
 *         description: You must be logged
 *       404:
 *         description: Product does not exists
 *       500:
 *         description: An unexpected error occurred. please try again later
 */

/**
* @swagger
* /admin/sign/up:
*  post:
*    description: Create a new user (Can grant a role)
*    requestBody:
*      required: true
*      content:
*        application/x-www-form-urlencoded:
*          schema:
*            type: object
*            properties:
*              user_name:     
*                type: string
*              user_password:     
*                type: string
*              user_realname:  
*                type: string
*              user_lastname:  
*                type: string
*              user_dni:       
*                type: integer
*              user_birthdate: 
*                type: date
*              user_role: 
*                type: string
*                enum: [user, admin]
*            required:
*              - user_name
*              - user_password
*              - user_realname
*              - user_lastname
*              - user_dni
*              - user_role
*              - user_birthdate
*    summary: User register
*    tags: [Admin]
*    responses:
*      200:
*        description: The user was created
*      500:
*        description: An unexpected error occurred. please try again later
*/

/**
 * @swagger
 * /admin/transactions/{id}:
 *  put:
 *    description: Update any transaction by id
 *    summary: Update any transaction
 *    tags: [Admin]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The transaction id
 *    requestBody:
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              trans_cancel:       
 *                type: boolean
 *            required:
 *              - trans_cancel
 *    responses:
 *      200:
 *        description: The transaction was updated
 *      401:
 *        description: You must be logged
 *      404:
 *        description: You dont have access
 *      500:
 *        description: An unexpected error occurred. please try again later
 */