const ExpenseController = require('../Controllers/ExpenseController');

const express = require('express')

const router = express.Router()

router.get('/expense_account',ExpenseController.getexpensecat)
router.post('/expense',ExpenseController.insertexpense)
router.post('/expensecat',ExpenseController.postexpcat)
router.get('/expensedata',ExpenseController.getexpensedata)
router.delete('/expenseremove/:ID',ExpenseController.removeexpense)
router.get('/expensecatdata',ExpenseController.expcatdata)

module.exports = router;