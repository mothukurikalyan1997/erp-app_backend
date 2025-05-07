const Partnercontroller = require('../Controllers/Partnercontroller');

const express = require('express')

const router = express.Router()

router.get('/Consumer',Partnercontroller.getconsumer)
router.post('/Consumer',Partnercontroller.postconsumer)
router.put('/edit/:ID',Partnercontroller.consumerput)
router.delete('/consumerdelete/:ID',Partnercontroller.consumerdel)
router.get('/consumeredit/:ID',Partnercontroller.consumergetedit)

module.exports = router;