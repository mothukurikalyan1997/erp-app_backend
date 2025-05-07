const db = require('../DB/database')

const postemp = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body.emp;
    const values =  [
      req.body.emp.empfullname,
      req.body.emp.EmpID,
      req.body.emp.mobile,
      req.body.emp.emptype,
      req.body.emp.eid,
      req.body.emp.eidexp,
      req.body.emp.email,
      req.body.emp.ppnumber,
      req.body.emp.ppexp,
      req.body.emp.nationality,
      req.body.emp.externalid,
      req.body.emp.workingcompany,
      req.body.emp.worklocation,
      req.body.emp.workcity,
      req.body.emp.locationid,
      req.body.emp.joindate,
      req.body.emp.trafficcode,
      req.body.emp.license,
      req.body.emp.licenseexp,
      req.body.emp.bankname,
      req.body.emp.bankac,
      req.body.emp.iban,
      req.body.emp.personcode,
      req.body.emp.grosssalary,
      req.body.emp.salarydistributiontype,
      req.body.emp.employementtype,
      company_id
    ];
    // console.log(req.body.emp.empfullname);
    console.log(values);
    const q = 'INSERT INTO employee (`empfullname`,`EmpID`,`mobile`,`emptype`,`eid`,`eidexp`,`email`,`ppnumber`,`ppexp`,`nationality`,`externalid`,`workingcompany`,`worklocation`,`workcity`,`locationid`,`joindate`,`trafficcode`,`license`,`licenseexp`,`bankname`,`bankac`,`iban`,`personcode`,`grosssalary`,`salarydistributiontype`,`employementtype`,`company_id`) VALUES (?)';
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const getempdata = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const q = `SELECT * FROM employee where company_id = ${company_id}`;
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

//   Employee Actions

const getpenalty = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const q = `SELECT * FROM employee WHERE EmpID = ? and company_id = ${company_id}`;
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const penaltyreg = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    const values = [
      vv.penalty.EmpID,
      vv.penalty.empfullname,
      vv.penalty.penaltydate,
      vv.penalty.penaltydays,
      vv.penalty.reason,
      company_id
    ];
    console.log(values);
    const q = 'INSERT INTO penalty_register (`EmpID`,`empfullname`,`penaltydate`,`penaltydays`,`reason`,`company_id`) VALUES (?)';
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const getpenaltyhist = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const q = `SELECT * FROM penalty_register WHERE EmpID = ? and company_id = ${company_id}`;
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const single_Vacation_Hist = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const q = `SELECT * FROM vacation_register WHERE EmpID = ? and company_id = ${company_id}`;
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const vacationhist = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    const values = [
      vv.vacation.EmpID,
      vv.vacation.empfullname,
      vv.vacation.vacationstart,
      vv.vacation.vacationend,
      vv.vacation.comment,
      company_id
    ];
    console.log(values);
    // console.log(values);
    const q = 'INSERT INTO vacation_register (`EmpID`,`empfullname`,`vacationstart`,`vacationend`,`comment`,`company_id`) VALUES (?)';
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const incidentregister = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    const values = [
      vv.incident.EmpID,
      vv.incident.employeename,
      vv.incident.incidentdate,
      vv.incident.inctype,
      vv.incident.incidentcat,
      vv.incident.actiontype,
      vv.incident.days,
      vv.incident.reportedby,
      vv.incident.remark,
      company_id
    ];
    console.log(values);
    const q = 'INSERT INTO EmployeeIncidents (`EmpID`,`employeename`,`incidentdate`,`inctype`,`incidentcat`,`actiontype`,`days`,`reportedby`,`remark`,`company_id`) VALUES (?)';
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const singleincidenthist = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const q = `SELECT * FROM employeeincidents WHERE EmpID = ? and company_id = ${company_id}`;
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }



  module.exports = {postemp,getempdata,
    getpenalty,penaltyreg,getpenaltyhist,single_Vacation_Hist,vacationhist,incidentregister,
    singleincidenthist
  }