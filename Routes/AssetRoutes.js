const AssetController = require('../Controllers/AssetController')

const express = require('express')

const router = express.Router()

router.post('/assetregister',AssetController.assetregister)
router.get('/assetdata',AssetController.getasetdata)
router.get('/assetlog',AssetController.getasetlog)
router.get('/assetactions/:id',AssetController.getsingleaset)
router.post('/assetactions/:id',AssetController.updateasetlogs)
router.post('/damageasset',AssetController.postdamageaset)
router.get('/damageassetdata',AssetController.damageassetdata)



module.exports = router;