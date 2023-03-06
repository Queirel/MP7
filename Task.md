- HTTP✅
- Authentication vs Authorization✅
`- Feature Branch / Merge / Pull Request` ✅
`- Unit vs Integration Testing` ✅
`- TDD` ✅
 
Functional
`- Epic Authentication & Authorization`✅
`- Epic Products`✅
`- Epic Stock`✅
`- EPIC Filters`

Frameworks 
- REST Client: Postman✅
- REST: Express✅
- A&A: JWT✅
- ORM: Sequelize✅
- ORM: Migrations✅
`- Testing: Jest` ✅
- Documentation: Swagger✅
`- Obserbability: `
`- Dependency Injection:`

Infrastructure
- Postgress✅
- GIT✅
`- Build + Coverage`
`- AWS EC2`
`- AWS RDS`
`- CI/CD`
-` AWS Cloudwatch`
`- AWS: Fargate`


- Quitar Role de SignUp✅
- Eliminar los migrations✅
- Habilitar la creacion de tablas✅
- probar✅
- Deshabilitar la creacion de tablas✅
- Crear el migration 0.✅

- Incorporar Nombre, Apellido, DNI y Fecha de nacimiento al User✅
    `- Feature Branch - Branch - Commit - Push - Merge` ✅
    - Migration✅
    - 

`Epic Authentication & Authorization`
    - Como Guest puedo crear una cuenta de usuario
        - Agregar POST de users
            - Agregar ruta sign up
            - Agregar controller
            - Agregar bcrypt para el password 
        - Agregar a swagger
    - Como Guest puedo loguearme con una cuenta creada mediante nombre de usuario y contraseña
        - Agregar POST de sign in
            - Agregar ruta de login
            - Agregar controller
        - Agregar a Swagger
    - Como usuario o admin logueado, no podre loguearme sin antes cerrar la sesion
        - Agregar verificacion de usuario logueado en POST de sign in
    - Como User no puedo crear una cuenta sin antes cerrar la sesion
        - Agregar verificacion de usuario logueado en POST de sign up
    - Como User puedo 
    - Como Admin puedo crear cuentas de usuario con diferentes roles
        - Agregar POST de users para administrador
            - Agregar ruta
            - Agregar controller
        - Adaptar a swagger
    - Como Admin No puedo eliminar mi propia cuenta
        - Agregar restriccion al controlador la eliminacion del usuario del administrador



<!-- `Epic Products` -->

`EPIC Comprar` ✅
#    - Como User tengo que poder ver las compras realizadas
#    - Como User tengo que poder cancelar una compra
    - Como User tengo que poder listar productos
#        - Agregar GET de productos por
#           - Agregar ruta para filtrado por id
#           - Agregar ruta para filtrado por used id
#           - Agregar ruta para filtrado por categorias           
#           - Agregar controlador para filtrado por id           
#           - Agregar controlador para filtrado por user id           
#           - Agregar controlador para filtrado por categorias
#           - Agregar a swagger
    - Como User tengo que poder ver los productos del sistema
#        - Agregar GET de todos los produtos
#           - Agregar ruta para ver todos los productos
#           - Agregar controlador para ver todos los productos
#           - Agregar a swagger
    - Como User, tengo que poder comprar un producto
#        - Agregar tabla de transacciones
#           - Agregar modelo de transacciones
#           - Agregar migracion de transacciones
#           - Agregar a swagger
#        - Agregar POST de transacciones
#           - Agregar ruta para crear transacciones
#           - Agregar controlador para crear transacciones
#           - Agregar a swagger
#        - No permitir comprar un producto propio
#           - Adaptar POST de transactions
#           - Adaptar swagger
#        - No permitir comprar un producto pausado
#           - Adaptar POST de transactions
#           - Adaptar swagger

    - Como System, Cuando se compra un Product, el producto tiene que despublicarse
        - Agregar Estado al Product: Publicado | Pausado
            - Agregar la coluimna. Booleano
            - Agregar el migration
            - Modificar el modelo
            - Adaptar los GET
            - Adaptar el Swagger.
            - AGregar casos de Test
            - 8Hs
        - Permitir modificar el estado de un producto
            - Modificar el PUT
            - 1H
        - Los productos se crean publicados
            - Modificar el Post
            - 1H
        - Al crear un Transaction, Pausar el Producto
            - Modificar el Post de Transaction
            - Invocar al Put de Producto
        - Listar los productios me tiene que devolver solo los productos Publicados
            - Modificar el Get
            - 1H
        - GetProductByID me tiene que devolver el producto publicado o pausado. Siempre incluyendo el estado.
        - GetProductsByUserID solo los publicados
        - GetProductsByCategory solo los publicados

`EPIC Stocks` ✅
    - Como User puedo agregar stock a los productos cuando los creo.
        - Agregar columna stock en products mediante migration
        - Modificar model de products, agregando el stock (si la migration no lo modifica automaticamente)
            - El stock no debe ser menor a cero
        - Modificar controlador post de products del user, agregando el stock para poder elegir la cantidad al crear el producto
        - Adaptar el swagger
    - Como User, quiero poder agregar o quitar stock de los productos mios, publicados
        - Modificar controlador put de products del user, agregando el stock para poder modificarlo
        - Adaptar el swagger
    - Como User, cuando compro un producto, elijo cuantos compro.
        - Agregar columna cantidad de productos en transactions mediante migration
        - Modificar model de transactions, agregando cantidad de productos (si la migration no lo modifica automaticamente)
            - Cantidad de productos no debe ser menor a uno
        - Modificar controlador POST de transactions del user, agregando el stock para poder elegir la cantidad al crear el producto
            - Cantidad de productos no debe superar la cantidad del stock del producto
        - Adaptar el swagger
    - Como User, cuando realizo la compra de un producto puedo ver el stock restante
        - Modificar el POST de transactions
        - Adaptar el swagger
    - Como User, quiero poder ver el stock de los productos
        - Adaptar los GET.
        - Adaptar el swagger.
    - Como System, cuando stock llega a cero, se desactiva el producto.
        - Modificar POST de transactions, al crear la transaccion se dara aviso que el producto se desactiva por falta de stock
        - Modificar PUT de transactions, Desactivar el product si stock llega a cero cuando se modifica un producto
        - Adaptar el swagger
    - Como System, cuando se realiza una compra, al stock se le debe descontar la cantidad de productos.
        - Modificar POST de transactions
        - Adaptar el swagger
    - Como Admin, no puedo modificar el stock de otro usario
        - Agregar restriccion al PUT de productos de admin
    <!-- - FAlatara algun US ? -->
    - 

`Mirate unos videos de SCRUM` ✅
`Segui con Swagger` ✅



________________________________________

#   ---ROUTES---               ---ROLES---   ---PARAMS---   ---SEND BODY---  ---CODE---   ---RETURNS---


#    USERS:

GET USER BY ID                  `(GUEST)`       id                              200         user_name       
                                `(USER)`
                                `(ADMIN)`       

PUT OWN USER                    `(USER)`                    user_birthdate      200         id
                                `(ADMIN)`                   user_name                       user_name
                                                            user_realname                   user_realname
                                                            user_lastname                   user_lastname
                                                            user_dni                        user_dni
                                                                                            user_birthdate

PUT OWN USER PASSWORD           `(USER)`                    user_name
                                `(ADMIN)`                   user_password

DELETE OWN USER                 `(USER)`
                                `(ADMIN)`

GET FULL USER BY ID             `(ADMIN)`       id              

GET ALL USERS                   `(ADMIN)`                      

PUT ANY USER BY ID              `(ADMIN)`       id               

DELETE ANY USER BY ID           `(ADMIN)`       id               


#    PRODUCTS:

GET ALL PRODUCTS                `(GUEST)` 
                                `(USER)` 
                                `(ADMIN)`       
GET PRODUCT BY ID               `(GUEST)`       id
                                `(USER)`
                                `(ADMIN)`       
GET PRODUCTS BY CATEGORY        `(GUEST)`       cat
                                `(USER)`
                                `(ADMIN)`       
GET PRODUCTS BY USER ID         `(GUEST)`       id
                                `(USER)`
                                `(ADMIN)`       
POST OWN PRODUCTS               `(USER)`
                                `(ADMIN)`
PUT OWN PRODUCT BY ID           `(USER)`        id
                                `(ADMIN)`               
DELETE OWN PRODUCT BY ID        `(USER)`        id
                                `(ADMIN)`               
POST ANY PRODUCT                `(ADMIN)`                      
PUT ANY PRODUCT BY ID           `(ADMIN)`       id                
DELETE ANY PRODUCT BY ID        `(ADMIN)`       id                 


#    TRANSACTIONS:

GET OWN TRANSACTION BY ID       `(USER)`        id
                                `(ADMIN)`               
POST OWN TRANSACTION            `(USER)`
                                `(ADMIN)`
PUT OWN TRANSACTION BY ID       `(USER)`        id
                                `(ADMIN)`               
GET ALL TRANSACTIONS            `(ADMIN)`
POST ANY TRANSACTION            `(ADMIN)`
DELETE ANY TRANSACTION BY ID    `(ADMIN)`       id                      
PUT ANY TRANSACTION BY ID       `(ADMIN)`       id                      


#    AUTH:

SIGN IN                         `(GUEST)`
SIGN UP                         `(GUEST)`
ADM SIGN UP                     `(ADMIN)`

____________________________________________________________________________________

MODELS

# USERS:  
    model:  
`        user_name`
            Allow only numbers and/or letters
            Allow only numbers
            Allow only letters
            More than 3 characters
            Less than 15 characters
            Cant be null
            Cant be missing
            Unique
`        user_realname`
            Allow only letters
            More than 3 characters
            Less than 15 characters
            Cant be null
            Cant be missing
`        user_lastname`
            Allow only letters
            More than 3 characters
            Less than 15 characters
            Cant be null
            Cant be missing
`        user_dni`
            Allow only numbers
            More than 7 characters
            Less than 11 characters
            Cant be null
            Cant be missing
`        user_birthdate`
            Allow only date
            Cant be null
            Cant be missing
`        user_password`
            Allow only numbers and/or letters and/or simbols
            Allow only numbers
            Allow only letters
            Allow only simbols
            More than 4 characters
            Less than 30 characters
            Cant be null
            Cant be missing
`        user_role`
            Allow only letters
            Allow only 'user' or 'admin'
            Default 'user'

# PRODUCTS:  
    model:  
`        prod_name`
            Allow only letters
            More than 3 characters
            Less than 15 characters
            Cant be null
            Cant be missing
`        prod_user_id`
            Allow only numbers
            Existent user
            Cant be null
            Cant be missing
`        prod_price`
            Allow only numbers
            More than 0
            Less than 1000000
            Cant be null
            Cant be missing
`        prod_stock`
            Allow only numbers
            More than 0
            Less than 100
            Cant be null
            Cant be missing
`        prod_published`
            Allow only boolean
            Default 'true'
`        prod_category`
            Allow only letters
            Allow only the category list
            Cant be null
            Cant be missing

# TRANSACTIONS:  
    model:  
`        trans_prod_id`
            Allow only numbers
            Existent product
            Published product
            Cant be null
            Cant be missing
`        trans_buy_user_id`
            Allow only numbers
            Existent user
            Cant be the owner
            Cant be null
            Cant be missing
`        trans_prod_quantity`
            Allow only numbers
            More than 0
            Less than 100
            Cant be more than existent stock
            If same as stock: prod_published: 'false'
            Cant be null
            Cant be missing

# PARAMETERS: 
`        id`
            Allow only number
            Existent user/product/transaction
`        category`
            Allow only the category list

            aws t2 micro