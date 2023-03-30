const { Router } = require("express")
const router = Router()
const { uploadFile, getFiles, downloadFile, getFileURL } = require ( '../controllers/files.controller')

router.get('/', getFiles)
router.get('/:fileName', getFileURL)
router.get('/downloadfile/:fileName', downloadFile)
router.post('/', uploadFile)

module.exports=router