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
`- : `
`- Dependency Injection:`

Infrastructure
- Postgress✅
- GIT✅
`- Build + Coverage`✅
`- AWS EC2`✅
`- AWS RDS`✅
`- CI/CD`
-` AWS Cloudwatch`
`- AWS: Fargate`✅


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

`EPIC tener registro de direccion de usuarios google api para validar direcciones en geocoding` ✅
    - Como sistema, quiero poder chequear la existencia de la direccion que se provee antes de proceder
        - Agregar Geocode
        - adaptar swagger
        - añadir casos de test  
    - Como sistema, si la direccion es valida, quiero poder mostrar esa direccion en el mapa
        - Enviar el URL de la localizacion con Geocode
        - adaptar swagger
        - añadir casos de test  
    - Como sistema, si la direccion es valida, quiero guardar el place id en la base de datos de cada usuario
        - agregar migration para la direccion del usuario
        - recibir el place id con Geocode y guardar en base de datos
        - adaptar swagger
        - añadir casos de test 
    - Como user, quiero poder proporcionar mi direccion para recibir los envios
        - Items a agregar entre los datos del usuario: calle, numeracion y localidad
        - adaptar post
        - Añadir al swagger
        - añadir casos de test 
    - Como user, quiero tener la posibilidad de no agregar mi direccion al momento de la creacion del usuario
        - adaptar post
        - adaptar model
        - Añadir al swagger
        - añadir casos de test 
    - Como user quiero poder modificar mi direccion en cualquier momento
        - adaptar los put
        - Añadir al swagger
        - añadir casos de test 
    - Como user quiero poder ver mi direccion en el mapa para confirmar la localizacion
        - adaptar los post
        - adaptar swagger
        - añadir casos de test 
    - Como admin, quiero poder modificar la direccion de los usuarios
        - adaptar put 
        - adaptar swagger
        - añadir casos de test 

`EPIC Payment` ✅
    - Como system quiero poder utilizar stripe
        - agregar stripe a las transacciones
    - Como system quiero poder guardar el id de stripe al momento de la creacion del usuario
        - agregar migration para añadir columna en la tabla del usuario en la base de datos
        - adaptar los post
        - adaptar swagger
        - añadir casos de test
    - Como user, quiero poder comprar un producto
        - adaptar post
        - adaptar swagger
        - añadir casos de test  
    - Como user, quiero poder ver si el pago fue realizado con exito o rechazado
        - adaptar los get
        - adaptar swagger
        - añadir casos de test  
    - Como system se debe poder acceder a la modificacion el stock si la transaccion fue exitosa
        - adaptar los get
        - adaptar swagger
        - añadir casos de test  
    - Como system quiero poder guardar al cliente para una proxima transaccion
        - agregar migration de cliente stripe
        - agregar id del cliente en base de datos
        <!-- - Para luego ? 
    - Como sistema quiero poder guardar la tarjeta del cliente para una proxima transaccion
    - Como user, quiero poder seleccionar y comprar varios productos al mismo tiempo
    - Como user, quiero poder pagar los productos elegidos con tarjeta de credito o debito
    - Como user, quiero poder elegir pagar en una o varias cuotas -->

`EPIC product image` ✅
    - Como system quiero poder tener acceso al servicio S3 de AWS para guardar las imagenes
        - configurar conexiones al servicio
    - Como system quiero poder guardar la URL de la imagen en la base de datos
        - agregar migration para añadir columna en la tabla de productos de la base de datos
        - adaptar los post
        - adaptar swagger
        - añadir casos de test
    - Como user, quiero poder guardar la imagen de un producto
        - adaptar post
        - adaptar swagger
        - añadir casos de test  
    - Como user, quiero tener la posibilidad de no agregar la imagen del producto al momento de la creacion del mismo
        - adaptar los post
        - adaptar model
        - adaptar swagger
        - añadir casos de test  
    - Como user, quiero poder agregar o modificar la imagen del producto cuando lo requiera
        - adaptar los put
        - adaptar swagger
        - añadir casos de test  
    - Como Admin quiero poder guardar la imagen de productos a otros usuarios
        - adaptar los post
        - adaptar swagger
        - añadir casos de test
    - Como Admin quiero poder modificar la imagen de productos a otros usuarios
        - adaptar los put
        - adaptar swagger
        - añadir casos de test

`EPIC LOGS` ✅
    - Como system quiero que todos los registros generados se almacenen con Winston
        - Agregar y configurar conexion a winston
    - Como system quiero poder guardar registro de las consultas sobre las rutas
        - adaptar los logs
    - Como system quiero poder guardar registro de los errores generados
        - adaptar los logs
    - Como system quiero poder guardar registro de las advertencias
        - adaptar los logs

