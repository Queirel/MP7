/**
  * @swagger
  * tags:
  *   name: Auth
  *   description: The authentication managing API
  */

/**
 * @swagger
 * /sign/in:
 *   post:
 *     description: User log in
 *     summary: User log in
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:     
 *                 type: string
 *               user_password:  
 *                 type: string
 *             required:
 *               - user_name
 *               - user_password
 *     responses:
 *       200:
 *         description: Logged in
 *       403:
 *         description: You are already logged
 *       404:
 *         description: Username or password incorrect
 *       500:
 *         description: Some error happened
 */

/**
* @swagger
* /sign/up:
*  post:
*    description: Create a new user
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
*            required:
*              - user_name
*              - user_password
*              - user_realname
*              - user_lastname
*              - user_dni
*              - user_birthdate
*    summary: User register
*    tags: [Auth]
*    responses:
*      200:
*        description: The user was created
*        content:
*          application/json:
*            examples:
*              Nacho:
*                value:
*                  Username: 10
*                  Name: Juan
*                  Lastname: Ignacio
*                  DNI: 123456
*                  Birthdate: 10/11/12
*              Fede:
*                value:
*                  Username: 11
*                  Name: Federico
*                  Lastname: Queirel
*                  DNI: 4234234
*                  Birthdate: 10/11/12
*      403:
*        description: You are already logged
*      500:
*        description: Some error happened
*/