const { Router } = require("express")
const router = Router()
const { getGeocode } = require ( '../controllers/geocode.controller')

router.post('/', getGeocode)

module.exports=router