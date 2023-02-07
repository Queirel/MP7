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
        servers: [{
            url: 'http://localhost:3000/',
        }],
    },
    apis: ['./src/documentation/*.yml'],
}

module.exports = swaggerSpec