const employeeController = require('../Controllers/EmployeeController')

const express = require('express')

const router = express.Router()

router.post('/employee',employeeController.postemp)
router.get('/empdata',employeeController.getempdata)
router.get('/employeepenalty/:id',employeeController.getpenalty)
router.post('/Penaltyregister',employeeController.penaltyreg)
router.get('/penaltyhistory/:id',employeeController.getpenaltyhist)
router.get('/vacationhistory/:id',employeeController.single_Vacation_Hist)
router.post('/vacationregister',employeeController.vacationhist)
router.post('/Incidentregister',employeeController.incidentregister)
router.get('/incidenthistory/:id',employeeController.singleincidenthist)



module.exports = router;