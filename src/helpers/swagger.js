const path = require('path')

const swaggerSpec = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Marketplace',
            version: '1.0.0',
            description:
                'Backend Marketplace',
            contact: {
                name: 'Github',
                url: 'https://github.com/Queirel/MP7',
            },
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
        servers: [{
            url: 'http://3.15.151.41:3000',
        }],
    },
   apis: ['./src/documentation/*.js']
}

module.exports = swaggerSpec