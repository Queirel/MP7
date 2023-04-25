
const { S3Client, PutObjectCommand, GetObjectCommand } =require(  '@aws-sdk/client-s3')
const fs =require( 'fs')
require('dotenv').config()

AWS_BUCKET_NAME=process.env.AWS_BUCKET_NAME
AWS_BUCKET_REGION=process.env.AWS_BUCKET_REGION
AWS_PUBLIC_KEY=process.env.AWS_PUBLIC_KEY
AWS_SECRET_KEY=process.env.AWS_SECRET_KEY

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
})

const uploadFile = async (file) =>{
    const stream = fs.createReadStream(file.tempFilePath)
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream,
        ACL: "public-read"
    }
    const command = new PutObjectCommand(uploadParams)
    await client.send(command)

    const command2 = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: file.name
    })
    return await client.send(command2)

}

module.exports={
    uploadFile
}