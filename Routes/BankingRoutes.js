const Bankingcontroller = require('../Controllers/BankingController')

const express = require('express')

const router = express.Router()

router.get('/bank/data',Bankingcontroller.getbankdata)
router.get('/bankedit/:id',Bankingcontroller.getsinglebank)
router.put('/bankupdate/:id',Bankingcontroller.bankupdate)
router.post('/bank',Bankingcontroller.insrtbank)



module.exports = router;