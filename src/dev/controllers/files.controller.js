const { uploadFileS3, getFileS3, getFilesS3, downloadFileS3, getFileURLS3 } = require ( '../helpers/s3')

const getFiles = async (req, res) => {
    const result = await getFilesS3()
    res.json(result.Contents)
}

const getFile = async (req, res) => {
    const filename = req.params.fileName
    const result = await getFileS3(filename)
    console.log(result)
    // res.json({result})
}

const getFileURL =  async (req, res) => {
    const filename = req.params.fileName
    const result = await getFileURLS3(filename)
    res.json({
        url: result
    })
}

const downloadFile = async (req, res) => {
    const filename = req.params.fileName
    await downloadFileS3(filename)
    res.json({message: "archivo descargado"})
}

const uploadFile = async (req, res) => {
    // console.log(req.files.file)
    const filename = req.files.file
    await uploadFileS3(filename)
    // res.json({ result })
    const result = await getFileS3(filename.name)
    console.log(result.req)
}

module.exports={
    uploadFile,
    getFiles,
    downloadFile,
    getFileURL,
    getFile
}