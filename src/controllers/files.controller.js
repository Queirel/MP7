const { uploadFileS3, getFilesS3, downloadFileS3, getFileURLS3 } = require ( '../helpers/s3.js')

const getFiles = async (req, res) => {
    const result = await getFilesS3()
    res.json(result.Contents)
}

const getFileURL =  async (req, res) => {
    const result = await getFileURLS3(req.params.fileName)
    res.json({
        url: result
    })
}

const downloadFile = async (req, res) => {
    await downloadFileS3(req.params.fileName)
    res.json({message: "archivo descargado"})
}

const uploadFile = async (req, res) => {
    const result = await uploadFileS3(req.files.file)
    res.json({ result })
}

module.exports={
    uploadFile,
    getFiles,
    downloadFile,
    getFileURL
}