const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const employeeController = require('../Controllers/EmployeeController')

const express = require('express')

const router = express.Router()




router.post('/employee',employeeController.postemp)
router.post('/uploademployee',upload.single('excelFile'),employeeController.uploademployee)
router.get('/empdata',employeeController.getempdata)
router.get('/employeepenalty/:id',employeeController.getpenalty)
router.get('/employeeedit/:id',employeeController.singleempdata)
router.post('/Penaltyregister',employeeController.penaltyreg)
router.get('/penaltyhistory/:id',employeeController.getpenaltyhist)
router.get('/vacationhistory/:id',employeeController.single_Vacation_Hist)
router.post('/vacationregister',employeeController.vacationhist)
router.post('/Incidentregister',employeeController.incidentregister)
router.get('/incidenthistory/:id',employeeController.singleincidenthist)
router.delete('/deleteinc/:id/:ids',employeeController.deleteinc)
router.put('/employeeedit/:id',employeeController.updateemp)



module.exports = router;