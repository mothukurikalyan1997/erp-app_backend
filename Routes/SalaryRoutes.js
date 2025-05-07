const SalaryController = require('../Controllers/salaryController')

const express = require('express')

const router = express.Router()

router.post('/salaryregister',SalaryController.postsalary)
router.get('/employee/employeesaltable',SalaryController.getsaltable)
router.get('/employee/empsaledit/:id/:month/:year',SalaryController.getsaldata)
router.put('/employee/empsalupdate/:ID',SalaryController.empsalupdate)
router.put('/updatesalded',SalaryController.updateded)



module.exports = router;