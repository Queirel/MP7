/**
 * @swagger
 * components:
 *   schemas:
 *     Transactions:
 *       description: Transactions properties
 *       type: object
 *       required:
 *         - trans_prod_id
 *         - trans_buy_user_id
 *         - trans_prod_quantity
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique and auto-generated/increment id of the transaction
 *         trans_prod_id:
 *           type: integer
 *           description: Id of the product
 *         trans_buy_user_id:
 *           type: integer
 *           description: Id of the buyer
 *         trans_prod_quantity:
 *           type: integer
 *           description: Products quantity
 *         trans_cancel:
 *           type: boolean
 *           description: Transaction is cancel
 *         createdAt:
 *           type: date
 *           description: Transaction creation date
 *         updateAt:
 *           type: date
 *           description: Transaction update date
 *       example:
 *         id: 8
 *         trans_prod_id: 2
 *         trans_buy_user_id: 2
 *         trans_prod_quantity: 12
 *         trans_cancel: false
 *         createdAt: 10/02/2023
 *         updateAt: 11/02/2023
 */

/**
  * @swagger
  * tags:
  *   name: Transactions
  *   description: The transactions managing API
  */


/**
 * @swagger
 * /transactions:
 *   get:
 *     description: To see a list of the own transactions
 *     summary: Returns the list of the own transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: The list of the own transactions
 *       403:
 *         description: You must be logged
 *       404:
 *         description: There are no transactions
 *       500:
 *         description: An unexpected error occurred. please try again later
 */


/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     description: To see an own transaction by id
 *     summary: Get the transaction by id
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Transaction id
 *     responses:
 *       200:
 *         description: Transaction by id
 *       401:
 *         description: You do not have access
 *       500:
 *         description: An unexpected error occurred. please try again later
 */

/**
 * @swagger
 * /transactions:
 *  post:
 *    description: Create a transaction
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              trans_prod_id:
 *                type: integer
 *              trans_prod_quantity:
 *                type: integer
 *            required:
 *              - trans_prod_id
 *              - trans_prod_quantity
 *    summary: Create a transaction
 *    tags: [Transactions]
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
 * /transactions/{id}:
 *  put:
 *    description: Cancel an own transaction by id
 *    summary: Cancel a transaction
 *    tags: [Transactions]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The transaction id
 *    responses:
 *      200:
 *        description: The transaction was cancelled // is already cancelled
 *      401:
 *        description: You must be logged
 *      404:
 *        description: You dont have access
 *      500:
 *        description: An unexpected error occurred. please try again later
 */