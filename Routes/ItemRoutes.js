const ItemController = require('../Controllers/ItemController');

const express = require('express')

const router = express.Router()

router.post('/item',ItemController.postitem)
router.get('/itemdata',ItemController.getitem)
router.delete('/itemdel/:ID',ItemController.delitem)

module.exports = router;