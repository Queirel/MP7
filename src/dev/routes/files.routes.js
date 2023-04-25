const { Router } = require("express")
const router = Router()
const { uploadFile, getFile, getFiles, downloadFile, getFileURL } = require ( '../controllers/files.controller')

router.get('/', getFiles)
router.get('/:fileName', getFile)
router.get('/url/:fileName', getFileURL)
router.get('/downloadfile/:fileName', downloadFile)
router.post('/', uploadFile)

module.exports=router