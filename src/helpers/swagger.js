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
            url: 'http://localhost:3000/',
        }],
    },
    // apis: ['./src/controllers/*.js'],
   apis: ['./src/documentation/*.js']
}

module.exports = swaggerSpec