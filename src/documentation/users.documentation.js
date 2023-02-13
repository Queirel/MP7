/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       description: Users properties
 *       type: object
 *       required:
 *          - user_name
 *          - user_realname
 *          - user_lastname
 *          - user_dni
 *          - user_birthdate
 *          - user_password
 *       properties:
 *          id:
 *              type: integer
 *              description: The unique and auto-generated/increment id of the user
 *          user_name:
 *              type: string
 *              description: The unique username
 *          user_realname:
 *              type: string
 *              description: The name of the user
 *          user_lastname:
 *              type: string
 *              description: The lastname of the user
 *          user_dni:
 *              type: integer
 *              description: The document number of the user
 *          user_birthdate:
 *              type: date
 *              description: The birthdate of the user
 *          user_password:
 *              type: string
 *              description: The account password
 *          createdAt:
 *              type: date
 *              description: User creation date
 *          updateAt:
 *              type: date
 *              description: User update date
 *       example:
 *          id: 13
 *          user_name: newuser9
 *          user_realname: Alexander
 *          user_lastname: Dewdney
 *          user_dni: 4127893
 *          user_birthdate: 10/07/1987
 *          user_password: jasd89u298idhc9034csdf23f45tg
 *          createdAt: 20/01/2023
 *          updateAt: 23/01/2023
 */

/**
  * @swagger
  * tags:
  *   name: Users
  *   description: The user managing API
  */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     description: To see the user name (Admin can also see full information of the user)
 *     summary: Get the user by id
 *     tags: [Users]
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
 *       404:
 *         description: User does not exists
 *       500:
 *         description: Some error happened
 */

/**
* @swagger
* /users:
*  put:
*    description: To change information of the own user
*    requestBody:
*      required: true
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
*            required:
*              - user_name
*              - user_realname
*              - user_lastname
*              - user_dni
*              - user_birthdate
*    summary: Update the own user
*    tags: [Users]
*    responses:
*      200:
*        description: The user was updated
*      403:
*        description: You must be logged
*      404:
*        description: User does not exists
*      500:
*        description: Some error happened
*/

/**
* @swagger
* /users:
*   delete:
*     description: To delete the own user (Admin exception)
*     summary: Remove the own user
*     tags: [Users]
*     responses:
*       200:
*         description: The user was deleted
*       403:
*        description: You must be logged
*       404:
*         description: The user was not found
*       500:
*         description: Some error happened
*/