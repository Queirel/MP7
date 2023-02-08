[10:00, 6/2/2023] Juan Ignacio Cidre: Theory 
- HTTP
- Authentication vs Authorization
`- Feature Branch / Merge / Pull Request`
`- Unit vs Integration Testing`
`- TDD`
 
Functional
`- Epic Authentication & Authorization`
`- Epic Products`
`- Epic Stock`
`- EPIC Filters`

Frameworks
- REST Client: Postman
- REST: Express
- A&A: JWT
- ORM: Sequelize
- ORM: Migrations
`- Testing: Jest`
- Documentation: Swagger
`- Obserbability: `
`- Dependency Injection:`

Infrastructure
- Postgress
- GIT
`- Build + Coverage`
`- AWS EC2`
`- AWS RDS`
`- CI/CD`
-` AWS Cloudwatch`
`- AWS: Fargate`

[10:00, 6/2/2023] Juan Ignacio Cidre: Feb 5

- Quitar Role de SignUp
- Eliminar los migrations
- Habilitar la creacion de tablas
- probar
- Deshabilitar la creacion de tablas
- Crear el migration 0.

- Incorporar Nombre, Apellido, DNI y Fecha de nacimiento al User
    `- Feature Branch - Branch - Commit - Push - Merge`
    - Migration
    - 

EPIC Comprar
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

`EPIC Stocks`
    - Como User puedo agregar stock a los productos cuando los creo.
    - Como User, quiero poder agregar o quitar stock de los productos mios, publicados
    - Como User, cuando compro un producto, elijo cuantos compro.
    - Como System, cuando se acaba el stock, se desactiva el producto.
    - Como Admin, no puedo modificar el stock de otro usario
    - FAlatara algun US ?
    - 

`Mirate unos videos de SCRUM`
`Segui con Swagger`