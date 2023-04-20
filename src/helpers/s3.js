// const AWS = require('aws-sdk')
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_PUBLIC_KEY,
//     secretAccessKey:process.env.AWS_SECRET_KEY
// })

// const bucket = s3.listBuckets({}, (err, data)=>{
//     if (err) throw err
//     console.log(data)
// })

// const bucket = s3.listObjectsV2({
//     Bucket: "bucket-app-mp"
// }, (err, data)=>{
//     if (err) throw err
//     console.log(data )
// })

// module.exports={bucket}

// const { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } =require(  '@aws-sdk/client-s3')
// const fs =require( 'fs')
// const {getSignedUrl} =require(  '@aws-sdk/s3-request-presigner')
// require('dotenv').config()

// AWS_BUCKET_NAME=process.env.AWS_BUCKET_NAME
// AWS_BUCKET_REGION=process.env.AWS_BUCKET_REGION
// AWS_PUBLIC_KEY=process.env.AWS_PUBLIC_KEY
// AWS_SECRET_KEY=process.env.AWS_SECRET_KEY

// const client = new S3Client({
//     region: AWS_BUCKET_REGION,
//     credentials: {
//         accessKeyId: AWS_PUBLIC_KEY,
//         secretAccessKey: AWS_SECRET_KEY
//     }
// })

// const uploadFileS3 = async (file) =>{
//     const stream = fs.createReadStream(file.tempFilePath)
//     const uploadParams = {
//         Bucket: AWS_BUCKET_NAME,
//         Key: file.name,
//         Body: stream
//     }
//     const command = new PutObjectCommand(uploadParams)
//     return await client.send(command)
// }

// const getFilesS3 = async () =>{
//     const command = new ListObjectsCommand({
//         Bucket: AWS_BUCKET_NAME
//     })
//     return await client.send(command)
// }

// const getFileS3 = async () =>{
//     const command = new GetObjectCommand({
//         Bucket: AWS_BUCKET_NAME,
//         Key: filename
//     })
//     return await client.send(command)
// }

// const downloadFileS3 = async () => {
//     const command = new GetObjectCommand({
//         Bucket: AWS_BUCKET_NAME,
//         Key: filename
//     })
//     const result = await client.send(command)
//     console.log(result)
//     result.Body.pipe(fs.createWriteStream(`./images/${filename}`))
// }

// const getFileURLS3 = async () =>{
//     const command = new GetObjectCommand({
//         Bucket: AWS_BUCKET_NAME,
//         Key: filename
//     })
//     return await getSignedUrl(client, command, { expiresIn: 3600 })
// }

// module.exports={
//     uploadFileS3,
//     getFilesS3,
//     getFileS3,
//     downloadFileS3,
//     getFileURLS3
// }