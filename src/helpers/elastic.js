
// const winstonElasticsearch = require('winston-elasticsearch');

// //...
// const esTransportOpts = {
//     level: 'info',
//     indexPrefix: 'logging-api',
//     indexSuffixPattern: 'YYYY-MM-DD',
//     clientOpts : {
//         node: process.env.ES_ADDON_URI,
//         maxRetries: 5,
//         requestTimeout: 10000,
//         sniffOnStart: false,
//         auth: {
//             username: process.env.ES_ADDON_USER,
//             password: process.env.ES_ADDON_PASSWORD
//         }
//     },
//     source: process.env.LOG_SOURCE || 'api'
// };
// const esTransport = new winstonElasticsearch.ElasticsearchTransport(esTransportOpts);

// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.Console({
//             level: 'info',
//             json: true
//         }),
//         esTransport //Add es transport
//     ]
// });





// // const { Client } = require('@elastic/elasticsearch')
// // const client = new Client({
// //   // cloud: {
// //   //   id:'634b9503d89a4506a144fcb0af4e3598:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ0MWUyNTQ3NzRkNjg0YTZhYjlhYTdhZDJkMWVlNDZjZCQyZjcyY2RhMTNjMjU0YzU5ODZmNDIwNjAzYjUxMWU1Ng=='
// //   // },
// //   node: 'https://41e254774d684a6ab9aa7ad2d1ee46cd.us-central1.gcp.cloud.es.io/',
// //   auth: {
// //     username: 'elastic',
// //     password: 'qqXUOF76VaxshiAD9sX0r661'
// //   }
// // })

// // const cliente = async () =>{
// //   const result = await client.info()
// //   return result
// // }

// // module.exports= cliente

// // 'use strict'

// // const { Client } = require('@elastic/elasticsearch')
// // const client = new Client({
// //   cloud: { id: '<cloud-id>' },
// //   auth: { apiKey: 'base64EncodedKey' }
// // })

// // async function run () {
// //   // Let's start by indexing some data
// //   await client.index({
// //     index: 'game-of-thrones',
// //     document: {
// //       character: 'Ned Stark',
// //       quote: 'Winter is coming.'
// //     }
// //   })

// //   await client.index({
// //     index: 'game-of-thrones',
// //     document: {
// //       character: 'Daenerys Targaryen',
// //       quote: 'I am the blood of the dragon.'
// //     }
// //   })

// //   await client.index({
// //     index: 'game-of-thrones',
// //     document: {
// //       character: 'Tyrion Lannister',
// //       quote: 'A mind needs books like a sword needs a whetstone.'
// //     }
// //   })

// //   // here we are forcing an index refresh, otherwise we will not
// //   // get any result in the consequent search
// //   await client.indices.refresh({ index: 'game-of-thrones' })

// //   // Let's search!
// //   const result= await client.search({
// //     index: 'game-of-thrones',
// //     query: {
// //       match: { quote: 'winter' }
// //     }
// //   })

// //   console.log(result.hits.hits)
// // }

// // run().catch(console.log)