const {createLogger, transports} = require("winston");
const winstonElasticsearch = require('winston-elasticsearch');
require('dotenv').config()

const esTransportOpts = {
    level: 'info',
    indexPrefix: 'logging-api',
    indexSuffixPattern: 'YYYY-MM-DD',
    clientOpts : {
      cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
      },
        // node: 'https://41e254774d684a6ab9aa7ad2d1ee46cd.us-central1.gcp.cloud.es.io/',
        maxRetries: 5,
        requestTimeout: 10000,
        sniffOnStart: false,
        auth: {
            username: process.env.ELASTIC_USERNAME,
            password: process.env.ELASTIC_PASSWORD
        }
    },
    source: process.env.LOG_SOURCE || 'api'
};
const esTransport = new winstonElasticsearch.ElasticsearchTransport(esTransportOpts);

const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            json: true
        }),
        esTransport //Add es transport
    ]
});

// const { createLogger, format, transports } = require('winston');

// module.exports = createLogger({
// transports:
//     new transports.File({
//     filename: 'logs/server.log',
//     format:format.combine(
//         format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
//         format.align(),
//         format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
//     )}),
// });


// const logger = createLogger({
//   level: "debug",
//   // format: format.json(),
//   format: format.combine(format.timestamp(), format.json()),
//   transports: new transports.File({
//         filename: 'logs/servers.log',
//         // format:format.combine(
//         //     format.json(),
//         //     format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
//         //     format.align(),
//         //     format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
//         // )
//       })
// })

module.exports = logger;